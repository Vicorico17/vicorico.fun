const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
const css = fs.readFileSync(require.resolve('../styles.css'), 'utf8');

test('Explore uses native navigation to an existing section without JavaScript', () => {
  const link = html.match(/<a\b[^>]*class="[^"]*portal-explore[^"]*"[^>]*href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  assert.ok(link, 'Explore must be a native, keyboard-accessible link');
  assert.match(link[2], /EXPLORE/);
  assert.ok(html.includes(`id="${link[1]}"`), 'Explore destination exists');
  assert.doesNotMatch(html, /scroll-locked|role="slider"|data-enter-track/);
});

test('reduced motion disables smooth anchor scrolling', () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?html\s*\{\s*scroll-behavior:\s*auto;/);
});
