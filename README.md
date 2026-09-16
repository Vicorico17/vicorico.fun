# vicorico.fun

Static personal website for `vicorico.fun`.

## Files

- `index.html` - public website home page.
- `game.html` - playable Game CV page (Vic's Quest): seven castles, upgrades that are real projects, a dash, a chain weapon, and a boss.
- `cv-game.js` / `cv-game.css` - Three.js game logic, upgrade and perk system, panels, joystick, and game-only styling.
- `GAME_ROADMAP.md` - Game CV roadmap and implementation status.
- `ats-cv.html` / `teaching-portfolio.html` - standalone CV pages.
- `styles.css` - shared screen and print styling.
- `site.js` - lightweight GitHub API integration for public repos and stars.
- `assets/vicorico-mark.svg` - local brand mark and favicon.
- `vercel.json` - Vercel static hosting settings.

## Edit

Replace the placeholder copy, contact details, project cards, experience entries, and skills with your real information.

## Preview

Open `index.html` directly in a browser to preview the home page. The game uses ES modules, so serve the folder over HTTP to play it locally:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765/game.html`.
