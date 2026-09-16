# Vic's Quest — Roadmap & Status

This document tracks the Game CV (`game.html`, `cv-game.js`, `cv-game.css`). Two rounds have shipped: the original seven priorities (story, joystick, artifacts, objectives, presentation, combat feedback, ending) and the upgrade round below (upgrades, difficulty, dash, Graph Arc, boss, CV layer, phone tuning).

## Main Direction

A short dungeon-crawler route through the portfolio. Every castle is a chapter, every upgrade is a real project, and the run should leave a recruiter knowing what Victor does within four minutes, on a phone, with one thumb on a joystick.

## Round 2 — Upgrades, difficulty, and the CV layer ✅

### Every choice is an upgrade

- The Discovery panel is now **Choose your upgrade**. Each castle offers three cards: lane word (STRIKE / GUARD / FLOW, plus one ALL), upgrade name, one-line game effect, and a twelve-word "Real life" fact with the project name. Picking one reveals **In the game** / **In real life** side by side, with the project link.
- Perks are rebuilt from the collected upgrades every time (`recomputePerks`), so re-choosing inside a panel never double-applies. Multipliers multiply, booleans OR, everything else adds.
- All 21 upgrades (castle → project → upgrade):
  - AI Systems: GPU endpoints → Inference Boost (attacks 25% faster); Neo Labs → Private Vault (+40 max HP, full heal); Masscall → Agent Companion (orbiting drone).
  - Automation: AClienti → Enriched Kills (kills heal 6, elites 12); DistroNow → Multi-Shot (three arrows, +1 arc chain); self-improving loops → Self-Improving (+4% damage per kill, cap +60%).
  - Crypto Rails: $GONE → Holder Rally (shockwave on hit, clears bolts); BJJ Predict → Favorable Odds (25% crit with settlement bank); REALSOUL → x402 Rails (dash recharges 40% faster, dash-through damage).
  - Places & Projects: Terra Luna cycle → Cycle Survivor (once per castle, survive at 40%); Polygon grant → Grant Funding (healing +50%, heal 30); Hyperliquid & Thirdweb → Tooling Surfaces (reach and range).
  - Creative Factory: ClipRO → Clip Cutter (sword also cuts a 7-unit cone); AutoArt → Artist Roster (+1 drone, max 2); Streamwin → Vision-Aware (slower bolts, shooters telegraph).
  - Projects: libergent → Cost-Aware (30% less damage taken); TapTime → Checkpoint Tap (3s shield after castles and respawns, +12% speed); bvb.lol → Read the Tape (execute: +1 damage under half HP, red glow).
  - Game Worlds: Arkadia Park → Still Running (regen 3 HP/s after 3s calm); HomeSports → Importance Ranking (marker on the toughest enemy, +1 damage); Vic's Quest → Dev Mode (+1 damage everywhere, dash 50% faster, boss numbers).
- Triggered upgrades float the project name in the world (Masscall, $GONE, BJJ Predict, REALSOUL, AutoArt, "Survived the crash", +N · AClienti, Loop xN), throttled to once per six seconds per label.

### Core abilities from the job title

- **Forward Deploy** (dash) after castle 1: Shift on desktop, DASH on touch. Six units in 0.2s with invulnerability, 1.4s cooldown, direction from the joystick or facing.
- **Graph Arc** (third weapon) after castle 2: strikes the nearest enemy within 11 units and chains to up to three more within 5 units, drawn as beams. No aiming, so it is the natural phone weapon.
- Both are explained inside the reveal of the castle that unlocks them, with the title fact ("Forward Deployed: …", "Graph Engineer: …").

### Difficulty curve

