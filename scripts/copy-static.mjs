import { cp } from 'node:fs/promises'
// Explicit public-file allowlist: never copy secrets, tooling, or server code.
for (const path of [
  'assets', 'vendor', 'game.html', 'ats-cv.html', 'teaching-portfolio.html',
  'styles.css', 'site.js', 'language.js', 'cv-game.css', 'cv-game.js', 'game-audio.js',
]) await cp(path, `dist/${path}`, { recursive: true })
