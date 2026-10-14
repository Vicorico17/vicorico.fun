# vicorico.fun

Static personal website for `vicorico.fun`.

## Files

- `index.html` - public website home page.
- `game.html` - playable Game CV page (Vic's Quest): seven castles, upgrades that are real projects, a dash, a chain weapon, and a boss.
- `cv-game.js` / `cv-game.css` / `game-audio.js` - Three.js game logic, upgrade and perk system, panels, joystick, game styling, and generated audio.
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

## Languages

The home page starts in English. `language.js` switches its text in place using
`assets/locales/{ro,es,fr,de,zh-CN}.json`; visitors stay on the same URL and no
translation service is contacted. The dictionaries contain automatic translations,
with corrections for interface and technical terms. `en.json` records the English
source strings. When changing copy, update the matching keys in every dictionary.
Missing translations fall back to English. Brand names and live GitHub commit
messages remain in their original language. Language choices reset to English on
a fresh page load.

## Shared travel map

`api/travel-map.js` stores the public country selection under the isolated Redis
key `vicorico:travel:v1:map`. The existing Redis database's other keys are untouched.
The Vercel project needs these private environment variables:

- `TRAVEL_REDIS_URL` and `TRAVEL_REDIS_TOKEN`
- `TRAVEL_PASSWORD_HASH`: a random salt and Node-compatible scrypt hash, separated by `:`
- `TRAVEL_SESSION_SECRET`: a random signing secret

No password or connection credential belongs in Git. Authentication uses a
30-minute signed HttpOnly cookie, same-origin requests, and rate-limited password
checks. Saves validate country IDs and use an atomic revision check to avoid
silently overwriting another editing session. Saving or cancelling locks the UI.
Public maps refresh on focus and every minute while the page is visible.

The first authenticated save imports the old browser-local country selection if
no shared map exists. It must be done from the browser containing that selection.
A shared map, including an intentionally empty one, takes precedence afterward.

Run API checks with `node --test tests/travel-map.test.cjs`. Static HTTP previews
can show the page, but the shared map API requires Vercel and its environment.
