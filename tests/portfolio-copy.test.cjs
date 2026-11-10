const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const role = 'University tech teacher, logistics operator, and zero-human venture founder';
test('current roles include logistics without claiming angel investing', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(home.includes(role));
  assert.ok(home.includes('<li>Logistics</li>'));
  assert.ok(home.includes('I also work in logistics.'));
  assert.doesNotMatch(home, /angel investor|tech angel/i);
  for (const lang of ['en', 'ro', 'es', 'fr', 'de', 'zh-CN', 'ar']) {
    const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'assets/locales', lang + '.json'), 'utf8'));
    for (const key of [role, 'Logistics', 'I also work in logistics.']) assert.ok(dictionary[key], `${lang}: ${key}`);
    assert.ok(!Object.keys(dictionary).some(key => /angel investor|tech angel/i.test(key)));
  }
});
test('CV introduction and skills include logistics', () => {
  const cv = fs.readFileSync(path.join(root, 'ats-cv.html'), 'utf8');
  assert.ok(cv.includes('I also work in logistics.'));
  assert.ok(cv.includes('distribution engineering, logistics,'));
});
