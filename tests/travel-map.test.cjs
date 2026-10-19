const test = require('node:test');
const assert = require('node:assert/strict');
const { scryptSync } = require('node:crypto');
const handler = require('../api/travel-map');
const countries = require('../lib/travel-country-ids.json');
const password = 'test-only-password';
const salt = 'test-only-salt';
process.env.TRAVEL_REDIS_URL = 'https://redis.invalid';
process.env.TRAVEL_REDIS_TOKEN = 'test-token';
process.env.TRAVEL_PASSWORD_HASH = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
process.env.TRAVEL_SESSION_SECRET = 'test-only-session-secret';
let stored = null;
let attempts = 0;
let unavailable = false;
global.fetch = async (_, options) => {
  if (unavailable) throw new Error('offline');
  const command = JSON.parse(options.body);
  let result;
  if (command[0] === 'GET') result = stored;
  else if (command[1].includes('INCR')) result = ++attempts;
  else {
    const current = stored ? JSON.parse(stored).revision : 0;
    result = current === Number(command[4]) ? 1 : 0;
    if (result) stored = command[5];
  }
  return { ok: true, json: async () => ({ result }) };
};
async function request(method, body, extra = {}) {
  const req = { method, body, headers: { host: 'vicorico.com', origin: 'https://vicorico.com', 'content-type': 'application/json', ...extra } };
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
  await handler(req, res);
  return res;
}
async function unlock() {
  const res = await request('POST', { password });
  assert.equal(res.code, 200);
  assert.match(res.headers['Set-Cookie'], /HttpOnly; Secure; SameSite=Strict/);
  return res.headers['Set-Cookie'].split(';')[0];
}
test.beforeEach(() => { stored = null; attempts = 0; unavailable = false; });
test('public reads do not grant edit access and unauthorized writes cannot change storage', async () => {
  assert.deepEqual((await request('GET')).data, { countries: null, revision: 0, updatedAt: null });
  assert.equal((await request('PUT', { countries: countries.slice(0, 27), revision: 0 })).code, 401);
  assert.equal(stored, null);
});
test('wrong password and cross-origin requests cannot unlock editing', async () => {
  assert.equal((await request('POST', { password: 'wrong' })).code, 401);
  assert.equal((await request('POST', { password }, { origin: 'https://attacker.invalid' })).code, 403);
});
test('authenticated save publishes 27 countries to all readers and clears the browser session', async () => {
  const cookie = await unlock();
  const saved = await request('PUT', { countries: countries.slice(0, 27), revision: 0 }, { cookie });
  assert.equal(saved.code, 200);
  assert.equal(saved.data.countries.length, 27);
  assert.match(saved.headers['Set-Cookie'], /Max-Age=0/);
  assert.deepEqual((await request('GET')).data, saved.data);
  assert.equal(saved.data.revision, 1);
});
test('invalid IDs, forged cookies, and stale revisions do not overwrite the shared map', async () => {
  const cookie = await unlock();
  assert.equal((await request('PUT', { countries: ['not-a-country'], revision: 0 }, { cookie })).code, 400);
  assert.equal((await request('PUT', { countries: [], revision: 0 }, { cookie: '__Host-travel-editor=9999999999999.forged' })).code, 401);
  assert.equal((await request('PUT', { countries: [countries[0]], revision: 0 }, { cookie })).code, 200);
  assert.equal((await request('PUT', { countries: [], revision: 0 }, { cookie })).code, 409);
  assert.deepEqual((await request('GET')).data.countries, [countries[0]]);
});
test('login attempts are rate limited and storage failure does not report success', async () => {
  attempts = 10;
  assert.equal((await request('POST', { password })).code, 429);
  attempts = 0;
  const cookie = await unlock();
  unavailable = true;
  assert.equal((await request('PUT', { countries: [], revision: 0 }, { cookie })).code, 503);
  assert.equal(stored, null);
});
test('logout clears session cookie', async () => {
  const result = await request('DELETE');
  assert.equal(result.code, 200);
  assert.match(result.headers['Set-Cookie'], /Max-Age=0/);
});