- Mob count per forecourt: 4, 5, 6, 6, 7, 7, 8 (never above eight for phone GPUs). Castle 1 has no shooters; two shooters through castle 3; three from castle 4.
- +1 HP from castle 3, +1 more from castle 6. Speed ×(1 + 0.07·i), contact and bolt damage ×(1 + 0.10·i), shooters fire faster, bolts fly faster.
- Elites from castle 4 (two at castle 7): 1.3× scale, double HP, 1.4× damage, a white ring, and double kill heal.
- Falls cost only position. Two falls in the same forecourt quietly soften the pack by 25% of max HP, once. Touch devices get +0.4 sword reach, gentler knockback, and arrows that snap to a target within 18°.

### The Fragmenter

- After castle 7 the road continues to an arena. Crossing the entry line starts the fight and seals the arena.
- 26 HP, four orbiting fragments (2 HP each) that halve damage to the core while any survive, a 3-way bolt spread, contact damage.
- Phase two under half HP: fragments retire, faster volleys, a telegraphed slam every 8s (dash out of the ring), and a wave of three runners that respawns once.
- Dying in the arena puts you back at the mouth with full health; the boss resets to full only if it was above half, otherwise it keeps half.
- Seven pillars around the arena light up as it weakens. Defeating it opens the ending.

### CV layer

- Intro: role line and one-sentence pitch above the story; "Just show me the CV" button.
- **CV n/7** button in the HUD (44px tall on phones, Tab on desktop) opens the CV panel at any time: role line, core abilities, upgrades with facts and links, Self-Improving stack count, PDF CV, GitHub, X, main site, and Reset behind a confirm. After castle 7 it also offers **Skip to the summary**, so the CV is never gated behind the boss.
- Castle-cleared toasts preview the next castle's three projects. Reconnected castles show "Upgrade: <name>" plus the fact when walked past. Idle players get a one-time "Short on time? Tap CV" prompt.
- Ending: role line, run stats (time, falls, upgrades), "What Victor does" (three lines generated from the picked tags), the fit summary, CTAs with **Download PDF CV** first, your build with facts and links, and the two core abilities.

### Phone

- Thumb cluster is WEAPON, DASH (appears after the unlock), ATTACK. RESET moved into the CV panel behind a confirm. ATTACK repeats while held.
- DASH shows a conic cooldown ring; a screen-edge flash marks damage; the health bar turns orange under 40%.
- Adaptive quality on coarse pointers: pixel ratio capped at 1.5, 1024 shadow map, fewer trees, particle and beam caps; arrows and bolts share geometry and materials.
- Haptics (12 ms dash, 25 ms upgrade, 40 ms boss) when the device supports `navigator.vibrate`.

## Round 1 — Original priorities ✅

Opening story, virtual joystick, artifact discovery, castle-specific forecourt objectives (three collectible pieces per castle), "Chapter" presentation with lit-up completed castles, combat feedback (hit sparks, defeat bursts, gate animation, castle-specific enemy ornaments), and an ending with links. See the git history of this file for the original write-up.

## Decisions to confirm with the owner

- Title and pitch: "Forward Deployed Engineer & Graph Engineer" and "He turns messy workflows into working AI systems, agents, and payment rails." are printed on the intro, CV panel, and ending.
- "Skip to the summary" is available after castle 7 (recruiters can reach the ending without beating the boss).
- Card facts reuse the numbers on index.html ($10M cap, 20k+ holders, $50K grant, 100+ projects).
- Run length targets 6.5–8 minutes with a 50–70s boss. For a 4–5 minute recruiter session, drop the boss to 20 HP and remove one mob from castles 5–7.
- Dev Mode is labelled ALL instead of a lane on purpose.
- No analytics or network calls from the game.

## Still open / ideas

- Sound effects and a short music loop with a mute toggle.
- Persist the run in `localStorage` so a refresh does not lose upgrades.
- A shareable ending (copy the summary line).

## Testing notes

`cv-game.js` exposes `window.advanceTime(ms)` and `window.render_game_to_text()` (phase, player, live targets including boss and fragments, remaining objective pieces, perks, abilities, dash cooldown, boss stage/HP, pack composition per castle, collected upgrades). Serve over HTTP (`python3 -m http.server 8765`) because the game is an ES module.
