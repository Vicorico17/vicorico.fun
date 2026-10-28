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

The home page now uses Vite to build a React navigation island. The rest of the
site remains static HTML and JavaScript.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The component demo is at `/navbar-demo.html`.
For production, run `npm run build`, then `npm run preview`. Vercel is configured
to build and serve `dist/`; the existing `api/` functions remain server-side.
`scripts/copy-static.mjs` preserves the game, CV pages, public assets and legacy
scripts using an explicit allowlist. Vite's warnings about the two classic scripts
are expected: those scripts are copied rather than bundled.

Validation:

```bash
npm test                 # Existing native-link and API checks
npm run build           # TypeScript + production bundle
npm run test:browser    # Built site; requires Google Chrome installed
```

## React components and styling

- Reusable UI: `components/ui/` (the `@/components/ui` alias).
- Supplied navbar: `components/ui/liquid-glass-navbar.tsx`.
- Supplied demo: `components/ui/demo.tsx`.
- Site menu actions, language selection and theme integration: `src/main.tsx`.
- Tailwind v4 and shadcn tokens: `src/globals.css`.
- Existing page styles: `styles.css`.
- shadcn configuration: `components.json`; class merging helper: `lib/utils.ts`.

There was no React component directory or build system before this integration.
`components/ui/` now gives reusable components a predictable home and makes
registry imports and shadcn CLI additions resolve consistently. The `@/*` alias
points to the repository root in TypeScript and Vite.

React, TypeScript, Tailwind, Lucide and the shadcn-compatible structure are already
installed. To add another shadcn component, run `npx shadcn@latest add button`.
For a fresh project, use `npm create vite@latest my-app -- --template react-ts`,
install `tailwindcss @tailwindcss/vite`, configure the Vite plugin and `@/*` alias,
then run `npx shadcn@latest init`. See the official
[Vite/shadcn setup](https://ui.shadcn.com/docs/installation/vite) and
[Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite).
This repository deliberately omits Tailwind Preflight to preserve the existing
page defaults; utilities and theme tokens are available to new components.

The navbar accepts `items`, `defaultActive` or controlled `active`/`onChange`,
`tone`, `compact`, `sound`, `className` and `style`. It needs no router or context
provider. The site supplies English (language picker), Themes and Vico’s Quest, keeps sound
off, and retains compact text labels on mobile. The language and theme panels use
the existing site engines; the original menu is hidden after React mounts. The standalone demo retains the supplied
Nimbus icons and author credit. No image placeholders or stock images are needed.
The original water shader, drop physics and icon scenes are retained, with fixes
for resource cleanup, multiple instances, keyboard focus, reduced-motion changes
and WebGL context loss. Animation pauses when hidden or off-screen. If WebGL is
unavailable the active indicator uses CSS. Normal scrolling and the native
Explore link remain available without React.

## Languages

The home page starts in English. `language.js` switches its text in place using
`assets/locales/{ro,es,fr,de,zh-CN,ar}.json`; visitors stay on the same URL and no
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

Arabic uses right-to-left layout and “يلا نستكشف!” on the Explore link.
A neutral globe marks Arabic in the language menu. Switching to another language
restores left-to-right layout. Arabic copy is machine-translated with reviewed
interface and introductory wording; brand and repository names stay unchanged.
