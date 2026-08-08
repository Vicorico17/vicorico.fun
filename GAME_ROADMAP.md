# Vic's Quest — Future Game Improvements

This file is a planning document only. These ideas are not currently implemented.

## Main Direction

Turn the Game CV from a combat corridor with portfolio cards into a short interactive story. Keep the existing world, castles, combat, and visual style, but give every action more meaning.

## Priority 1 — Interactive Castle Artifacts

After entering a castle, let the player choose one of three artifacts connected to that subject.

Example for the AI Systems Castle:

- Model Deployment
- Private AI
- Agent Workflows

Choosing an artifact should:

1. Reveal one short real-world example.
2. Add the artifact to the player's collection.
3. Optionally link to the related project or portfolio section.
4. Change the final summary based on what the player collected.

This is the strongest next improvement because it makes the portfolio genuinely interactive without requiring a different minigame for every castle.

## Priority 2 — Opening Story

Add a concise reason for the journey before combat begins.

Possible opening:

> The systems have become fragmented.
> Cross seven castles and reconnect the world.

Keep the introduction to two or three lines and let the player begin immediately.

## Priority 3 — Mobile Joystick

Replace the mobile directional buttons with an analog-style virtual joystick.

Requirements:

- Drag in any direction to move.
- Movement speed follows the joystick distance.
- The joystick returns to the center when released.
- Keep Attack, Weapon, and Reset as separate buttons.
- Preserve WASD and arrow-key controls on desktop.
- Ensure the controls remain usable in portrait and landscape modes.

## Priority 4 — Castle-Specific Objectives

Give each castle a lightweight objective connected to its subject while reusing the current game systems.

- AI Systems: reconnect model nodes.
- Automation: repair a broken workflow.
- Crypto Rails: unlock a transaction path.
- Worked With: recover tools from previous ecosystems.
- Creative Factory: collect story or media fragments.
- Projects: choose a build artifact to inspect.
- Game Worlds: complete the final player loop.

These should be short interactions, not seven completely different games.

## Priority 5 — Stronger Castle Presentation

- Use “Chapter” or “Discovery” instead of “Castle Data.”
- Keep every story introduction to two short sentences.
- Show no more than three choices at once.
- Avoid repeating the castle name across the HUD, world label, and card.
- Make completed castles visually change or light up.

## Priority 6 — Cleaner Combat Feedback

- Hide the large attack-range circle until it is useful.
- Give mobs clearer hit and defeat feedback.
- Add a brief gate-opening animation after the final mob is defeated.
- Use different colors or small visual traits for castle-specific enemies.
- Keep combat quick so it does not delay the portfolio content.

## Priority 7 — Better Ending

After the final castle, show:

- The artifacts selected by the player.
- A short personalized summary based on those choices.
- View Selected Projects.
- Download PDF CV.
- Return to the Main Site.
- Contact or social links.

The ending should give the player a meaningful next action instead of only confirming completion.

## Suggested Implementation Order

1. Add the opening story.
2. Add the mobile joystick.
3. Build the reusable artifact-selection interface.
4. Write three artifacts for every castle.
5. Connect artifacts to real projects and portfolio sections.
6. Add castle-specific visual objectives.
7. Improve combat feedback and the final reward screen.

## Scope Guardrails

- Keep a complete playthrough under five minutes.
- Prefer short choices over long text.
- Reuse existing mechanics and visual assets where possible.
- Make portfolio evidence more important than combat difficulty.
- Keep desktop, mobile, keyboard, and touch controls supported.
- Treat the game as an optional memorable path through the portfolio, not the only way to access important information.
