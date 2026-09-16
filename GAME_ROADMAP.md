# Vic's Quest — Roadmap & Status

This document tracks the Game CV (`game.html`, `cv-game.js`, `cv-game.css`). The first seven priorities from the original plan are now implemented; the notes below describe what shipped and what is still open.

## Main Direction

Turn the Game CV from a combat corridor with portfolio cards into a short interactive story. Keep the existing world, castles, combat, and visual style, but give every action more meaning.

## Implemented

### Priority 1 — Interactive Castle Artifacts ✅

- After the forecourt objective is complete, walking into a castle opens a **Discovery** panel with exactly three artifacts for that chapter.
- Choosing an artifact reveals one short real-world example, adds it to the player's collection, and offers a link to the related project or portfolio section (opens in a new tab so the run is not lost).
- Every artifact carries a tag (infra, agents, revops, community, markets, commerce, product, creative, worlds). The ending summary is generated from the tags the player collected.
- Keyboard: `1`–`3` choose, arrow keys move focus, `Enter`/`Space` continue. Mouse and touch work on the buttons directly.
- Artifacts per castle (all copy lives in the `castles` array in `cv-game.js`):
  - AI Systems: Model Deployment, Private AI (Neo Labs), Agent Workflows (Masscall)
  - Automation: Lead Enrichment (AClienti), Distribution Pipeline (DistroNow), Self-Improving Loop
  - Crypto Rails: Community Coin ($GONE), Prediction Market (BJJ Predict / Marketz.ro), Agent Payments (REALSOUL)
  - Places & Projects: Terra Luna Cycle, Polygon Grant, Hyperliquid & Thirdweb
  - Creative Factory: Clip Engine (ClipRO), AI Artist Catalog (AutoArt / Studio Chat), Live Studio (Streamwin)
  - Projects: libergent, TapTime, bvb.lol
  - Game Worlds: Arkadia Park, Esports Signal (HomeSports / Sprite LoL), Playable Portfolio (this game)

### Priority 2 — Opening Story ✅

- A three-line intro panel: "The systems have become fragmented. Cross seven castles and reconnect the world. In every castle, choose one artifact to carry to the end."
- The player can begin immediately: the Begin button, `Enter`, `Space`, any movement key, the joystick, or the Attack button all start the run.

### Priority 3 — Mobile Joystick ✅

- The four directional buttons are replaced by an analog virtual joystick (bottom-left).
- Drag in any direction to move; speed follows the drag distance (with a small dead zone); the knob springs back to the center on release.
- Attack, Weapon, and Reset remain separate buttons (bottom-right).
- WASD and arrow keys are unchanged on desktop. Layout adapts to portrait, landscape, and very short viewports.

### Priority 4 — Castle-Specific Objectives ✅

Every forecourt has three collectible pieces among the mobs. The mechanic is the same everywhere (walk into them); the shape, wording, and layout change per castle. The gate opens only when the mobs are cleared **and** the pieces are collected.

- AI Systems: reconnect the model nodes (octahedra)
- Automation: repair the broken workflow (gear steps)
- Crypto Rails: unlock the transaction path (diamond keys)
- Places & Projects: recover tools from past ecosystems (crates)
- Creative Factory: collect the media fragments (film frames)
- Projects: gather the build blueprints (scrolls)
- Game Worlds: complete the player loop (orbiting loop tokens)

Collecting the last piece fires light beams from the pieces to the gate.

### Priority 5 — Stronger Castle Presentation ✅

- HUD cards use "Chapter N" and the panel uses "Discovery"; "Castle Data" is gone.
- Every castle introduction is two short sentences; every discovery prompt is one line.
- Never more than three choices at once.
- The castle name appears on the world label and in the discovery kicker; the HUD zone line shows the current objective or road instead.
- Completed castles light up: accent roofs and caps glow, the icon brightens, and a light column rises above the castle.

### Priority 6 — Cleaner Combat Feedback ✅

- The trigger ring around a castle is hidden until the gate is open. A sword reach ring appears only during a swing.
- Mobs spawn hit sparks when struck and burst into particles with a ground pulse when defeated.
- Gates slide down with a particle burst and pulse when the objective is complete.
- Enemies carry a castle-specific ornament (antenna, gear halo, gem, banner, film frame, wrench, pixel crown) and a body tint in the castle colour.
- Combat is quicker: brute and sentinel health reduced by one. Falling in combat now respawns at the current forecourt with full health and keeps all progress instead of restarting the whole run.
- A toast line under the HUD surfaces game messages that previously were computed but never shown.

### Priority 7 — Better Ending ✅

After the final castle the ending panel shows the collected artifacts (each with its link), a personalised summary generated from the artifact tags, and actions: View selected projects, Download PDF CV, Return to the main site, Play again, plus X and GitHub links.

## Still Open / Ideas

- Sound effects and a short music loop (with a mute toggle).
- Persist the collection in `localStorage` so a refresh mid-run does not lose artifacts.
- A shareable ending (copy a summary line or image).
- Per-castle mini-interactions beyond collecting pieces, if playtesting shows the loop needs more variety.
- Analytics events for artifact choices (Plausible is already on the main site).

## Scope Guardrails

- Keep a complete playthrough under five minutes.
- Prefer short choices over long text.
- Reuse existing mechanics and visual assets where possible.
- Make portfolio evidence more important than combat difficulty.
- Keep desktop, mobile, keyboard, and touch controls supported.
- Treat the game as an optional memorable path through the portfolio, not the only way to access important information.

## Testing Notes

`cv-game.js` exposes two hooks for automated playthroughs: `window.advanceTime(ms)` steps the simulation, and `window.render_game_to_text()` returns the phase, player position, live mob and objective positions, collected artifacts, and progress as JSON. Because the game is an ES module, serve the folder over HTTP (for example `python3 -m http.server 8765`) rather than opening `game.html` from the file system.
