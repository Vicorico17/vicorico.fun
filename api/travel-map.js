const { scryptSync, timingSafeEqual, createHmac, createHash } = require('node:crypto');
const validCountries = new Set(require('../lib/travel-country-ids.json'));
const KEY = 'vicorico:travel:v1:map';
const COOKIE = '__Host-travel-editor';
const emptyMap = () => ({ countries: null, revision: 0, updatedAt: null });

async function redis(command) {
  const response = await fetch(process.env.TRAVEL_REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.TRAVEL_REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Storage unavailable');
  const data = await response.json();
  if (data.error) throw new Error('Storage unavailable');
  return data.result;
}
function signature(value) {
  return createHmac('sha256', process.env.TRAVEL_SESSION_SECRET).update(value).digest('hex');
}
function equal(a, b) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}
function authorized(req) {
  const token = (req.headers.cookie || '').split(';').map((v) => v.trim()).find((v) => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return false;
  const [expires, mac] = token.split('.');
  return /^\d+$/.test(expires) && Number(expires) > Date.now() && typeof mac === 'string' && equal(mac, signature(expires));
}
function cookie(res, value, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}
async function readMap() {
  const raw = await redis(['GET', KEY]);
  return raw ? JSON.parse(raw) : emptyMap();
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (code, data) => res.status(code).json(data);
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return reply(405, { error: 'Method not allowed.' });
  }
  if (!['TRAVEL_REDIS_URL', 'TRAVEL_REDIS_TOKEN', 'TRAVEL_PASSWORD_HASH', 'TRAVEL_SESSION_SECRET'].every((key) => process.env[key])) {
    return reply(503, { error: 'Shared map is unavailable. Please try again later.' });
  }
  if (req.method !== 'GET') {
    if (req.headers.origin !== `https://${req.headers.host}`) return reply(403, { error: 'Request origin not allowed.' });
    if (req.method !== 'DELETE' && !req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'JSON required.' });
  }
  try {
    if (req.method === 'GET') return reply(200, await readMap());
    if (req.method === 'DELETE') {
      cookie(res, '', 0);
      return reply(200, { ok: true });
    }
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return reply(400, { error: 'Invalid request.' }); }
    }
    if (!body || typeof body !== 'object' || Buffer.byteLength(JSON.stringify(body)) > 8192) return reply(400, { error: 'Invalid request.' });
    if (req.method === 'POST') {
      const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
      const rateKey = `vicorico:travel:v1:login:${createHash('sha256').update(ip).digest('hex')}`;
      const attempts = await redis(['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n", '1', rateKey]);
      if (attempts > 10) {
        res.setHeader('Retry-After', '900');
        return reply(429, { error: 'Too many attempts. Please try again in 15 minutes.' });
      }
      if (typeof body.password !== 'string' || body.password.length > 256) return reply(401, { error: 'Incorrect password.' });
      const [salt, expected] = process.env.TRAVEL_PASSWORD_HASH.split(':');
      const actual = scryptSync(body.password, salt, 64).toString('hex');
      if (!expected || !equal(actual, expected)) return reply(401, { error: 'Incorrect password.' });
      const map = await readMap();
      const expires = String(Date.now() + 30 * 60 * 1000);
      cookie(res, `${expires}.${signature(expires)}`, 1800);
      return reply(200, map);
    }
    if (!authorized(req)) return reply(401, { error: 'Please unlock the map again before saving.' });
    const { countries, revision } = body;
    if (!Array.isArray(countries) || countries.length > validCountries.size || countries.some((id) => typeof id !== 'string' || !validCountries.has(id)) || !Number.isSafeInteger(revision) || revision < 0) {
      return reply(400, { error: 'Invalid country selection.' });
    }
    const map = { countries: [...new Set(countries)].sort(), revision: revision + 1, updatedAt: new Date().toISOString() };
    const saved = await redis(['EVAL', "local raw=redis.call('GET',KEYS[1]); local revision=0; if raw then revision=cjson.decode(raw).revision end; if revision~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1", '1', KEY, String(revision), JSON.stringify(map)]);
    if (!saved) return reply(409, { error: 'The map changed in another session. Cancel and select again to load the latest version.' });
    cookie(res, '', 0);
    return reply(200, map);
  } catch {
    return reply(503, { error: 'Shared map is unavailable. Your changes have not been saved. Please try again.' });
  }
};
