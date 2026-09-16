import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("game");
const stageNode = document.querySelector("[data-game-stage]");
const zoneNode = document.querySelector("[data-game-zone]");
const progressNode = document.querySelector("[data-game-progress]");
const progressBarNode = document.querySelector("[data-game-progress-bar]");
const mobsNode = document.querySelector("[data-game-mobs]");
const nodesNode = document.querySelector("[data-game-nodes]");
const healthNode = document.querySelector("[data-game-health]");
const healthBarNode = document.querySelector("[data-game-health-bar]");
const healthTrackNode = document.querySelector(".hud-health-track");
const weaponNodes = document.querySelectorAll("[data-game-weapon]");
const toastNode = document.querySelector("[data-game-toast]");
const cardNode = document.querySelector("[data-game-card]");
const cardKickerNode = document.querySelector("[data-game-card-kicker]");
const cardTitleNode = document.querySelector("[data-game-card-title]");
const cardCopyNode = document.querySelector("[data-game-card-copy]");
const cardListNode = document.querySelector("[data-game-card-list]");
const dashChipNode = document.querySelector("[data-game-dash]");
const dashFillNode = document.querySelector("[data-game-dash-fill]");
const dashHintNode = document.querySelector("[data-game-dash-hint]");
const bossNode = document.querySelector("[data-game-boss]");
const bossFillNode = document.querySelector("[data-game-boss-fill]");
const bossTextNode = document.querySelector("[data-game-boss-text]");
const introNode = document.querySelector("[data-game-intro]");
const discoveryNode = document.querySelector("[data-game-discovery]");
const discoveryKickerNode = document.querySelector("[data-discovery-kicker]");
const discoveryTitleNode = document.querySelector("[data-discovery-title]");
const discoveryIntroNode = document.querySelector("[data-discovery-intro]");
const discoveryChoicesNode = document.querySelector("[data-discovery-choices]");
const discoveryRevealNode = document.querySelector("[data-discovery-reveal]");
const revealLaneNode = document.querySelector("[data-reveal-lane]");
const revealTitleNode = document.querySelector("[data-reveal-title]");
const revealGameNode = document.querySelector("[data-reveal-game]");
const revealRealNode = document.querySelector("[data-reveal-real]");
const revealLinkNode = document.querySelector("[data-reveal-link]");
const revealUnlockNode = document.querySelector("[data-reveal-unlock]");
const revealUnlockTitleNode = document.querySelector("[data-reveal-unlock-title]");
const revealUnlockCopyNode = document.querySelector("[data-reveal-unlock-copy]");
const discoveryContinueNode = document.querySelector("[data-discovery-continue]");
const cvNode = document.querySelector("[data-game-cv]");
const cvAbilitiesNode = document.querySelector("[data-cv-abilities]");
const cvUpgradesNode = document.querySelector("[data-cv-upgrades]");
const cvStackNode = document.querySelector("[data-cv-stack]");
const cvSkipNode = document.querySelector("[data-cv-skip]");
const cvResetNode = document.querySelector("[data-cv-reset]");
const cvResetConfirmNode = document.querySelector("[data-cv-reset-confirm]");
const endingNode = document.querySelector("[data-game-ending]");
const endingSummaryNode = document.querySelector("[data-ending-summary]");
const endingStatsNode = document.querySelector("[data-ending-stats]");
const endingDoesNode = document.querySelector("[data-ending-does]");
const endingArtifactsNode = document.querySelector("[data-ending-artifacts]");
const endingAbilitiesNode = document.querySelector("[data-ending-abilities]");
const joystickNode = document.querySelector("[data-game-joystick]");
const joystickKnobNode = document.querySelector("[data-game-joystick-knob]");
const keys = new Set();
const movementKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"]);

const roleLine = "Forward Deployed Engineer & Graph Engineer";
const pitchLine = "He turns messy workflows into working AI systems, agents, and payment rails.";

// Every castle is one chapter of the portfolio. The forecourt objective is the
// subject-flavoured task; the three artifacts inside are real projects, and each
// grants one distinct upgrade whose effect mirrors the real fact. `fact` is the
// twelve-word version shown on the choice card; `example` is the full paragraph
// shown after picking. Perk deltas: *Mult keys multiply, booleans OR, others add.
const castles = [
  {
    id: "ai",
    chapter: 1,
    title: "AI Systems Castle",
    shortTitle: "AI Systems",
    color: "#f4bf45",
    position: [0, -24],
    intro: "The first gate hums with ideas. Here AI becomes useful work: deployed models, private data, and agents with real jobs.",
    prompt: "Three ways AI became useful work. Each one is a real project.",
    objective: { label: "Reconnect the model nodes", noun: "node", done: "Model nodes reconnected." },
    nodeShape: "octahedron",
    nodeLayout: "spread",
    trait: "antenna",
    artifacts: [
      {
        id: "model-deployment",
        title: "Model Deployment",
        project: "GPU endpoints",
        tag: "infra",
        fact: "LLMs and image models served from private GPU endpoints.",
        example:
          "Provisioned GPU VPS machines, mounted GPUs into containers, ran Kubernetes pods, and served LLMs and image models behind private inference endpoints with auth layers.",
        link: { label: "Read the AI systems chapter", href: "index.html#story-ai" },
        upgrade: { lane: "STRIKE", name: "Inference Boost", effect: "All attacks 25% faster and arrows fly faster.", perks: { cooldownMult: 0.75, arrowSpeedMult: 1.2 } },
      },
      {
        id: "private-ai",
        title: "Private AI",
        project: "Neo Labs",
        tag: "infra",
        fact: "Neo Labs: a local company operating system with agent workflows.",
        example:
          "Neo Labs is a local company operating system for running a venture studio: a portfolio dashboard, agent workflows, and portable, versioned company state that stays on your own machine.",
        link: { label: "Open Neo Labs on GitHub", href: "https://github.com/Vicorico17/neo-labs" },
        upgrade: { lane: "GUARD", name: "Private Vault", effect: "+40 max health and a full heal now.", perks: { maxHealth: 40 }, healFull: true },
      },
      {
        id: "agent-workflows",
        title: "Agent Workflows",
        project: "Masscall",
        tag: "agents",
        fact: "Masscall lets agents run calendar, email, Slack, and Notion.",
        example:
          "Masscall turns natural-language requests into coordinated work across calendars, email, Slack, and Notion, with MCP servers giving agents controlled access to tools.",
        link: { label: "Open Masscall", href: "https://masscall.vercel.app" },
        upgrade: { lane: "FLOW", name: "Agent Companion", effect: "A drone orbits you and zaps the nearest enemy every 1.5s.", perks: { companions: 1 }, sprite: "Masscall" },
      },
    ],
  },
  {
    id: "automation",
    chapter: 2,
    title: "Automation Castle",
    shortTitle: "Automation",
    color: "#7cc77d",
    position: [0, -62],
    intro: "Behind this gate, repetitive work comes alive. Every workflow gets a smarter next move.",
    prompt: "Three workflows that got a smarter next move. Each one is a real project.",
    objective: { label: "Repair the broken workflow", noun: "step", done: "Workflow repaired." },
    nodeShape: "gear",
    nodeLayout: "spread",
    trait: "gear",
    artifacts: [
      {
        id: "lead-enrichment",
        title: "Lead Enrichment",
        project: "AClienti",
        tag: "revops",
        fact: "AClienti ranks public customer signals into real opportunities.",
        example:
          "AClienti is an evidence-backed research desk that turns recent public customer signals into ranked opportunities and practical content direction, the research step that runs before any outreach.",
        link: { label: "Open AClienti on GitHub", href: "https://github.com/Vicorico17/ACLIENTI" },
        upgrade: { lane: "GUARD", name: "Enriched Kills", effect: "Every kill heals 6 health, 12 for elites.", perks: { healOnKill: 6 } },
      },
      {
        id: "distribution-pipeline",
        title: "Distribution Pipeline",
        project: "DistroNow",
        tag: "creative",
        fact: "DistroNow turns one website into posts for every platform.",
        example:
          "DistroNow turns a website into a brand profile and then into social content: Firecrawl extraction, Supabase storage, and generation wired into one distribution workflow.",
        link: { label: "Open DistroNow", href: "https://distronow.vercel.app" },
        upgrade: { lane: "STRIKE", name: "Multi-Shot", effect: "The bow fires three arrows and Graph Arc chains one more target.", perks: { arrowCount: 2, chainTargets: 1 } },
      },
      {
        id: "self-improving-loop",
        title: "Self-Improving Loop",
        project: "Self-improving loops",
        tag: "agents",
        fact: "Eval loops where agents fix their own tests and rerun CI.",
        example:
          "Eval-driven loops where agents fix their own tests, run CI/CD, and orchestrate work across repos, with review gates, confidence checks, and monitoring for failed jobs.",
        link: { label: "Read about agent orchestration", href: "index.html#story-ai" },
        upgrade: { lane: "FLOW", name: "Self-Improving", effect: "+4% damage per kill for the run, up to +60%.", perks: { killStack: 0.04, killStackCap: 0.6 } },
      },
    ],
  },
  {
    id: "crypto",
    chapter: 3,
    title: "Crypto Rails Castle",
    shortTitle: "Crypto Rails",
    color: "#4f70ff",
    position: [0, -100],
    intro: "Blue rails run beneath the world. Ownership, payments, and communities become playable systems.",
    prompt: "Three rails built through the cycles. Each one is a real project.",
    objective: { label: "Unlock the transaction path", noun: "key", done: "Transaction path unlocked." },
    nodeShape: "diamond",
    nodeLayout: "spread",
    trait: "diamond",
    artifacts: [
      {
        id: "community-coin",
        title: "Community Coin",
        project: "$GONE",
        tag: "community",
        fact: "$GONE, the biggest community coin on Polygon, 20k+ holders.",
        example:
          "$GONE became the biggest community coin on Polygon, reaching a $10M market cap and more than 20k holders, alongside $200K+ community fundraising and a $50K Polygon grant.",
        link: { label: "Read the crypto chapter", href: "index.html#story-crypto" },
        upgrade: { lane: "GUARD", name: "Holder Rally", effect: "Taking a hit sends a shockwave that knocks enemies back and clears their shots. 3s cooldown.", perks: { shockwave: true }, sprite: "$GONE" },
      },
      {
        id: "prediction-market",
        title: "Prediction Market",
        project: "BJJ Predict",
        tag: "markets",
        fact: "BJJ Predict prices outcomes with LMSR shares and always settles.",
        example:
          "BJJ Predict is a free-play prediction market built on Smoothcomp-style event data with winner shares, LMSR pricing, and leaderboards. Marketz.ro applies the same mechanics to Romanian markets.",
        link: { label: "Open BJJ Predict", href: "https://bjj-predict.vercel.app" },
        upgrade: { lane: "STRIKE", name: "Favorable Odds", effect: "25% chance to deal double damage. Every miss raises the odds until it lands.", perks: { critChance: 0.25 }, sprite: "BJJ Predict" },
      },
      {
        id: "agent-payments",
        title: "Agent Payments",
        project: "REALSOUL",
        tag: "commerce",
        fact: "REALSOUL plus x402, ACP, and AP2: payment and identity rails for agents.",
        example:
          "REALSOUL issues short-lived proof that a live human approved a specific call, message, or transaction, part of a toolkit spanning x402 payment flows, ACP checkout, AP2 agent payments, and ERC-8004 agent identity.",
        link: { label: "Open REALSOUL", href: "https://realsoul-ten.vercel.app" },
        upgrade: { lane: "FLOW", name: "x402 Rails", effect: "Dash recharges 40% faster and damages enemies you dash through.", perks: { dashCooldownMult: 0.6, dashDamage: 1 }, sprite: "REALSOUL" },
      },
    ],
  },
  {
    id: "places",
    chapter: 4,
    title: "Places & Projects Castle",
    shortTitle: "Places & Projects",
    color: "#f97316",
    position: [0, -138],
    intro: "This gate is a map of ecosystems worked with. Each one left a tool behind for the journey.",
    prompt: "Three ecosystems that left a tool behind. Each one is real experience.",
    objective: { label: "Recover tools from past ecosystems", noun: "tool", done: "Tools recovered." },
    nodeShape: "crate",
    nodeLayout: "spread",
    trait: "banner",
    artifacts: [
      {
        id: "terra-cycle",
        title: "Terra Luna Cycle",
        project: "Terra Luna cycle",
        tag: "community",
        fact: "Shipped through the Luna boom and the crash after it.",
        example:
          "Went all in on crypto during the Luna era, shipping products and communities through the NFT boom and the crash that followed, with Arkadia Park still running today.",
        link: { label: "See the career timeline", href: "index.html#career" },
        upgrade: { lane: "GUARD", name: "Cycle Survivor", effect: "Once per castle, a lethal hit leaves you at 40% health, shielded, and knocks enemies back.", perks: { survivor: true }, sprite: "Survived the crash" },
      },
      {
        id: "polygon-grant",
        title: "Polygon Grant",
        project: "Polygon grant",
        tag: "community",
        fact: "A $50K Polygon grant funded ecosystem work around $GONE.",
        example:
          "Launched and grew Polygon-native community projects, including $GONE, and received a $50K Polygon grant for ecosystem work.",
        link: { label: "See the career timeline", href: "index.html#career" },
        upgrade: { lane: "FLOW", name: "Grant Funding", effect: "All healing +50%, and heal 30 now.", perks: { healMult: 1.5 }, healNow: 30 },
      },
      {
        id: "hyperliquid-thirdweb",
        title: "Hyperliquid & Thirdweb",
        project: "Hyperliquid & Thirdweb",
        tag: "product",
        fact: "Hyperliquid research and Thirdweb tooling across 100+ projects.",
        example:
          "Hyperliquid research and Thirdweb tooling surfaces for token launches and NFT products, plus Solana tooling, across 100+ projects worked on.",
        link: { label: "See the career timeline", href: "index.html#career" },
        upgrade: { lane: "STRIKE", name: "Tooling Surfaces", effect: "Sword reach +0.9, bow range +6, arc range +3.", perks: { swordRadius: 0.9, bowRange: 6, arcRange: 3 } },
      },
    ],
  },
  {
    id: "creative",
    chapter: 5,
    title: "Creative Factory Castle",
    shortTitle: "Creative Factory",
    color: "#d95f9d",
    position: [0, -176],
    intro: "Pink lights flicker inside the factory. One idea becomes a clip, a catalog, and a reason to come back.",
    prompt: "Three pieces of the content factory. Each one is a real project.",
    objective: { label: "Collect the media fragments", noun: "fragment", done: "Fragments collected." },
    nodeShape: "frame",
    nodeLayout: "spread",
    trait: "frame",
    artifacts: [
      {
        id: "clip-engine",
        title: "Clip Engine",
        project: "ClipRO",
        tag: "creative",
        fact: "ClipRO cuts long streams into ranked short clips.",
        example:
          "ClipRO turns long-form YouTube videos and YouTube, Twitch, or Kick streams into ranked short clips ready for distribution.",
        link: { label: "Open ClipRO", href: "https://clip-ro.vercel.app" },
        upgrade: { lane: "STRIKE", name: "Clip Cutter", effect: "Every sword swing also cuts a cone seven units ahead.", perks: { coneRange: 7 } },
      },
      {
        id: "ai-artist-catalog",
        title: "AI Artist Catalog",
        project: "AutoArt",
        tag: "creative",
        fact: "AutoArt runs a roster of AI artists, catalogs, and releases.",
        example:
          "AutoArt manages AI artist catalogs, song briefs, release packages, and promo plans, while Studio Chat connects a local Codex chat flow to Logic Pro through LogicProMCP.",
        link: { label: "Open AutoArt", href: "https://autoart-nine.vercel.app" },
        upgrade: { lane: "FLOW", name: "Artist Roster", effect: "+1 companion drone, up to two.", perks: { companions: 1 }, sprite: "AutoArt" },
      },
      {
        id: "live-studio",
        title: "Live Studio",
        project: "Streamwin",
        tag: "creative",
        fact: "Streamwin watches the live feed with vision models and reacts.",
        example:
          "Streamwin combines real-time AI video, multistream distribution, IRL controls, and vision-aware Twitch automations in one interactive live studio.",
        link: { label: "Open Streamwin", href: "https://streamwin.vercel.app" },
        upgrade: { lane: "GUARD", name: "Vision-Aware", effect: "Enemy shots move 30% slower and every shooter telegraphs before firing.", perks: { boltSpeedMult: 0.7, telegraph: true } },
      },
    ],
  },
  {
    id: "projects",
    chapter: 6,
    title: "Projects Castle",
    shortTitle: "Projects",
    color: "#6fd18c",
    position: [0, -214],
    intro: "A workshop full of shipped experiments. Pick one build and see the idea made real.",
    prompt: "Three shipped builds from the workshop. Each one is live.",
    objective: { label: "Gather the build blueprints", noun: "blueprint", done: "Blueprints gathered." },
    nodeShape: "scroll",
    nodeLayout: "spread",
    trait: "wrench",
    artifacts: [
      {
        id: "libergent",
        title: "libergent",
        project: "libergent",
        tag: "product",
        fact: "libergent picks the cheapest search provider that still works.",
        example:
          "Romanian marketplace search with structured extraction, direct HTML parsing, fallback providers, local scoring, and a cost-aware provider strategy.",
        link: { label: "Open libergent", href: "https://libergent.com" },
        upgrade: { lane: "GUARD", name: "Cost-Aware", effect: "You take 30% less damage.", perks: { damageTakenMult: 0.7 } },
      },
      {
        id: "taptime",
        title: "TapTime",
        project: "TapTime",
        tag: "product",
        fact: "TapTime turns one NFC tap into a secure check-in.",
        example:
          "A passive-NFC workplace attendance checkpoint that turns a simple tap into a secure, location-specific check-in or check-out flow.",
        link: { label: "Open TapTime", href: "https://taptime-mvp.vercel.app" },
        upgrade: { lane: "FLOW", name: "Checkpoint Tap", effect: "A 3s shield after every castle and every respawn, plus 12% faster movement.", perks: { checkpointShield: 3, moveMult: 1.12 } },
      },
      {
        id: "bvb-lol",
        title: "bvb.lol",
        project: "bvb.lol",
        tag: "product",
        fact: "bvb.lol makes the Bucharest Stock Exchange readable at a glance.",
        example:
          "An open-source, read-only terminal that makes the Bucharest Stock Exchange easier to follow through clean instrument pages, filings, events, and market context.",
        link: { label: "Open bvb.lol", href: "https://bvblol.vercel.app" },
        upgrade: { lane: "STRIKE", name: "Read the Tape", effect: "Enemies under half health glow red and take +1 damage from you.", perks: { execute: 1 } },
      },
    ],
  },
  {
    id: "games",
    chapter: 7,
    title: "Game Worlds Castle",
    shortTitle: "Game Worlds",
    color: "#fb7185",
    position: [0, -252],
    intro: "At the final castle the portfolio becomes a world. Design the loop, invite the players, keep it moving.",
    prompt: "Three ways to keep a world alive. Pick what you take into the last fight.",
    objective: { label: "Complete the player loop", noun: "token", done: "Player loop complete." },
    nodeShape: "loop",
    nodeLayout: "orbit",
    trait: "crown",
    artifacts: [
      {
        id: "arkadia-park",
        title: "Arkadia Park",
        project: "Arkadia Park",
        tag: "worlds",
        fact: "Arkadia Park, a crypto theme park still running years later.",
        example:
          "A long-running crypto theme park and community world built around games, culture, ownership, quests, and real participation.",
        link: { label: "Read the game worlds chapter", href: "index.html#story-games" },
        upgrade: { lane: "GUARD", name: "Still Running", effect: "Regenerate 3 health per second after 3s without taking damage.", perks: { regen: 3 } },
      },
      {
        id: "esports-signal",
        title: "Esports Signal",
        project: "HomeSports",
        tag: "product",
        fact: "HomeSports ranks the League matches that matter most.",
        example:
          "HomeSports is an importance-ranked League of Legends esports matchboard combining live schedules with transparent ratings. Sprite LoL explores an AI companion players can message for League-focused help.",
        link: { label: "Open HomeSports", href: "https://homesports.vercel.app" },
        upgrade: { lane: "STRIKE", name: "Importance Ranking", effect: "The toughest enemy is marked and takes +1 damage from you.", perks: { priorityBonus: 1 } },
      },
      {
        id: "playable-portfolio",
        title: "Playable Portfolio",
        project: "Vic's Quest",
        tag: "worlds",
        fact: "Vic's Quest is this game, a CV built in Three.js.",
        example:
          "Vic's Quest is this game: a CV turned into an explorable route with castles, combat, objectives, upgrades, and a boss, built as a static Three.js site.",
        link: { label: "View the source", href: "https://github.com/Vicorico17/vicorico.fun" },
        upgrade: { lane: "ALL", name: "Dev Mode", effect: "+1 damage on everything, dash recharges 50% faster, boss numbers visible.", perks: { flatDamage: 1, dashCooldownMult: 0.5, showNumbers: true } },
      },
    ],
  },
];

// Core abilities unlock after castles 1 and 2 regardless of the upgrade chosen.
// They encode the job title: Forward Deployed Engineer -> dash, Graph Engineer -> chain weapon.
const coreUnlocks = {
  0: {
    id: "dash",
    name: "Forward Deploy",
    kind: "dash",
    control: "Shift on a keyboard, DASH on touch",
    effect: "A six-unit dash with a moment of invulnerability. 1.4s cooldown.",
    cv: "Forward Deployed: Victor ships from inside the client's stack and works the problem on site.",
  },
  1: {
    id: "arc",
    name: "Graph Arc",
    kind: "new weapon",
    control: "Q or WEAPON cycles to it, then attack",
    effect: "A bolt that strikes the nearest enemy and chains to up to three more.",
    cv: "Graph Engineer: connected data, knowledge graphs, and agent-ready relationships. One strike travels every edge.",
  },
};

const tagCopy = {
  infra: {
    fit: "AI infrastructure and forward-deployed engineering",
    line: "You kept choosing the machinery underneath: GPUs, containers, private endpoints, and model serving.",
    does: "Ships AI infrastructure: GPU endpoints and private, local-first models.",
  },
  agents: {
    fit: "agent systems and automation",
    line: "You followed the agents: orchestration, MCP tools, and loops that improve their own work.",
    does: "Builds agent systems: Masscall, MCP tools, and self-improving loops.",
  },
  revops: {
    fit: "revenue operations automation",
    line: "You picked the revenue engine: research, enrichment, and outreach that routes into the CRM.",
    does: "Automates revenue operations: AClienti research, enrichment, and outreach that closes.",
  },
  community: {
    fit: "community-led crypto products",
    line: "You chose the crowd: community coins, grants, and market cycles survived.",
    does: "Grows crypto communities: $GONE, a Polygon grant, and cycles survived.",
  },
  markets: {
    fit: "market design and prediction products",
    line: "You went for market design: odds, shares, settlement, and incentives.",
    does: "Designs markets: BJJ Predict, LMSR pricing, and settlement.",
  },
  commerce: {
    fit: "agentic commerce rails",
    line: "You followed the rails where AI agents meet crypto: x402, ACP, AP2, and proof of human approval.",
    does: "Builds agentic commerce rails: REALSOUL, x402, ACP, and AP2.",
  },
  product: {
    fit: "shipped products and founder-led builds",
    line: "You inspected shipped builds: real products with real users and real constraints.",
    does: "Turns ideas into shipped products: libergent, TapTime, bvb.lol, HomeSports.",
  },
  creative: {
    fit: "creative automation and content pipelines",
    line: "You lit up the factory: clips, catalogs, and live studios that publish on repeat.",
    does: "Automates creative pipelines: ClipRO, AutoArt, DistroNow, and Streamwin.",
  },
  worlds: {
    fit: "game worlds and living economies",
    line: "You built worlds: loops, economies, and reasons for players to return.",
    does: "Builds games as living economies: Arkadia Park and this quest.",
  },
};

const clock = new THREE.Clock();
const visited = new Set();
const worldObjects = [];
const castleObjects = [];
const buildingColliders = [];
const mobs = [];
const projectiles = [];
const enemyProjectiles = [];
const pickups = [];
const particles = [];
const effects = [];
const companions = [];
const worldBoundsX = 26;
const worldStartZ = 8;
const worldEndZ = -300;
const triggerRadius = 5.8;
const attackRadius = 3.2;
const bowRange = 15;
const arcRange = 11;
const arcChainRange = 5;
const attackDuration = 0.42;
const gateOffset = 8.2;
const gateAnimDuration = 0.8;
const nodeCollectRadius = 1.45;
const playerSpeed = 9.4;
const toastDuration = 2.8;
const dashDuration = 0.2;
const dashSpeed = 30;
const dashCooldownBase = 1.4;
const BOSS_INDEX = 7;
const bossArena = { x: 0, z: -284, radius: 12, entryZ: -270 };
const lowPower = window.matchMedia("(pointer: coarse)").matches;
const maxParticles = lowPower ? 220 : 400;
const maxBeams = lowPower ? 6 : 12;

function basePerks() {
  return {
    cooldownMult: 1,
    flatDamage: 0,
    maxHealth: 100,
    moveMult: 1,
    critChance: 0,
    healOnKill: 0,
    healMult: 1,
    arrowCount: 1,
    arrowSpeedMult: 1,
    chainTargets: 3,
    companions: 0,
    shockwave: false,
    survivor: false,
    swordRadius: 0,
    bowRange: 0,
    arcRange: 0,
    coneRange: 0,
    boltSpeedMult: 1,
    telegraph: false,
    damageTakenMult: 1,
    checkpointShield: 0,
    execute: 0,
    priorityBonus: 0,
    regen: 0,
    dashCooldownMult: 1,
    dashDamage: 0,
    killStack: 0,
    killStackCap: 0,
    showNumbers: false,
  };
}

function applyPerkDeltas(target, deltas) {
  for (const [key, value] of Object.entries(deltas)) {
    if (typeof value === "boolean") target[key] = target[key] || value;
    else if (key.endsWith("Mult")) target[key] *= value;
    else target[key] += value;
  }
}

const state = {
  phase: "intro",
  activeCastle: null,
  focusItem: null,
  lastHudId: "",
  themeColor: new THREE.Color("#111827"),
  unlockedIndex: 0,
  completed: false,
  attackCooldown: 0,
  attackTimer: 0,
  attackHeld: false,
  weapon: "sword",
  weapons: ["sword", "bow"],
  abilities: { dash: false, arc: false },
  perks: basePerks(),
  playerHealth: 100,
  kills: 0,
  critBank: 0,
  invulnTimer: 0,
  lastHurtAt: -10,
  hurtFlashAt: -10,
  regenTrickleAt: 0,
  rallyCooldown: 0,
  rallyAccum: 0,
  survivorUsed: -1,
  deaths: 0,
  falls: {},
  assisted: new Set(),
  message: "Follow the road. Clear the forecourt of the first castle.",
  messageAt: 0,
  collected: [],
  discovery: { index: -1, chosen: null },
  joystick: { active: false, pointerId: null, x: 0, y: 0, magnitude: 0, centerX: 0, centerY: 0, radius: 40 },
  dash: { cooldown: 0, timer: 0, dirX: 0, dirZ: -1, hitIds: new Set() },
  boss: { stage: "none", mesh: null, hp: 0, maxHp: 26, volleyCooldown: 2.5, slamCooldown: 6, slamTimer: 0, slamming: false, endTimer: 0, minionWave: 0, telegraphed: false },
  run: { startedAt: 0, lastInputAt: 0, idlePrompts: 0 },
  priorityTarget: null,
  arcFlash: 0,
  player: {
    x: 0,
    z: 0,
    rotation: Math.PI,
    speed: 0,
    vx: 0,
    vz: 0,
    hitCooldown: 0,
  },
};

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
  preserveDrawingBuffer: true,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = state.themeColor.clone();
scene.fog = new THREE.Fog(state.themeColor.clone(), 45, 115);

// Far plane sits just past the fog: anything beyond is pure fog colour anyway.
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 130);
camera.position.set(0, 15, 20);

const ambient = new THREE.HemisphereLight(0xffffff, 0x10131d, 1.8);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(18, 30, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 100;
keyLight.shadow.camera.left = -55;
keyLight.shadow.camera.right = 55;
keyLight.shadow.camera.top = 55;
keyLight.shadow.camera.bottom = -55;
scene.add(keyLight);

const particleGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);
const particleMaterials = new Map();
const pulseGeometry = new THREE.RingGeometry(0.75, 1, 40);
const scratchVector = new THREE.Vector3();
const scratchColor = new THREE.Color();
const baseThemeColor = new THREE.Color("#111827");
const bossThemeColor = new THREE.Color("#2a1638");
const spriteTextures = new Map();
const spriteLastShown = new Map();

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.62,
    metalness: options.metalness ?? 0.08,
    emissive: options.emissive || "#000000",
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent || false,
    opacity: options.opacity ?? 1,
    side: options.side || THREE.FrontSide,
  });
}

// Arrows share one geometry/material pair so Multi-Shot never allocates GPU resources.
const arrowShaftGeometry = new THREE.BoxGeometry(0.09, 0.09, 1.05);
const arrowHeadGeometry = new THREE.ConeGeometry(0.14, 0.32, 8);
const arrowShaftMaterial = material("#fff6a3", { emissive: "#f4bf45", emissiveIntensity: 0.85, roughness: 0.26 });
const arrowHeadMaterial = material("#6fd18c", { emissive: "#6fd18c", emissiveIntensity: 0.9, roughness: 0.3 });
const boltGeometry = new THREE.SphereGeometry(0.24, 14, 10);
const boltMaterials = new Map();

function makeBox(width, height, depth, color, x, y, z, options) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, options));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeCylinder(radius, height, color, x, y, z, options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 18), material(color, options));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeCone(radius, height, color, x, y, z, options = {}) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 4), material(color, options));
  mesh.position.set(x, y, z);
  mesh.rotation.y = Math.PI / 4;
  mesh.castShadow = true;
  return mesh;
}

function makeTextTexture(text, options = {}) {
  const fontSize = options.fontSize || 72;
  const padding = options.padding || 24;
  const font = `${options.weight || 900} ${fontSize}px Inter, Arial, sans-serif`;
  const textCanvas = document.createElement("canvas");
  const ctx = textCanvas.getContext("2d");
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width + padding * 2);
  const height = Math.ceil(fontSize + padding * 2);
  textCanvas.width = width;
  textCanvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (options.background) {
    ctx.fillStyle = options.background;
    roundRect(ctx, 0, 0, width, height, options.radius || 18);
    ctx.fill();
  }
  ctx.fillStyle = options.color || "#ffffff";
  ctx.fillText(text, width / 2, height / 2 + fontSize * 0.04);
  const texture = new THREE.CanvasTexture(textCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: width / height };
}

function makeTextSprite(text, options = {}) {
  const { texture, aspect } = makeTextTexture(text, options);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  const spriteHeight = options.height || 1.6;
  sprite.scale.set(aspect * spriteHeight, spriteHeight, 1);
  return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function pluralize(noun, count) {
  return count === 1 ? noun : `${noun}s`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setMessage(text) {
  state.message = text;
  state.messageAt = clock.elapsedTime;
}

function vibrate(ms) {
  try {
    if (lowPower && typeof navigator.vibrate === "function") navigator.vibrate(ms);
  } catch {
    // Haptics are optional.
  }
}

function markInput() {
  state.run.lastInputAt = clock.elapsedTime;
}

function createPlayer() {
  const group = new THREE.Group();
  const bodyMat = material("#e65f3f", { roughness: 0.38, metalness: 0.18 });
  const darkMat = material("#17252b", { roughness: 0.62 });
  const skinMat = material("#f3c58f", { roughness: 0.72 });
  const glowMat = material("#8bd3ff", { emissive: "#8bd3ff", emissiveIntensity: 0.65 });
  const swordMat = material("#fff6a3", { emissive: "#f4bf45", emissiveIntensity: 1.15, roughness: 0.28, metalness: 0.18 });
  const bowMat = material("#6fd18c", { emissive: "#6fd18c", emissiveIntensity: 0.75, roughness: 0.34, metalness: 0.12 });
  const arcMat = material("#8bd3ff", { emissive: "#8bd3ff", emissiveIntensity: 1.1, roughness: 0.3, metalness: 0.2 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.25, 0.58), bodyMat);
  body.position.y = 0.92;
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), skinMat);
  head.position.y = 1.82;
  head.castShadow = true;

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.08), darkMat);
  visor.position.set(0.12, 1.88, -0.36);

  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.82, 0.24), darkMat);
  pack.position.set(0, 0.94, 0.42);
  pack.castShadow = true;

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.22), glowMat);
  leftWing.position.set(-0.64, 1.1, 0.34);
  leftWing.rotation.z = -0.22;

  const rightWing = leftWing.clone();
  rightWing.position.x = 0.64;
  rightWing.rotation.z = 0.22;

  const weaponPivot = new THREE.Group();
  weaponPivot.position.set(0.58, 1.16, -0.2);
  weaponPivot.rotation.set(0.12, 0.7, -0.5);

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 1.72), swordMat);
  blade.position.set(0.12, 0.02, -0.86);
  blade.castShadow = true;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 4), swordMat);
  tip.position.set(0.12, 0.02, -1.86);
  tip.rotation.x = Math.PI / 2;
  tip.castShadow = true;
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.11, 0.13), darkMat);
  guard.position.set(0.1, 0, -0.08);
  const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.44), darkMat);
  hilt.position.set(0.1, 0, 0.16);
  weaponPivot.add(blade, tip, guard, hilt);

  const bowPivot = new THREE.Group();
  bowPivot.position.set(0.64, 1.18, -0.3);
  bowPivot.rotation.set(0.18, -0.18, -0.28);
  const bowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.08, 0.68, 0),
    new THREE.Vector3(-0.26, 0.42, -0.05),
    new THREE.Vector3(-0.38, 0, -0.08),
    new THREE.Vector3(-0.26, -0.42, -0.05),
    new THREE.Vector3(0.08, -0.68, 0),
  ]);
  const bowFrame = new THREE.Mesh(new THREE.TubeGeometry(bowCurve, 36, 0.035, 8, false), bowMat);
  bowFrame.castShadow = true;
  const stringTop = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.72, 0.025), glowMat);
  stringTop.position.set(0.09, 0.33, 0);
  stringTop.rotation.z = -0.09;
  const stringBottom = stringTop.clone();
  stringBottom.position.y = -0.33;
  stringBottom.rotation.z = 0.09;
  const nockedArrow = new THREE.Group();
  const nockedShaft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 1.08), swordMat);
  const nockedHead = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), bowMat);
  nockedHead.position.z = -0.68;
  nockedHead.rotation.x = -Math.PI / 2;
  nockedArrow.add(nockedShaft, nockedHead);
  nockedArrow.position.set(0.04, 0, -0.48);
  bowPivot.add(bowFrame, stringTop, stringBottom, nockedArrow);
  bowPivot.visible = false;

  // Graph Arc: a short staff with a floating node cluster at the tip.
  const arcPivot = new THREE.Group();
  arcPivot.position.set(0.62, 1.1, -0.2);
  arcPivot.rotation.set(0.2, 0.3, -0.35);
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), darkMat);
  staff.rotation.x = Math.PI / 2;
  staff.position.z = -0.4;
  const arcCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), arcMat);
  arcCore.position.set(0, 0.05, -1.2);
  const arcNodeA = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), arcMat);
  arcNodeA.position.set(0.22, 0.24, -1.32);
  const arcNodeB = arcNodeA.clone();
  arcNodeB.position.set(-0.24, 0.18, -1.08);
  const arcNodeC = arcNodeA.clone();
  arcNodeC.position.set(0.05, -0.22, -1.42);
  arcPivot.add(staff, arcCore, arcNodeA, arcNodeB, arcNodeC);
  arcPivot.visible = false;

  group.add(body, head, visor, pack, leftWing, rightWing, weaponPivot, bowPivot, arcPivot);
  group.userData.wings = [leftWing, rightWing];
  group.userData.wingMaterial = glowMat;
  group.userData.weaponPivot = weaponPivot;
  group.userData.bowPivot = bowPivot;
  group.userData.arcPivot = arcPivot;
  group.userData.arcCore = arcCore;
  return group;
}

const player = createPlayer();
scene.add(player);

// Ground decals ignore the depth test so plaza and castle bases never hide them.
const attackRing = new THREE.Mesh(
  new THREE.RingGeometry(attackRadius - 0.22, attackRadius, 48),
  new THREE.MeshBasicMaterial({ color: "#fff6a3", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
);
attackRing.rotation.x = -Math.PI / 2;
attackRing.position.y = 0.07;
attackRing.renderOrder = 10;
attackRing.visible = false;
scene.add(attackRing);

const shieldBubble = new THREE.Mesh(
  new THREE.SphereGeometry(1.35, 20, 14),
  new THREE.MeshBasicMaterial({ color: "#8bd3ff", transparent: true, opacity: 0, depthWrite: false }),
);
shieldBubble.position.y = 1.1;
shieldBubble.visible = false;
player.add(shieldBubble);

// Importance Ranking marker: one shared cone that hovers over the priority target.
const priorityMarker = new THREE.Mesh(
  new THREE.ConeGeometry(0.3, 0.6, 4),
  new THREE.MeshBasicMaterial({ color: "#fb7185", transparent: true, opacity: 0.95, depthWrite: false }),
);
priorityMarker.rotation.x = Math.PI;
priorityMarker.visible = false;
scene.add(priorityMarker);

function buildWorld() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 400, 40, 48),
    material("#253322", { roughness: 0.86 }),
  );
  ground.position.z = -140;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const path = makeBox(10, 0.04, 324, "#3b3127", 0, 0.025, -138, { roughness: 0.8 });
  scene.add(path);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.12, 48), material("#2f3c34", { roughness: 0.8 }));
  plaza.position.y = 0.06;
  plaza.receiveShadow = true;
  scene.add(plaza);

  castles.forEach((castle, index) => {
    const built = buildCastle(castle, index);
    castleObjects.push(built);
    scene.add(built.group);
    buildCastleNodes(built);
    spawnMobPack(castle, index);
  });

  buildArena();
  buildTrees();
  buildPickups();
  buildSky();
}

function buildCastle(castle, index) {
  const [x, z] = castle.position;
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const accent = castle.color;
  const wall = index % 2 ? "#2b2f3a" : "#232b30";
  const dark = "#10141d";
  const accentMat = material(accent, { emissive: accent, emissiveIntensity: 0.22, metalness: 0.16, roughness: 0.42 });
  const accentMeshes = [];

  const base = makeBox(9.4, 0.18, 8.8, "#1d2527", 0, 0.09, 0, { roughness: 0.72 });
  const leftKeep = makeBox(1.7, 4.8, 3.0, wall, -2.95, 2.52, 0, { roughness: 0.55, metalness: 0.08 });
  const rightKeep = makeBox(1.7, 4.8, 3.0, wall, 2.95, 2.52, 0, { roughness: 0.55, metalness: 0.08 });
  const leftRoof = makeCone(1.55, 1.55, accent, -2.95, 5.68, 0, { emissive: accent, emissiveIntensity: 0.18 });
  const rightRoof = makeCone(1.55, 1.55, accent, 2.95, 5.68, 0, { emissive: accent, emissiveIntensity: 0.18 });
  const arch = makeBox(3.9, 0.75, 0.58, wall, 0, 3.2, 3.72, { roughness: 0.55, metalness: 0.08 });
  const backArch = makeBox(3.9, 0.5, 0.44, wall, 0, 2.6, -3.72, { roughness: 0.55, metalness: 0.08 });
  const gate = makeBox(3.5, 2.45, 0.28, dark, 0, 1.32, 3.86, { emissive: accent, emissiveIntensity: 0.18 });
  const gateGlow = makeBox(2.5, 1.66, 0.08, accent, 0, 1.34, 3.98, { emissive: accent, emissiveIntensity: 0.65, transparent: true, opacity: 0.28 });
  accentMeshes.push(leftRoof, rightRoof);

  group.add(base, leftKeep, rightKeep, leftRoof, rightRoof, arch, backArch, gate, gateGlow);

  const towerPositions = [
    [-3.45, -3.45],
    [3.45, -3.45],
    [-3.45, 3.45],
    [3.45, 3.45],
  ];
  for (const [tx, tz] of towerPositions) {
    const tower = makeCylinder(0.82, 4.8, wall, tx, 2.5, tz, { roughness: 0.54 });
    const cap = makeCone(1.15, 1.45, accent, tx, 5.62, tz, { emissive: accent, emissiveIntensity: 0.16 });
    accentMeshes.push(cap);
    group.add(tower, cap);
  }

  const walls = [
    makeBox(1.9, 1.8, 0.44, wall, -2.8, 1.02, -3.72),
    makeBox(1.9, 1.8, 0.44, wall, 2.8, 1.02, -3.72),
    makeBox(1.9, 1.8, 0.44, wall, -2.8, 1.02, 3.72),
    makeBox(1.9, 1.8, 0.44, wall, 2.8, 1.02, 3.72),
    makeBox(0.44, 1.8, 7.2, wall, -3.72, 1.02, 0),
    makeBox(0.44, 1.8, 7.2, wall, 3.72, 1.02, 0),
  ];
  walls.forEach((wallMesh) => group.add(wallMesh));

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(triggerRadius, 0.035, 8, 96),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.45,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.08;
  ring.userData.spin = index % 2 ? -0.18 : 0.18;
  ring.visible = false;
  group.add(ring);
  worldObjects.push(ring, gateGlow);

  const label = makeTextSprite(castle.shortTitle, {
    background: "rgba(5, 7, 12, 0.72)",
    color: "#ffffff",
    height: 1.0,
    fontSize: 58,
  });
  label.position.set(0, 7.55, 3.2);
  group.add(label);

  const icon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), accentMat);
  icon.position.set(0, 6.55, 1.2);
  icon.userData.baseY = icon.position.y;
  group.add(icon);
  worldObjects.push(icon);

  const beaconGeometry = new THREE.CylinderGeometry(0.3, 1.1, 34, 18, 1, true);
  beaconGeometry.translate(0, 17, 0);
  const beacon = new THREE.Mesh(
    beaconGeometry,
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  );
  beacon.position.set(0, 4, 0);
  beacon.scale.set(1, 0.01, 1);
  beacon.visible = false;
  group.add(beacon);

  buildingColliders.push(
    { x: x - 3.72, z, halfX: 0.62, halfZ: 3.92, castleIndex: index, kind: "wall" },
    { x: x + 3.72, z, halfX: 0.62, halfZ: 3.92, castleIndex: index, kind: "wall" },
    { x: x - 2.95, z, halfX: 0.85, halfZ: 1.5, castleIndex: index, kind: "wall" },
    { x: x + 2.95, z, halfX: 0.85, halfZ: 1.5, castleIndex: index, kind: "wall" },
    { x: x - 2.8, z: z - 3.72, halfX: 0.95, halfZ: 0.54, castleIndex: index, kind: "wall" },
    { x: x + 2.8, z: z - 3.72, halfX: 0.95, halfZ: 0.54, castleIndex: index, kind: "wall" },
    { x: x - 2.8, z: z + 3.72, halfX: 0.95, halfZ: 0.54, castleIndex: index, kind: "wall" },
    { x: x + 2.8, z: z + 3.72, halfX: 0.95, halfZ: 0.54, castleIndex: index, kind: "wall" },
    { x, z: z + 3.85, halfX: 1.8, halfZ: 0.52, castleIndex: index, kind: "gate" },
  );

  return {
    group,
    castle,
    index,
    x,
    z,
    ring,
    icon,
    iconMaterial: accentMat,
    gate,
    gateGlow,
    accentMeshes,
    beacon,
    nodes: [],
    gateProgress: 0,
    lit: 0,
    discovered: false,
  };
}

function buildCastleNodes(item) {
  const castle = item.castle;
  const color = castle.color;
  const shapeMat = material(color, { emissive: color, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.1 });
  const layout =
    castle.nodeLayout === "orbit"
      ? [0, 1, 2].map((i) => ({ x: 0, z: gateOffset + 3.2, angle: (i / 3) * Math.PI * 2 }))
      : [
          { x: -6, z: gateOffset + 1.4 },
          { x: 6, z: gateOffset + 1.4 },
          { x: 0, z: gateOffset + 5.2 },
        ];
  layout.forEach((spot, i) => {
    const group = new THREE.Group();
    const shape = createNodeShape(castle.nodeShape, shapeMat);
    shape.position.y = 1.05;
    shape.castShadow = true;
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.78, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.05;
    group.add(shape, glow);
    group.position.set(item.x + spot.x, 0, item.z + spot.z);
    group.userData = {
      castleIndex: item.index,
      active: true,
      shape,
      glow,
      baseY: 1.05,
      phase: i * 2.1,
      angle: spot.angle ?? 0,
      homeX: group.position.x,
      homeZ: group.position.z,
    };
    item.nodes.push(group);
    scene.add(group);
  });
}

function createNodeShape(kind, mat) {
  switch (kind) {
    case "gear":
      return new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.11, 10, 8), mat);
    case "diamond": {
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), mat);
      mesh.scale.y = 1.5;
      return mesh;
    }
    case "crate":
      return new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), mat);
    case "frame":
      return new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.56, 0.08), mat);
    case "scroll": {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.0, 12), mat);
      mesh.rotation.z = Math.PI / 2;
      return mesh;
    }
    case "loop":
      return new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 12, 28), mat);
    default:
      return new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), mat);
  }
}

// Difficulty ramps with the castle index. Castle 1 has no shooters so the first
// minute is gentle; counts never exceed eight for phone GPUs; elites from castle 4.
function difficultyFor(index) {
  const tier = Math.max(0, Math.min(6, index));
  return {
    count: [4, 5, 6, 6, 7, 7, 8][tier],
    shooters: tier === 0 ? 0 : tier <= 2 ? 2 : 3,
    hpBonus: (tier >= 2 ? 1 : 0) + (tier >= 5 ? 1 : 0),
    speedMult: 1 + 0.07 * tier,
    damageMult: 1 + 0.1 * tier,
    shootMult: Math.max(0.6, 1 - 0.06 * tier),
    boltSpeed: 8.4 + 0.4 * tier,
    elites: tier >= 3 ? (tier === 6 ? 2 : 1) : 0,
    aggro: 12,
  };
}

const mobFormations = [
  { x: 0, z: 2.2 },
  { x: -4.6, z: 3.6 },
  { x: 4.6, z: 3.6 },
  { x: -7.2, z: -1.1 },
  { x: 7.2, z: -1.1 },
  { x: -2.4, z: 5.4 },
  { x: 2.4, z: 5.4 },
  { x: 0, z: -2.6 },
];

function packComposition(difficulty) {
  const melee = ["brute", "crawler", "runner"];
  const shooters = ["seer", "sentinel"];
  const types = [];
  let shooterCount = 0;
  let meleeIndex = 0;
  for (let slot = 0; slot < difficulty.count; slot += 1) {
    const wantsShooter = shooterCount < difficulty.shooters && slot % 2 === 1;
    if (wantsShooter) {
      types.push(shooters[shooterCount % shooters.length]);
      shooterCount += 1;
    } else {
      types.push(melee[meleeIndex % melee.length]);
      meleeIndex += 1;
    }
  }
  return types;
}

function spawnMobPack(castle, castleIndex) {
  const [, castleZ] = castle.position;
  const difficulty = difficultyFor(castleIndex);
  const types = packComposition(difficulty);
  const eliteSlots = difficulty.elites >= 2 ? [0, 3] : difficulty.elites === 1 ? [0] : [];
  types.forEach((type, mobIndex) => {
    const spot = mobFormations[mobIndex % mobFormations.length];
    const elite = eliteSlots.includes(mobIndex);
    const mob = createMob(castle, elite && type !== "sentinel" ? "brute" : type, { difficulty, elite });
    registerMob(mob, castleIndex, spot.x, castleZ + gateOffset + spot.z, mobIndex * 1.7 + castleIndex);
  });
}

function registerMob(mob, castleIndex, x, z, phase) {
  const data = mob.userData;
  mob.position.set(x, 0, z);
  data.castleIndex = castleIndex;
  data.hp = data.maxHp;
  data.alive = true;
  data.hitTimer = 0;
  data.telegraphed = false;
  data.shootCooldown = data.shootInterval ? 0.9 + (phase % 3) * 0.4 : Infinity;
  data.baseX = x;
  data.baseZ = z;
  data.phase = phase;
  mobs.push(mob);
  scene.add(mob);
  return mob;
}

function createMob(castle, type = "brute", options = {}) {
  const group = new THREE.Group();
  const color = castle.color;
  const difficulty = options.difficulty || difficultyFor(0);
  const stats = {
    brute: { maxHp: 2, speed: 1.35, damage: 17, scale: 1.14 },
    crawler: { maxHp: 2, speed: 2.25, damage: 12, scale: 0.82 },
    seer: { maxHp: 2, speed: 1.65, damage: 14, scale: 0.96, shootDamage: 9, shootRange: 13.5, shootInterval: 1.85 },
    runner: { maxHp: 1, speed: 2.8, damage: 10, scale: 0.74 },
    sentinel: { maxHp: 3, speed: 1.05, damage: 20, scale: 1.22, shootDamage: 13, shootRange: 15.5, shootInterval: 2.45 },
  }[type];
  const bodyColor = new THREE.Color("#2b1115").lerp(new THREE.Color(color), 0.3);
  const bodyMat = material(bodyColor, { roughness: 0.46, emissive: "#4b1119", emissiveIntensity: 0.18 });
  const accentMat = material(color, { emissive: color, emissiveIntensity: 0.54, roughness: 0.36 });
  const eyeMat = material("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.72 });

  const bodyGeometry =
    type === "crawler"
      ? new THREE.BoxGeometry(1.1, 0.52, 1.0)
      : type === "seer"
        ? new THREE.SphereGeometry(0.72, 18, 14)
        : type === "sentinel"
          ? new THREE.DodecahedronGeometry(0.82, 0)
          : new THREE.IcosahedronGeometry(0.78, 1);
  const body = new THREE.Mesh(bodyGeometry, bodyMat);
  body.position.y = 0.88;
  body.castShadow = true;

  const hornLeft = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 8), accentMat);
  hornLeft.position.set(-0.34, 1.5, -0.16);
  hornLeft.rotation.z = 0.35;

  const hornRight = hornLeft.clone();
  hornRight.position.x = 0.34;
  hornRight.rotation.z = -0.35;

  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), eyeMat);
  eyeLeft.position.set(-0.22, 1, -0.66);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = 0.22;

  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 20), accentMat);
  crown.position.set(0, 1.42, -0.08);
  crown.rotation.x = Math.PI / 2;
  crown.visible = type === "seer" || type === "sentinel";

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.62, 8), accentMat);
  tail.position.set(0, 0.78, 0.7);
  tail.rotation.x = -Math.PI / 2;
  tail.visible = type === "crawler" || type === "runner";

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.82, 24), material("#000000", { transparent: true, opacity: 0.22 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;

  const hitBurst = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.62, 18),
    new THREE.MeshBasicMaterial({
      color: "#fff6a3",
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  hitBurst.position.set(0, 1.08, -0.92);
  hitBurst.renderOrder = 11;
  hitBurst.visible = false;

  group.add(body, hornLeft, hornRight, eyeLeft, eyeRight, crown, tail, shadow, hitBurst);
  addMobTrait(group, castle.trait, accentMat);

  if (options.elite) {
    const eliteRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.05, 8, 32),
      new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.85, depthWrite: false }),
    );
    eliteRing.rotation.x = -Math.PI / 2;
    eliteRing.position.y = 0.06;
    group.add(eliteRing);
    group.userData.eliteRing = eliteRing;
  }

  group.traverse((child) => {
    if (child.isMesh && child.material?.emissive) child.userData.baseEmissive = child.material.emissiveIntensity;
  });

  const scale = stats.scale * (options.elite ? 1.3 : 1);
  group.scale.setScalar(scale);
  const maxHp = (stats.maxHp + difficulty.hpBonus) * (options.elite ? 2 : 1);
  group.userData.type = type;
  group.userData.color = color;
  group.userData.elite = Boolean(options.elite);
  group.userData.maxHp = maxHp;
  group.userData.speed = stats.speed * difficulty.speedMult * (options.elite ? 0.9 : 1);
  group.userData.damage = stats.damage * difficulty.damageMult * (options.elite ? 1.4 : 1);
  group.userData.shootDamage = (stats.shootDamage || 0) * difficulty.damageMult;
  group.userData.shootRange = stats.shootRange || 0;
  group.userData.shootInterval = stats.shootInterval ? stats.shootInterval * difficulty.shootMult : 0;
  group.userData.boltSpeed = difficulty.boltSpeed;
  group.userData.aggro = difficulty.aggro;
  group.userData.baseScale = scale;
  group.userData.hitBurst = hitBurst;
  group.userData.bodyMat = bodyMat;
  return group;
}

function addMobTrait(group, trait, accentMat) {
  switch (trait) {
    case "antenna": {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), accentMat);
      rod.position.set(0, 1.78, 0);
      const tipBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), accentMat);
      tipBall.position.set(0, 2.08, 0);
      group.add(rod, tipBall);
      break;
    }
    case "gear": {
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 6, 8), accentMat);
      halo.position.set(0, 1.74, 0);
      halo.rotation.x = Math.PI / 2;
      group.add(halo);
      break;
    }
    case "diamond": {
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 0), accentMat);
      gem.position.set(0, 1.94, 0);
      gem.scale.y = 1.4;
      group.add(gem);
      break;
    }
    case "banner": {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6), accentMat);
      pole.position.set(0.34, 1.7, 0.1);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.03), accentMat);
      flag.position.set(0.52, 1.98, 0.1);
      group.add(pole, flag);
      break;
    }
    case "frame": {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.05), accentMat);
      frame.position.set(0, 1.88, 0);
      group.add(frame);
      break;
    }
    case "wrench": {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), accentMat);
      handle.position.set(0, 1.84, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.1), accentMat);
      head.position.set(0, 2.12, 0);
      group.add(handle, head);
      break;
    }
    case "crown": {
      [-0.2, 0, 0.2].forEach((x, i) => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.14, i === 1 ? 0.22 : 0.14, 0.14), accentMat);
        cube.position.set(x, 1.86 + (i === 1 ? 0.04 : 0), 0);
        group.add(cube);
      });
      break;
    }
    default:
      break;
  }
}

// The Fragmenter's arena: a floor, seven pillars that light up as it weakens,
// and a boundary ring that only shows during the fight.
const arena = { pillars: [], boundary: null, floor: null };

function buildArena() {
  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(bossArena.radius, bossArena.radius, 0.14, 64),
    material("#1b1d2b", { roughness: 0.78 }),
  );
  floor.position.set(bossArena.x, 0.07, bossArena.z);
  floor.receiveShadow = true;
  scene.add(floor);
  arena.floor = floor;

  castles.forEach((castle, index) => {
    const angle = Math.PI * 0.5 + (index / castles.length) * Math.PI * 2;
    const px = bossArena.x + Math.cos(angle) * (bossArena.radius - 1.3);
    const pz = bossArena.z + Math.sin(angle) * (bossArena.radius - 1.3);
    const pillar = makeCylinder(0.55, 5.2, "#232b30", px, 2.6, pz, { roughness: 0.55 });
    const cap = makeCone(0.95, 1.2, castle.color, px, 5.7, pz, { emissive: castle.color, emissiveIntensity: 0.2 });
    scene.add(pillar, cap);
    arena.pillars.push({ pillar, cap, lit: 0 });
  });

  const boundary = new THREE.Mesh(
    new THREE.TorusGeometry(bossArena.radius, 0.06, 8, 120),
    new THREE.MeshBasicMaterial({ color: "#c084fc", transparent: true, opacity: 0, depthWrite: false, depthTest: false }),
  );
  boundary.rotation.x = -Math.PI / 2;
  boundary.position.set(bossArena.x, 0.16, bossArena.z);
  boundary.visible = false;
  scene.add(boundary);
  arena.boundary = boundary;
}

// The Fragmenter: a dark core with an eye. Its four orbiting fragments are real
// mobs (see createFragment) and shield it while any of them survive.
function createBoss() {
  const group = new THREE.Group();
  const coreMat = material("#1a1020", { roughness: 0.4, metalness: 0.3, emissive: "#6d4ea2", emissiveIntensity: 0.5 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), coreMat);
  core.position.y = 2.2;
  core.castShadow = true;
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), material("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.9 }));
  eye.position.set(0, 2.3, -1.5);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), material("#05070c"));
  pupil.position.set(0, 2.3, -1.9);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.3, 32), material("#000000", { transparent: true, opacity: 0.28 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.03;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.06, 8, 64),
    new THREE.MeshBasicMaterial({ color: "#c084fc", transparent: true, opacity: 0.7, depthWrite: false }),
  );
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 2.2;
  const hitBurst = new THREE.Mesh(
    new THREE.RingGeometry(1.2, 1.6, 24),
    new THREE.MeshBasicMaterial({ color: "#fff6a3", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  );
  hitBurst.position.set(0, 2.2, -2.2);
  hitBurst.renderOrder = 11;
  hitBurst.visible = false;
  group.add(core, eye, pupil, shadow, halo, hitBurst);
  group.traverse((child) => {
    if (child.isMesh && child.material?.emissive) child.userData.baseEmissive = child.material.emissiveIntensity;
  });
  group.userData = {
    isBoss: true,
    type: "boss",
    color: "#c084fc",
    maxHp: state.boss.maxHp,
    hp: state.boss.maxHp,
    speed: 1.4,
    damage: 22,
    shootDamage: 10,
    shootRange: 0,
    shootInterval: 0,
    aggro: 40,
    baseScale: 1,
    hitBurst,
    core,
    halo,
    elite: true,
    bodyMat: coreMat,
  };
  return group;
}

function createFragment(index) {
  const castle = castles[index % castles.length];
  const group = new THREE.Group();
  const mat = material(castle.color, { emissive: castle.color, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.1 });
  const shape = createNodeShape(castle.nodeShape, mat);
  shape.position.y = 0;
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), material("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.9 }));
  eye.position.set(0, 0.1, -0.45);
  group.add(shape, eye);
  group.traverse((child) => {
    if (child.isMesh && child.material?.emissive) child.userData.baseEmissive = child.material.emissiveIntensity;
  });
  group.userData = {
    isFragment: true,
    type: "fragment",
    color: castle.color,
    maxHp: 2,
    hp: 2,
    speed: 0,
    damage: 0,
    shootDamage: 0,
    shootRange: 0,
    shootInterval: 0,
    aggro: 0,
    baseScale: 1,
    hitBurst: null,
    orbitAngle: (index / 4) * Math.PI * 2,
    bodyMat: mat,
  };
  return group;
}

function buildTrees() {
  const trunkMat = material("#433019", { roughness: 0.82 });
  const leafMat = material("#1d5135", { roughness: 0.75 });
  const count = lowPower ? 150 : 230;
  for (let i = 0; i < count; i += 1) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const x = side * (15 + Math.random() * 116);
    const z = worldStartZ - Math.random() * (Math.abs(worldEndZ) + 22);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.1, 8), trunkMat);
    trunk.position.y = 0.55;
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.82, 1.7, 8), leafMat);
    leaves.position.y = 1.75;
    trunk.castShadow = true;
    leaves.castShadow = true;
    tree.add(trunk, leaves);
    tree.position.set(x, 0, z);
    tree.rotation.y = Math.random() * Math.PI;
    scene.add(tree);
  }
}

const heartMaterial = material("#fb7185", { emissive: "#fb7185", emissiveIntensity: 1.05, roughness: 0.28, metalness: 0.08 });

function buildPickups() {
  castles.forEach((castle, index) => {
    if (index === castles.length - 1) return;
    const nextCastle = castles[index + 1];
    const z = (castle.position[1] + nextCastle.position[1]) / 2;
    [-1, 1].forEach((side) => {
      addHeart(side * (7.2 + (index % 2) * 2.8), z);
    });
  });
  // Two hearts before the arena so the final fight starts topped up.
  addHeart(-6.5, bossArena.entryZ + 7);
  addHeart(6.5, bossArena.entryZ + 7);
}

function addHeart(x, z) {
  const pickup = createHeartPickup(heartMaterial);
  pickup.position.set(x, 0.85, z);
  pickup.userData.baseY = pickup.position.y;
  pickup.userData.spin = Math.sign(x || 1) * 1.15;
  pickup.userData.active = true;
  pickups.push(pickup);
  worldObjects.push(pickup);
  scene.add(pickup);
  return pickup;
}

function createHeartPickup(pickupMat) {
  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), pickupMat);
  left.position.set(-0.18, 0.12, 0);
  const right = left.clone();
  right.position.x = 0.18;
  const point = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.58, 18), pickupMat);
  point.position.set(0, -0.18, 0);
  point.rotation.z = Math.PI;
  group.add(left, right, point);
  group.rotation.z = -0.12;
  group.scale.setScalar(1.15);
  group.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });
  return group;
}

function buildSky() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 150;
    positions[i * 3 + 1] = Math.random() * 48 + 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
  );
  scene.add(stars);
  worldObjects.push(stars);
}

// Companion drones (Agent Companion, Artist Roster) orbit the player and zap enemies.
const companionGlow = material("#8bd3ff", { emissive: "#8bd3ff", emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.2 });
const companionCoreGeometry = new THREE.OctahedronGeometry(0.22, 0);
const companionRingGeometry = new THREE.TorusGeometry(0.32, 0.03, 6, 20);

function createCompanion(index) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(companionCoreGeometry, companionGlow);
  const ring = new THREE.Mesh(companionRingGeometry, companionGlow);
  ring.rotation.x = Math.PI / 2;
  group.add(core, ring);
  group.userData = { angle: index * Math.PI, zapTimer: 0.8 + index * 0.75, core, ring, index };
  return group;
}

function syncCompanions() {
  const target = Math.max(0, Math.min(2, Math.round(state.perks.companions)));
  while (companions.length < target) {
    const drone = createCompanion(companions.length);
    drone.position.set(state.player.x, 1.7, state.player.z);
    companions.push(drone);
    scene.add(drone);
  }
  while (companions.length > target) {
    scene.remove(companions.pop());
  }
}

function particleMaterial(color) {
  if (!particleMaterials.has(color)) particleMaterials.set(color, new THREE.MeshBasicMaterial({ color }));
  return particleMaterials.get(color);
}

function spawnBurst(x, y, z, color, count, options = {}) {
  for (let i = 0; i < count; i += 1) {
    if (particles.length >= maxParticles) scene.remove(particles.shift());
    const mesh = new THREE.Mesh(particleGeometry, particleMaterial(i % 3 === 0 ? "#ffffff" : color));
    mesh.position.set(x, y, z);
    const angle = Math.random() * Math.PI * 2;
    const speed = (options.speed || 4) * (0.5 + Math.random());
    const scale = (options.scale || 1) * (0.7 + Math.random() * 0.6);
    mesh.userData = {
      vx: Math.cos(angle) * speed,
      vy: (options.lift ?? 3.5) * (0.6 + Math.random() * 0.8),
      vz: Math.sin(angle) * speed,
      age: 0,
      maxAge: (options.life || 0.7) * (0.7 + Math.random() * 0.6),
      spin: (Math.random() - 0.5) * 12,
      scale,
    };
    mesh.scale.setScalar(scale);
    particles.push(mesh);
    scene.add(mesh);
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    const data = particle.userData;
    data.age += dt;
    if (data.age >= data.maxAge) {
      particles.splice(i, 1);
      scene.remove(particle);
      continue;
    }
    data.vy -= 9.8 * dt;
    particle.position.x += data.vx * dt;
    particle.position.y += data.vy * dt;
    particle.position.z += data.vz * dt;
    if (particle.position.y < 0.09) {
      particle.position.y = 0.09;
      data.vy *= -0.35;
      data.vx *= 0.8;
      data.vz *= 0.8;
    }
    particle.rotation.x += data.spin * dt;
    particle.rotation.y += data.spin * 0.7 * dt;
    const life = 1 - data.age / data.maxAge;
    particle.scale.setScalar(Math.max(0.01, data.scale * life));
  }
}

function spawnRingPulse(x, z, color, radius, duration = 0.5, options = {}) {
  const mesh = new THREE.Mesh(
    pulseGeometry,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.06, z);
  mesh.renderOrder = 9;
  const grow = options.reverse ? (t) => radius * (1 - t) + 0.4 : (t) => 0.4 + t * radius;
  effects.push({
    kind: "pulse",
    mesh,
    age: 0,
    maxAge: duration,
    tick(t) {
      const scale = grow(t);
      mesh.scale.set(scale, scale, 1);
      mesh.material.opacity = options.reverse ? 0.25 + t * 0.7 : (1 - t) * 0.9;
    },
  });
  scene.add(mesh);
}

function spawnBeam(fromX, fromZ, toX, toZ, color, duration = 1.3, y = 1.1) {
  const live = effects.filter((effect) => effect.kind === "beam");
  if (live.length >= maxBeams) {
    const oldest = live[0];
    oldest.age = oldest.maxAge;
  }
  const dx = toX - fromX;
  const dz = toZ - fromZ;
  const length = Math.max(0.1, Math.hypot(dx, dz));
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, length),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }),
  );
  mesh.position.set((fromX + toX) / 2, y, (fromZ + toZ) / 2);
  mesh.rotation.y = Math.atan2(dx, dz);
  effects.push({
    kind: "beam",
    mesh,
    age: 0,
    maxAge: duration,
    tick(t) {
      mesh.material.opacity = Math.sin(t * Math.PI) * 0.95;
      const thickness = 1 + t * 1.2;
      mesh.scale.set(thickness, thickness, 1);
    },
  });
  scene.add(mesh);
}

// Project-name feedback: a floating label at the point where an upgrade fired.
// Textures are cached per label; each label shows at most once per six seconds.
function showProjectSprite(key, text, x, z, color = "#ffffff") {
  const now = clock.elapsedTime;
  if (now - (spriteLastShown.get(key) ?? -10) < 6) return;
  if (effects.filter((effect) => effect.kind === "sprite").length >= 4) return;
  spriteLastShown.set(key, now);
  const cacheKey = `${text}|${color}`;
  if (!spriteTextures.has(cacheKey)) {
    spriteTextures.set(cacheKey, makeTextTexture(text, { fontSize: 56, color, background: "rgba(5, 7, 12, 0.7)", padding: 20 }));
  }
  const { texture, aspect } = spriteTextures.get(cacheKey);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  const height = 0.7;
  sprite.scale.set(aspect * height, height, 1);
  sprite.position.set(x, 2.4, z);
  sprite.renderOrder = 14;
  effects.push({
    kind: "sprite",
    mesh: sprite,
    age: 0,
    maxAge: 1.1,
    tick(t) {
      sprite.position.y = 2.4 + t * 0.8;
      sprite.material.opacity = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
    },
  });
  scene.add(sprite);
}

function updateEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i -= 1) {
    const effect = effects[i];
    effect.age += dt;
    const t = Math.min(1, effect.age / effect.maxAge);
    effect.tick(t);
    if (effect.age >= effect.maxAge) {
      scene.remove(effect.mesh);
      effect.mesh.material.dispose();
      if (effect.kind === "beam") effect.mesh.geometry.dispose();
      effects.splice(i, 1);
    }
  }
}

function clearTransientObjects() {
  projectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  enemyProjectiles.splice(0).forEach((projectile) => {
    scene.remove(projectile);
  });
  particles.splice(0).forEach((particle) => scene.remove(particle));
  effects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    effect.mesh.material.dispose();
    if (effect.kind === "beam") effect.mesh.geometry.dispose();
  });
}

function removeBossEntities() {
  for (let i = mobs.length - 1; i >= 0; i -= 1) {
    if (mobs[i].userData.castleIndex === BOSS_INDEX) {
      scene.remove(mobs[i]);
      mobs.splice(i, 1);
    }
  }
  state.boss.mesh = null;
  state.boss.stage = "none";
  state.boss.hp = state.boss.maxHp;
  state.boss.slamming = false;
  state.boss.slamTimer = 0;
  state.boss.endTimer = 0;
  state.boss.minionWave = 0;
  if (arena.boundary) {
    arena.boundary.visible = false;
    arena.boundary.material.opacity = 0;
  }
  arena.pillars.forEach((entry) => {
    entry.lit = 0;
  });
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.setSize(width, height, true);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function setPhase(phase) {
  state.phase = phase;
  if (stageNode) stageNode.dataset.phase = phase;
}

function showPanel(node) {
  if (!node) return;
  node.style.display = "";
  void node.offsetWidth;
  node.classList.remove("is-hidden");
}

function hidePanel(node) {
  if (!node) return;
  node.classList.add("is-hidden");
  window.setTimeout(() => {
    if (node.classList.contains("is-hidden")) node.style.display = "none";
  }, 260);
}

function resetGame() {
  state.player.x = 0;
  state.player.z = 0;
  state.player.rotation = Math.PI;
  state.player.speed = 0;
  state.player.vx = 0;
  state.player.vz = 0;
  state.player.hitCooldown = 0;
  state.activeCastle = null;
  state.focusItem = null;
  state.lastHudId = "";
  state.unlockedIndex = 0;
  state.completed = false;
  state.attackCooldown = 0;
  state.attackTimer = 0;
  state.attackHeld = false;
  state.weapon = "sword";
  state.weapons = ["sword", "bow"];
  state.abilities = { dash: false, arc: false };
  state.perks = basePerks();
  state.playerHealth = state.perks.maxHealth;
  state.kills = 0;
  state.critBank = 0;
  state.invulnTimer = 0;
  state.lastHurtAt = -10;
  state.rallyCooldown = 0;
  state.rallyAccum = 0;
  state.survivorUsed = -1;
  state.deaths = 0;
  state.falls = {};
  state.assisted = new Set();
  state.collected = [];
  state.discovery = { index: -1, chosen: null };
  state.dash = { cooldown: 0, timer: 0, dirX: 0, dirZ: -1, hitIds: new Set() };
  state.run = { startedAt: clock.elapsedTime, lastInputAt: clock.elapsedTime, idlePrompts: 0 };
  state.priorityTarget = null;
  visited.clear();
  removeBossEntities();
  mobs.forEach((mob) => {
    mob.userData.hp = mob.userData.maxHp;
    mob.userData.alive = true;
    mob.userData.hitTimer = 0;
    mob.userData.telegraphed = false;
    mob.visible = true;
    mob.position.set(mob.userData.baseX, 0, mob.userData.baseZ);
    mob.scale.setScalar(mob.userData.baseScale);
  });
  pickups.forEach((pickup) => {
    pickup.userData.active = true;
    pickup.visible = true;
  });
  castleObjects.forEach((item) => {
    item.gateProgress = 0;
    item.lit = 0;
    item.discovered = false;
    item.nodes.forEach((node) => {
      node.userData.active = true;
      node.visible = true;
      node.position.set(node.userData.homeX, 0, node.userData.homeZ);
    });
  });
  clearTransientObjects();
  syncCompanions();
  keys.clear();
  releaseJoystick();
  hidePanel(introNode);
  hidePanel(discoveryNode);
  hidePanel(cvNode);
  hidePanel(endingNode);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  setPhase("play");
  setMessage("Quest reset. Follow the road to the first castle.");
  updateWeaponUi();
  updateAbilityUi();
  updateHud(true);
}

// Falling costs only position. Progress and upgrades are kept; the pack returns to
// its spawn points but keeps the damage it took. Two falls in the same forecourt
// quietly soften the pack once.
function respawn() {
  const item = castleObjects[state.unlockedIndex];
  const combat = combatIndex();
  state.deaths += 1;
  state.falls[combat] = (state.falls[combat] || 0) + 1;
  state.playerHealth = state.perks.maxHealth;
  state.player.x = 0;
  state.player.vx = 0;
  state.player.vz = 0;
  state.player.hitCooldown = 1.2;
  state.player.rotation = Math.PI;
  state.invulnTimer = Math.max(state.invulnTimer, 2, state.perks.checkpointShield);
  state.dash.timer = 0;
  state.attackHeld = false;
  projectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  enemyProjectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  if (state.boss.stage === "fight") {
    state.player.z = bossArena.entryZ - 2;
    if (state.boss.mesh) {
      const data = state.boss.mesh.userData;
      const half = Math.ceil(data.maxHp / 2);
      if (data.hp > half) data.hp = data.maxHp;
      else data.hp = Math.max(data.hp, half);
      state.boss.mesh.position.set(bossArena.x, 0, bossArena.z - 5);
      state.boss.slamming = false;
      state.boss.volleyCooldown = 2.5;
      state.boss.slamCooldown = 6;
    }
    setMessage(state.boss.mesh && state.boss.mesh.userData.hp < state.boss.maxHp ? "Back in. The Fragmenter kept its wounds." : "Back in with full health. Break the fragments first.");
  } else {
    state.player.z = item ? Math.min(worldStartZ, item.z + gateOffset + 9) : 0;
    if (item) {
      const pack = activeMobsForCastle(item.index);
      pack.forEach((mob) => {
        mob.position.set(mob.userData.baseX, 0, mob.userData.baseZ);
        mob.userData.shootCooldown = mob.userData.shootInterval ? 1.2 : Infinity;
      });
      if (state.falls[combat] >= 2 && !state.assisted.has(combat)) {
        state.assisted.add(combat);
        pack.forEach((mob) => {
          mob.userData.hp = Math.max(1, mob.userData.hp - Math.ceil(mob.userData.maxHp * 0.25));
        });
      }
    }
    setMessage(state.perks.checkpointShield > 0 ? "Checked in. Shield up, back at the last gate." : "Back at the last gate with full health.");
  }
  updateHud(true);
}

function update(dt) {
  const playing = state.phase === "play";
  state.attackTimer = Math.max(0, state.attackTimer - dt);
  if (playing) {
    state.attackCooldown = Math.max(0, state.attackCooldown - dt);
    state.player.hitCooldown = Math.max(0, state.player.hitCooldown - dt);
    state.invulnTimer = Math.max(0, state.invulnTimer - dt);
    state.rallyCooldown = Math.max(0, state.rallyCooldown - dt);
    state.dash.cooldown = Math.max(0, state.dash.cooldown - dt);
    if (state.attackHeld) attack();
    updateMovement(dt);
    updateMobs(dt);
    updateBoss(dt);
    updateCompanions(dt);
    updateProjectiles(dt);
    updateEnemyProjectiles(dt);
    updatePickups(dt);
    updateRegen(dt);
    updatePriorityTarget();
    updateIdlePrompt();
  }
  updateNodes(dt);
  updateCastles(dt);
  updateArena(dt);
  if (playing) updateDiscoveryTrigger();
  updateParticles(dt);
  updateEffects(dt);
  updateTheme();
  updatePlayer(dt);
  updateCamera(dt);
  animateWorld(dt);
  updateHud();
}

function currentInput() {
  const digitalForward = (keys.has("ArrowUp") || keys.has("w") || keys.has("W") ? 1 : 0) - (keys.has("ArrowDown") || keys.has("s") || keys.has("S") ? 1 : 0);
  const digitalStrafe = (keys.has("ArrowRight") || keys.has("d") || keys.has("D") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("a") || keys.has("A") ? 1 : 0);
  const length = Math.hypot(digitalStrafe, digitalForward);
  if (length > 0) return { x: digitalStrafe / length, z: -digitalForward / length, magnitude: 1 };
  if (state.joystick.active && state.joystick.magnitude > 0) {
    return { x: state.joystick.x, z: state.joystick.y, magnitude: state.joystick.magnitude };
  }
  return null;
}

function combatIndex() {
  return state.boss.stage === "fight" ? BOSS_INDEX : state.unlockedIndex;
}

function targetMobs() {
  return activeMobsForCastle(combatIndex());
}

function fragmentsAlive() {
  return mobs.filter((mob) => mob.userData.isFragment && mob.userData.alive).length;
}

function dashCooldownTotal() {
  return dashCooldownBase * state.perks.dashCooldownMult;
}

function startDash() {
  if (!state.abilities.dash || state.phase !== "play") return;
  if (state.dash.cooldown > 0 || state.dash.timer > 0) return;
  const input = currentInput();
  const dirX = input ? input.x : Math.sin(state.player.rotation);
  const dirZ = input ? input.z : Math.cos(state.player.rotation);
  state.dash.timer = dashDuration;
  state.dash.dirX = dirX;
  state.dash.dirZ = dirZ;
  state.dash.hitIds = new Set();
  state.dash.cooldown = dashCooldownTotal();
  state.player.vx = 0;
  state.player.vz = 0;
  spawnRingPulse(state.player.x, state.player.z, "#8bd3ff", 2.4, 0.35);
  vibrate(12);
}

function updateMovement(dt) {
  const input = currentInput();

  if (state.dash.timer > 0) {
    state.dash.timer = Math.max(0, state.dash.timer - dt);
    state.player.x += state.dash.dirX * dashSpeed * dt;
    state.player.z += state.dash.dirZ * dashSpeed * dt;
    state.player.rotation = Math.atan2(state.dash.dirX, state.dash.dirZ);
    state.player.speed = dashSpeed;
    spawnBurst(state.player.x, 0.7, state.player.z, state.perks.dashDamage ? "#f4bf45" : "#8bd3ff", 2, { speed: 1.2, lift: 1.2, life: 0.35, scale: 0.6 });
    if (state.perks.dashDamage > 0) {
      targetMobs().forEach((mob) => {
        if (state.dash.hitIds.has(mob.id)) return;
        const distance = Math.hypot(state.player.x - mob.position.x, state.player.z - mob.position.z);
        if (distance < 1.2 + (mob.userData.isBoss ? 1.6 : 0)) {
          state.dash.hitIds.add(mob.id);
          damageMob(mob, state.perks.dashDamage, 0.5, { source: "dash" });
          showProjectSprite("dash", "REALSOUL", mob.position.x, mob.position.z, "#4f70ff");
        }
      });
    }
  } else if (input) {
    const speed = playerSpeed * state.perks.moveMult * input.magnitude;
    state.player.x += input.x * speed * dt;
    state.player.z += input.z * speed * dt;
    state.player.rotation = Math.atan2(input.x, input.z);
    state.player.speed = THREE.MathUtils.lerp(state.player.speed, speed, Math.min(1, dt * 8));
  } else {
    state.player.speed = THREE.MathUtils.lerp(state.player.speed, 0, Math.min(1, dt * 8));
  }

  state.player.x += state.player.vx * dt;
  state.player.z += state.player.vz * dt;
  const knockbackDamping = Math.max(0, 1 - dt * 7.5);
  state.player.vx *= knockbackDamping;
  state.player.vz *= knockbackDamping;

  state.player.x = THREE.MathUtils.clamp(state.player.x, -worldBoundsX, worldBoundsX);
  state.player.z = THREE.MathUtils.clamp(state.player.z, worldEndZ, worldStartZ);
  resolveBuildingCollisions();
  resolveArenaBounds();

  const item = castleObjects[state.unlockedIndex];
  if (!item || objectiveComplete(item.index)) return;
  const gateZ = item.z + gateOffset;
  if (state.player.z < gateZ) {
    state.player.z = gateZ;
    const mobsLeft = activeMobsForCastle(item.index).length;
    const nodesLeft = remainingNodes(item.index);
    const text =
      mobsLeft > 0
        ? "Clear the mobs before the gate opens."
        : `${nodesLeft} ${pluralize(item.castle.objective.noun, nodesLeft)} left to open the gate.`;
    if (state.message !== text && clock.elapsedTime - state.messageAt > 1.2) setMessage(text);
  }
}

function resolveBuildingCollisions() {
  const radius = 0.72;
  for (const collider of buildingColliders) {
    if (collider.kind === "gate" && castleObjects[collider.castleIndex].gateProgress > 0.55) continue;
    const dx = state.player.x - collider.x;
    const dz = state.player.z - collider.z;
    const overlapX = collider.halfX + radius - Math.abs(dx);
    const overlapZ = collider.halfZ + radius - Math.abs(dz);
    if (overlapX <= 0 || overlapZ <= 0) continue;
    if (overlapX < overlapZ) {
      state.player.x += Math.sign(dx || 1) * overlapX;
      state.player.vx = 0;
    } else {
      state.player.z += Math.sign(dz || 1) * overlapZ;
      state.player.vz = 0;
    }
  }
  state.player.x = THREE.MathUtils.clamp(state.player.x, -worldBoundsX, worldBoundsX);
  state.player.z = THREE.MathUtils.clamp(state.player.z, worldEndZ, worldStartZ);
}

function resolveArenaBounds() {
  if (state.boss.stage !== "fight") return;
  const dx = state.player.x - bossArena.x;
  const dz = state.player.z - bossArena.z;
  const distance = Math.hypot(dx, dz);
  const limit = bossArena.radius - 0.9;
  if (distance > limit && distance > 0.001) {
    state.player.x = bossArena.x + (dx / distance) * limit;
    state.player.z = bossArena.z + (dz / distance) * limit;
    state.player.vx *= 0.2;
    state.player.vz *= 0.2;
  }
}

function updateMobs(dt) {
  const activeIndex = combatIndex();
  mobs.forEach((mob) => {
    const data = mob.userData;
    const isActive = data.alive && data.castleIndex === activeIndex;
    mob.visible = data.alive && data.castleIndex >= activeIndex && data.castleIndex <= activeIndex + 1;
    if (!mob.visible) return;
    if (data.isBoss || data.isFragment) return;

    const time = clock.elapsedTime + data.phase;
    mob.rotation.y += dt * 1.8;
    mob.position.y = Math.sin(time * 4) * 0.08;
    const baseScale = data.baseScale || 1;
    scratchVector.set(baseScale, baseScale, baseScale);
    mob.scale.lerp(scratchVector, Math.min(1, dt * 8));
    data.hitTimer = Math.max(0, data.hitTimer - dt);
    const isHit = data.hitTimer > 0;
    const hitBurst = data.hitBurst;
    if (hitBurst) {
      const hitProgress = data.hitTimer / 0.18;
      hitBurst.visible = isHit;
      hitBurst.material.opacity = Math.max(0, hitProgress) * 0.95;
      hitBurst.scale.setScalar(1 + (1 - hitProgress) * 1.35);
      hitBurst.rotation.z += dt * 11;
    }
    const lowHealth = state.perks.execute > 0 && data.hp <= data.maxHp / 2;
    mob.children.forEach((child) => {
      if (!child.material?.emissive) return;
      const base = child.userData.baseEmissive ?? 0.18;
      child.material.emissiveIntensity = isHit ? Math.max(1.2, base) : child.material === data.bodyMat && lowHealth ? Math.max(0.9, base * 2.2) : base;
    });
    if (data.bodyMat) data.bodyMat.emissive.set(lowHealth ? "#ff2d55" : "#4b1119");
    if (data.eliteRing) {
      data.eliteRing.material.opacity = 0.55 + Math.sin(time * 5) * 0.3;
      data.eliteRing.rotation.z -= dt * 1.2;
    }

    if (!isActive) {
      mob.position.x = data.baseX;
      mob.position.z = data.baseZ;
      return;
    }

    const dx = state.player.x - mob.position.x;
    const dz = state.player.z - mob.position.z;
    const distance = Math.hypot(dx, dz);
    data.shootCooldown = Math.max(0, data.shootCooldown - dt);
    if (data.shootRange && distance < data.shootRange) {
      if (state.perks.telegraph && data.shootCooldown < 0.45 && !data.telegraphed) {
        data.telegraphed = true;
        spawnRingPulse(mob.position.x, mob.position.z, "#fb7185", 1.6, 0.45, { reverse: true });
      }
      if (distance > 2.4 && data.shootCooldown <= 0) {
        fireEnemyBolt(mob, dx, dz, distance);
        data.shootCooldown = data.shootInterval;
        data.telegraphed = false;
      }
    }
    if (distance < data.aggro && distance > 0.1) {
      mob.position.x += (dx / distance) * dt * data.speed;
      mob.position.z += (dz / distance) * dt * data.speed;
    } else {
      const patrolRadius = data.type === "runner" ? 2.4 : 1.45;
      mob.position.x = THREE.MathUtils.lerp(mob.position.x, data.baseX + Math.sin(time * 0.85) * patrolRadius, Math.min(1, dt * 1.4));
      mob.position.z = THREE.MathUtils.lerp(mob.position.z, data.baseZ + Math.cos(time * 0.7) * patrolRadius, Math.min(1, dt * 1.4));
    }
    if (distance < 1.35 && state.dash.timer <= 0) {
      const hurt = hurtPlayer(dt * data.damage, { source: "contact" });
      if (hurt && state.message !== "A mob is hitting you. Back up and attack." && clock.elapsedTime - state.messageAt > 1.2) {
        setMessage("A mob is hitting you. Back up and attack.");
      }
      if (state.player.hitCooldown <= 0 && distance > 0.05) {
        let pushX = dx / distance;
        let pushZ = dz / distance;
        if (Math.abs(pushX) < 0.28) pushX = data.phase % 2 > 1 ? 0.72 : -0.72;
        const pushLength = Math.max(0.001, Math.hypot(pushX, pushZ));
        pushX /= pushLength;
        pushZ /= pushLength;
        const knock = lowPower ? 0.8 : 1;
        state.player.x += pushX * 1.25 * knock;
        state.player.z += pushZ * 1.25 * knock;
        state.player.vx += pushX * 7.2 * knock;
        state.player.vz += pushZ * 7.2 * knock;
        state.player.hitCooldown = 0.34;
      }
    }
  });
}

function startBossFight() {
  const boss = createBoss();
  registerMob(boss, BOSS_INDEX, bossArena.x, bossArena.z - 5, 0);
  for (let i = 0; i < 4; i += 1) {
    const fragment = createFragment(i);
    const angle = fragment.userData.orbitAngle;
    registerMob(fragment, BOSS_INDEX, boss.position.x + Math.cos(angle) * 3.5, boss.position.z + Math.sin(angle) * 3.5, i);
  }
  state.boss.mesh = boss;
  state.boss.hp = boss.userData.maxHp;
  state.boss.stage = "fight";
  state.boss.volleyCooldown = 2.5;
  state.boss.slamCooldown = 6;
  state.boss.slamming = false;
  state.boss.minionWave = 0;
  state.boss.telegraphed = false;
  if (arena.boundary) arena.boundary.visible = true;
  spawnBurst(bossArena.x, 2.5, bossArena.z - 5, "#c084fc", 30, { speed: 5, lift: 5, life: 1 });
  spawnRingPulse(bossArena.x, bossArena.z, "#c084fc", 12, 1.0);
  setMessage("The Fragmenter. Break the four fragments, then the core.");
  vibrate(25);
  updateHud(true);
}

function spawnBossMinions() {
  const castle = castles[castles.length - 1];
  const difficulty = difficultyFor(6);
  [0, 1, 2].forEach((i) => {
    const angle = Math.PI * 0.5 + (i / 3) * Math.PI * 2 + 0.4;
    const minion = createMob(castle, "runner", { difficulty });
    registerMob(minion, BOSS_INDEX, bossArena.x + Math.cos(angle) * (bossArena.radius - 2.5), bossArena.z + Math.sin(angle) * (bossArena.radius - 2.5), i + 10);
    spawnBurst(minion.position.x, 1, minion.position.z, "#c084fc", 8, { speed: 3, lift: 3, life: 0.6 });
  });
  state.boss.minionWave += 1;
  setMessage(state.boss.minionWave === 1 ? "Fragments spill out. Clear them fast." : "One more wave of fragments.");
}

function updateBoss(dt) {
  const boss = state.boss;
  if (boss.stage === "approach") {
    if (state.player.z < bossArena.entryZ) startBossFight();
    return;
  }
  if (boss.stage === "defeated") {
    boss.endTimer -= dt;
    if (boss.endTimer <= 0 && state.phase === "play") {
      state.completed = true;
      openEnding();
    }
    return;
  }
  if (boss.stage !== "fight" || !boss.mesh) return;
  const mesh = boss.mesh;
  const data = mesh.userData;
  if (!data.alive) return;
  const time = clock.elapsedTime;
  boss.hp = data.hp;
  const fraction = Math.max(0, data.hp / data.maxHp);
  const phaseTwo = data.hp <= data.maxHp / 2;

  data.core.rotation.y += dt * 0.7;
  data.core.rotation.x += dt * 0.25;
  data.halo.rotation.z += dt * 0.5;
  data.halo.material.opacity = fragmentsAlive() > 0 ? 0.75 + Math.sin(time * 4) * 0.2 : 0.15;
  data.hitTimer = Math.max(0, data.hitTimer - dt);
  const isHit = data.hitTimer > 0;
  if (data.hitBurst) {
    const hitProgress = data.hitTimer / 0.18;
    data.hitBurst.visible = isHit;
    data.hitBurst.material.opacity = Math.max(0, hitProgress) * 0.95;
    data.hitBurst.scale.setScalar(1 + (1 - hitProgress) * 1.2);
  }
  const lowHealth = state.perks.execute > 0 && phaseTwo;
  data.core.material.emissiveIntensity = isHit ? 1.6 : 0.5 + (1 - fraction) * 0.6;
  data.core.material.emissive.set(lowHealth ? "#ff2d55" : "#6d4ea2");
  scratchVector.set(1, 1, 1);
  mesh.scale.lerp(scratchVector, Math.min(1, dt * 6));

  // Fragments orbit the core; they retire when the core reaches phase two.
  mobs.forEach((mob, i) => {
    const fragment = mob.userData;
    if (!fragment.isFragment) return;
    if (!fragment.alive) return;
    if (phaseTwo) {
      fragment.alive = false;
      mob.visible = false;
      spawnBurst(mob.position.x, 1.5, mob.position.z, fragment.color, 10, { speed: 3, lift: 3, life: 0.6 });
      return;
    }
    const angle = fragment.orbitAngle + time * 0.8;
    mob.position.set(mesh.position.x + Math.cos(angle) * 3.5, 1.6 + Math.sin(time * 2 + i) * 0.4, mesh.position.z + Math.sin(angle) * 3.5);
    mob.rotation.y += dt * 2;
    fragment.hitTimer = Math.max(0, fragment.hitTimer - dt);
    const fragmentLow = state.perks.execute > 0 && fragment.hp <= fragment.maxHp / 2;
    mob.children.forEach((child) => {
      if (!child.material?.emissive) return;
      const base = child.userData.baseEmissive ?? 0.5;
      child.material.emissiveIntensity = fragment.hitTimer > 0 ? Math.max(1.4, base) : fragmentLow ? base * 1.6 : base;
    });
    scratchVector.set(1, 1, 1);
    mob.scale.lerp(scratchVector, Math.min(1, dt * 8));
  });

  const dx = state.player.x - mesh.position.x;
  const dz = state.player.z - mesh.position.z;
  const distance = Math.hypot(dx, dz);
  const speed = data.speed * (phaseTwo ? 1.25 : 1);
  if (distance > 3 && !boss.slamming) {
    mesh.position.x += (dx / distance) * speed * dt;
    mesh.position.z += (dz / distance) * speed * dt;
  }
  const targetYaw = Math.atan2(-dx, -dz);
  let yawDelta = targetYaw - mesh.rotation.y;
  yawDelta = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta));
  mesh.rotation.y += yawDelta * Math.min(1, dt * 4);

  if (distance < 2.9 && state.dash.timer <= 0) {
    hurtPlayer(dt * data.damage, { source: "boss" });
    if (state.player.hitCooldown <= 0 && distance > 0.05) {
      const knock = lowPower ? 0.8 : 1;
      state.player.x += (dx / distance) * 1.6 * knock;
      state.player.z += (dz / distance) * 1.6 * knock;
      state.player.vx += (dx / distance) * 8 * knock;
      state.player.vz += (dz / distance) * 8 * knock;
      state.player.hitCooldown = 0.4;
    }
  }

  boss.volleyCooldown -= dt;
  if (state.perks.telegraph && boss.volleyCooldown < 0.45 && !boss.telegraphed && distance < 28) {
    boss.telegraphed = true;
    spawnRingPulse(mesh.position.x, mesh.position.z, "#fb7185", 2.6, 0.45, { reverse: true });
  }
  if (boss.volleyCooldown <= 0 && distance < 28 && distance > 2 && !boss.slamming) {
    const spread = 0.26;
    const baseAngle = Math.atan2(dx, dz);
    for (let i = 0; i < 3; i += 1) {
      const angle = baseAngle + (i - 1) * spread;
      fireEnemyBoltFrom(mesh.position.x, mesh.position.z, Math.sin(angle), Math.cos(angle), data.shootDamage, 9.5, "#c084fc");
    }
    boss.volleyCooldown = phaseTwo ? 1.6 : 2.2;
    boss.telegraphed = false;
  }

  if (phaseTwo) {
    const minionsAlive = mobs.filter((mob) => mob.userData.castleIndex === BOSS_INDEX && !mob.userData.isBoss && !mob.userData.isFragment && mob.userData.alive).length;
    if (boss.minionWave === 0 || (boss.minionWave === 1 && minionsAlive === 0)) spawnBossMinions();

    boss.slamCooldown -= dt;
    if (!boss.slamming && boss.slamCooldown <= 0) {
      boss.slamming = true;
      boss.slamTimer = 0.8;
      spawnRingPulse(mesh.position.x, mesh.position.z, "#fb7185", 5, 0.8, { reverse: true });
      spawnBeam(mesh.position.x, mesh.position.z, state.player.x, state.player.z, "#fb7185", 0.8, 1.0);
      setMessage(state.abilities.dash ? "Slam incoming. DASH out of the ring." : "Slam incoming. Get out of the ring.");
    }
    if (boss.slamming) {
      boss.slamTimer -= dt;
      if (boss.slamTimer <= 0) {
        boss.slamming = false;
        boss.slamCooldown = 8;
        spawnRingPulse(mesh.position.x, mesh.position.z, "#ffffff", 5.2, 0.5);
        spawnBurst(mesh.position.x, 0.6, mesh.position.z, "#c084fc", 20, { speed: 6, lift: 3, life: 0.7 });
        const slamDistance = Math.hypot(state.player.x - mesh.position.x, state.player.z - mesh.position.z);
        if (slamDistance < 5) hurtPlayer(20, { push: 9, fromX: mesh.position.x, fromZ: mesh.position.z, source: "slam" });
      }
    }
  }
}

function onBossDefeated(mob) {
  state.boss.stage = "defeated";
  state.boss.endTimer = 1.6;
  state.boss.hp = 0;
  for (let i = mobs.length - 1; i >= 0; i -= 1) {
    const other = mobs[i];
    if (other.userData.castleIndex === BOSS_INDEX && !other.userData.isBoss && other.userData.alive) {
      other.userData.alive = false;
      other.visible = false;
      spawnBurst(other.position.x, 0.9, other.position.z, "#c084fc", 8, { speed: 3, lift: 3, life: 0.6 });
    }
  }
  enemyProjectiles.splice(0).forEach((bolt) => scene.remove(bolt));
  spawnBurst(mob.position.x, 2.4, mob.position.z, "#ffffff", 40, { speed: 7, lift: 6, life: 1.3 });
  spawnRingPulse(mob.position.x, mob.position.z, "#ffffff", 14, 1.2);
  arena.pillars.forEach((entry) => {
    spawnBeam(mob.position.x, mob.position.z, entry.pillar.position.x, entry.pillar.position.z, entry.cap.material.color.getStyle(), 1.6, 2.4);
  });
  setMessage("Systems reconnected.");
  vibrate(40);
}

function updateArena(dt) {
  const boss = state.boss;
  if (arena.boundary) {
    const targetOpacity = boss.stage === "fight" ? 0.55 + Math.sin(clock.elapsedTime * 3) * 0.2 : 0;
    arena.boundary.material.opacity = THREE.MathUtils.lerp(arena.boundary.material.opacity, targetOpacity, Math.min(1, dt * 4));
    arena.boundary.visible = arena.boundary.material.opacity > 0.02;
  }
  const litCount = boss.stage === "defeated" ? castles.length : boss.stage === "fight" ? Math.floor((1 - boss.hp / boss.maxHp) * castles.length) : 0;
  arena.pillars.forEach((entry, index) => {
    const target = index < litCount ? 1 : 0;
    entry.lit = THREE.MathUtils.lerp(entry.lit, target, Math.min(1, dt * 3));
    entry.cap.material.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.3, entry.lit);
  });
}

function updateCompanions(dt) {
  if (!companions.length) return;
  const time = clock.elapsedTime;
  const targets = targetMobs();
  companions.forEach((drone, index) => {
    const data = drone.userData;
    data.angle += dt * 2.6;
    const radius = 1.6;
    const goalX = state.player.x + Math.cos(data.angle) * radius;
    const goalZ = state.player.z + Math.sin(data.angle) * radius;
    drone.position.x = THREE.MathUtils.lerp(drone.position.x, goalX, Math.min(1, dt * 8));
    drone.position.z = THREE.MathUtils.lerp(drone.position.z, goalZ, Math.min(1, dt * 8));
    drone.position.y = 1.7 + Math.sin(time * 3 + index) * 0.15;
    data.core.rotation.y += dt * 3;
    data.ring.rotation.z += dt * 2;
    data.zapTimer -= dt;
    if (data.zapTimer > 0) return;
    let best = null;
    let bestDistance = 9;
    targets.forEach((mob) => {
      const distance = Math.hypot(drone.position.x - mob.position.x, drone.position.z - mob.position.z);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = mob;
      }
    });
    if (!best) {
      data.zapTimer = 0.3;
      return;
    }
    damageMob(best, 1, 0.3, { source: "companion" });
    spawnBeam(drone.position.x, drone.position.z, best.position.x, best.position.z, "#8bd3ff", 0.3, 1.5);
    showProjectSprite(index === 0 ? "companion0" : "companion1", index === 0 ? "Masscall" : "AutoArt", best.position.x, best.position.z, "#8bd3ff");
    data.zapTimer = 1.5 * state.perks.cooldownMult;
  });
}

function updatePickups(dt) {
  pickups.forEach((pickup) => {
    if (!pickup.userData.active) return;
    pickup.rotation.y += dt * 2.8 * Math.sign(pickup.userData.spin || 1);
    pickup.position.y = pickup.userData.baseY + Math.sin(clock.elapsedTime * 3 + pickup.position.z) * 0.16;
    const distance = Math.hypot(state.player.x - pickup.position.x, state.player.z - pickup.position.z);
    if (distance < 1.35) {
      pickup.userData.active = false;
      pickup.visible = false;
      const healed = heal(22);
      spawnBurst(pickup.position.x, pickup.position.y, pickup.position.z, "#fb7185", 8, { speed: 2.6, lift: 3, life: 0.6, scale: 0.8 });
      setMessage(state.perks.healMult > 1 ? `Grant Funding: +${healed} health.` : `+${healed} health.`);
    }
  });
}

function heal(amount, options = {}) {
  const before = state.playerHealth;
  state.playerHealth = Math.min(state.perks.maxHealth, state.playerHealth + amount * state.perks.healMult);
  const gained = state.playerHealth - before;
  if (gained > 0.5 && !options.silent) {
    spawnBurst(state.player.x, 1.4, state.player.z, "#6fd18c", 5, { speed: 1.6, lift: 2.4, life: 0.5, scale: 0.6 });
  }
  return Math.round(gained);
}

function updateRegen(dt) {
  if (state.perks.regen <= 0) return;
  if (clock.elapsedTime - state.lastHurtAt < 3 || state.playerHealth >= state.perks.maxHealth) return;
  heal(state.perks.regen * dt, { silent: true });
  if (clock.elapsedTime - state.regenTrickleAt > 0.4) {
    state.regenTrickleAt = clock.elapsedTime;
    spawnBurst(state.player.x, 0.6, state.player.z, "#6fd18c", 2, { speed: 0.6, lift: 2.2, life: 0.6, scale: 0.5 });
  }
}

function updatePriorityTarget() {
  if (state.perks.priorityBonus <= 0) {
    state.priorityTarget = null;
    priorityMarker.visible = false;
    return;
  }
  let best = null;
  targetMobs().forEach((mob) => {
    if (!best || mob.userData.hp > best.userData.hp || (mob.userData.hp === best.userData.hp && mob.userData.isBoss)) best = mob;
  });
  state.priorityTarget = best;
  priorityMarker.visible = Boolean(best);
  if (best) {
    const height = (best.userData.isBoss ? 4.8 : 2.4 * (best.userData.baseScale || 1)) + Math.sin(clock.elapsedTime * 5) * 0.15;
    priorityMarker.position.set(best.position.x, height, best.position.z);
    priorityMarker.rotation.y += 0.05;
  }
}

function updateIdlePrompt() {
  const idleLimit = lowPower ? 20 : 45;
  if (state.run.idlePrompts >= 2) return;
  if (clock.elapsedTime - state.run.lastInputAt < idleLimit) return;
  state.run.idlePrompts += 1;
  state.run.lastInputAt = clock.elapsedTime;
  setMessage(lowPower ? "Short on time? Tap CV for the 30-second summary." : "Short on time? Press Tab for the 30-second CV.");
}

function updateNodes(dt) {
  const time = clock.elapsedTime;
  castleObjects.forEach((item) => {
    const isCurrent = item.index === state.unlockedIndex;
    item.nodes.forEach((node, i) => {
      const data = node.userData;
      node.visible = data.active && item.index >= state.unlockedIndex && item.index <= state.unlockedIndex + 1;
      if (!node.visible) return;
      if (item.castle.nodeLayout === "orbit" && isCurrent) {
        const angle = data.angle + time * 0.9;
        node.position.x = item.x + Math.cos(angle) * 4.4;
        node.position.z = item.z + gateOffset + 3.2 + Math.sin(angle) * 3.2;
      }
      data.shape.rotation.y += dt * 1.6;
      data.shape.rotation.x = Math.sin(time * 1.3 + i) * 0.22;
      data.shape.position.y = data.baseY + Math.sin(time * 2.6 + data.phase) * 0.18;
      data.glow.material.opacity = 0.32 + Math.sin(time * 3 + i) * 0.14;
      data.glow.rotation.z += dt * 0.8;
      if (!isCurrent || state.phase !== "play") return;
      const distance = Math.hypot(state.player.x - node.position.x, state.player.z - node.position.z);
      if (distance < nodeCollectRadius) collectNode(item, node);
    });
  });
}

function collectNode(item, node) {
  node.userData.active = false;
  node.visible = false;
  const color = item.castle.color;
  spawnBurst(node.position.x, 1.05, node.position.z, color, 10, { speed: 3, lift: 3.2, life: 0.7 });
  spawnRingPulse(node.position.x, node.position.z, color, 2.6);
  const remaining = remainingNodes(item.index);
  const mobsLeft = activeMobsForCastle(item.index).length;
  const noun = item.castle.objective.noun;
  if (remaining > 0) {
    setMessage(`${remaining} ${pluralize(noun, remaining)} left. ${item.castle.objective.label}.`);
    return;
  }
  item.nodes.forEach((piece) => spawnBeam(piece.position.x, piece.position.z, item.x, item.z + 4.2, color));
  setMessage(mobsLeft > 0 ? `${item.castle.objective.done} ${mobsLeft} ${pluralize("mob", mobsLeft)} left.` : item.castle.objective.done);
}

function remainingNodes(castleIndex) {
  const item = castleObjects[castleIndex];
  return item ? item.nodes.filter((node) => node.userData.active).length : 0;
}

function activeMobsForCastle(castleIndex) {
  return mobs.filter((mob) => mob.userData.castleIndex === castleIndex && mob.userData.alive);
}

function objectiveComplete(castleIndex) {
  return activeMobsForCastle(castleIndex).length === 0 && remainingNodes(castleIndex) === 0;
}

function updateCastles(dt) {
  const time = clock.elapsedTime;
  const current = castleObjects[state.unlockedIndex] || null;
  let nearest = null;
  let bestDistance = Infinity;

  castleObjects.forEach((item) => {
    const distance = Math.hypot(state.player.x - item.x, state.player.z - item.z);
    const isCurrent = item.index === state.unlockedIndex;
    const isDone = item.index < state.unlockedIndex;
    const open = isDone || (isCurrent && objectiveComplete(item.index));

    if (open && item.gateProgress < 1) {
      if (item.gateProgress === 0) {
        spawnBurst(item.x, 1.5, item.z + 3.9, item.castle.color, 16, { speed: 3.4, lift: 3.6, life: 0.8 });
        spawnRingPulse(item.x, item.z + 4.4, item.castle.color, 4.5, 0.7);
        if (isCurrent && !item.discovered) setMessage("The gate is opening. Walk inside to choose your upgrade.");
      }
      item.gateProgress = Math.min(1, item.gateProgress + dt / gateAnimDuration);
    }
    const eased = 1 - Math.pow(1 - item.gateProgress, 3);
    item.gate.position.y = THREE.MathUtils.lerp(1.32, -1.45, eased);
    item.gate.visible = item.gateProgress < 1;
    item.gateGlow.visible = item.gateProgress > 0.25;
    item.gateGlow.material.opacity = 0.2 + eased * 0.55;

    const inside = distance <= triggerRadius;
    const ringTarget = isDone ? 0.55 : open ? (inside ? 1 : 0.82) : 0;
    item.ring.material.opacity = THREE.MathUtils.lerp(item.ring.material.opacity, ringTarget, Math.min(1, dt * 4));
    item.ring.visible = item.ring.material.opacity > 0.02;
    item.ring.scale.setScalar(inside && open && !isDone ? 1.06 : 1);

    const litTarget = item.discovered ? 1 : 0;
    item.lit = THREE.MathUtils.lerp(item.lit, litTarget, Math.min(1, dt * 1.6));
    if (Math.abs(item.lit - litTarget) < 0.005) item.lit = litTarget;
    item.accentMeshes.forEach((mesh) => {
      mesh.material.emissiveIntensity = THREE.MathUtils.lerp(0.18, 1.05, item.lit);
    });
    item.iconMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.22, 1.1, item.lit);
    item.beacon.visible = item.lit > 0.01;
    item.beacon.material.opacity = 0.3 * item.lit;
    const shimmer = 1 + Math.sin(time * 2 + item.index) * 0.08 * item.lit;
    item.beacon.scale.set(shimmer, Math.max(0.01, item.lit), shimmer);

    if (inside && distance < bestDistance) {
      nearest = item;
      bestDistance = distance;
    }
  });

  let focus = null;
  if (
    current &&
    state.player.z < current.z + gateOffset + 16 &&
    state.player.z > current.z - 6 &&
    Math.abs(state.player.x - current.x) < 14
  ) {
    focus = current;
  }
  if (!focus) focus = nearest;
  state.focusItem = focus;
  state.activeCastle = focus ? focus.castle : null;
}

function updateDiscoveryTrigger() {
  const item = castleObjects[state.unlockedIndex];
  if (!item || item.discovered || !objectiveComplete(item.index)) return;
  if (Math.abs(state.player.x - item.x) < 2.3 && Math.abs(state.player.z - item.z) < 2.9) openDiscovery(item);
}

// Damage funnel: every player-side source passes through here so every upgrade
// applies everywhere (flat damage, execute, priority, kill stacks, crits, armour).
function damageMob(mob, base, knockback = 0.55, options = {}) {
  const data = mob.userData;
  if (!data.alive) return 0;
  let amount = base + state.perks.flatDamage;
  if (state.perks.execute > 0 && data.hp <= data.maxHp / 2) amount += state.perks.execute;
  if (state.perks.priorityBonus > 0 && mob === state.priorityTarget) amount += state.perks.priorityBonus;
  amount *= 1 + Math.min(state.perks.killStackCap, state.kills * state.perks.killStack);
  let crit = false;
  if (state.perks.critChance > 0) {
    if (Math.random() < state.perks.critChance + state.critBank) {
      crit = true;
      state.critBank = 0;
      amount *= 2;
      showProjectSprite("crit", "x2 · BJJ Predict", mob.position.x, mob.position.z, "#f4bf45");
    } else {
      state.critBank += 0.08;
    }
  }
  if (data.isBoss && fragmentsAlive() > 0) amount *= 0.5;
  amount = Math.max(0.5, Math.round(amount * 2) / 2);
  data.hp -= amount;
  data.hitTimer = 0.18;
  mob.scale.setScalar((data.baseScale || 1) * (data.isBoss ? 1.06 : 1.18));
  const dx = mob.position.x - state.player.x;
  const dz = mob.position.z - state.player.z;
  const length = Math.max(0.001, Math.hypot(dx, dz));
  const push = knockback * (data.isBoss || data.isFragment ? 0 : 1);
  mob.position.x += (dx / length) * push;
  mob.position.z += (dz / length) * push;
  spawnBurst(mob.position.x, 1.1, mob.position.z, crit ? "#ffffff" : "#fff6a3", crit ? 8 : 4, {
    speed: crit ? 3.4 : 2.6,
    lift: 2.4,
    life: 0.45,
    scale: crit ? 0.9 : 0.7,
  });
  if (data.hp <= 0.001) defeatMob(mob);
  return amount;
}

function defeatMob(mob) {
  const data = mob.userData;
  data.alive = false;
  mob.visible = false;
  const color = data.color || "#fff6a3";
  spawnBurst(mob.position.x, 0.9, mob.position.z, color, data.elite ? 22 : 14, { speed: 4.2, lift: 4.2, life: 0.8 });
  spawnRingPulse(mob.position.x, mob.position.z, color, data.elite ? 4.5 : 3.2, 0.55);
  state.kills += 1;
  if (state.perks.healOnKill > 0) {
    const healed = heal(data.elite && !data.isFragment ? state.perks.healOnKill * 2 : state.perks.healOnKill);
    if (healed > 0) showProjectSprite("killheal", `+${healed} · AClienti`, state.player.x, state.player.z, "#6fd18c");
  }
  if (state.perks.killStack > 0 && state.kills % 5 === 0) {
    showProjectSprite("loop", `Loop x${state.kills}`, state.player.x, state.player.z, "#7cc77d");
  }
  if (data.isBoss) onBossDefeated(mob);
  else if (data.isFragment && state.boss.stage === "fight") {
    const left = fragmentsAlive();
    setMessage(left > 0 ? `Fragment broken. ${left} left before the core is exposed.` : "All fragments broken. The core is exposed.");
  }
}

function hurtPlayer(amount, options = {}) {
  if (amount <= 0) return false;
  if (state.invulnTimer > 0 || state.dash.timer > 0) return false;
  const dealt = amount * state.perks.damageTakenMult;
  state.playerHealth = Math.max(0, state.playerHealth - dealt);
  state.lastHurtAt = clock.elapsedTime;
  if (options.push && options.fromX !== undefined) {
    const dx = state.player.x - options.fromX;
    const dz = state.player.z - options.fromZ;
    const length = Math.max(0.001, Math.hypot(dx, dz));
    state.player.vx += (dx / length) * options.push;
    state.player.vz += (dz / length) * options.push;
  }
  if (clock.elapsedTime - state.hurtFlashAt > 0.3 && stageNode) {
    state.hurtFlashAt = clock.elapsedTime;
    stageNode.classList.remove("is-hurt");
    void stageNode.offsetWidth;
    stageNode.classList.add("is-hurt");
    window.setTimeout(() => stageNode.classList.remove("is-hurt"), 320);
  }
  if (state.perks.shockwave) {
    state.rallyAccum += dealt;
    if (state.rallyAccum >= 1 && state.rallyCooldown <= 0) triggerRally();
  }
  if (state.playerHealth <= 0) {
    if (state.perks.survivor && state.survivorUsed !== combatIndex()) {
      state.survivorUsed = combatIndex();
      state.playerHealth = Math.round(state.perks.maxHealth * 0.4);
      state.invulnTimer = 1.5;
      targetMobs().forEach((mob) => {
        if (mob.userData.isBoss || mob.userData.isFragment) return;
        const dx = mob.position.x - state.player.x;
        const dz = mob.position.z - state.player.z;
        const distance = Math.hypot(dx, dz);
        if (distance > 6 || distance < 0.01) return;
        mob.position.x += (dx / distance) * 3;
        mob.position.z += (dz / distance) * 3;
        mob.userData.hitTimer = 0.18;
      });
      spawnRingPulse(state.player.x, state.player.z, "#f97316", 6, 0.7);
      spawnBurst(state.player.x, 1.2, state.player.z, "#f97316", 16, { speed: 4, lift: 4, life: 0.8 });
      showProjectSprite("survivor", "Survived the crash", state.player.x, state.player.z, "#f97316");
      setMessage("Cycle Survivor: you rode out the crash at 40% health.");
      return true;
    }
    respawn();
  }
  return true;
}

function triggerRally() {
  state.rallyCooldown = 3;
  state.rallyAccum = 0;
  spawnRingPulse(state.player.x, state.player.z, "#4f70ff", 4.5, 0.5);
  targetMobs().forEach((mob) => {
    if (mob.userData.isBoss || mob.userData.isFragment) return;
    const dx = mob.position.x - state.player.x;
    const dz = mob.position.z - state.player.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 4.5 || distance < 0.01) return;
    mob.position.x += (dx / distance) * 3;
    mob.position.z += (dz / distance) * 3;
    mob.userData.hitTimer = 0.18;
  });
  for (let i = enemyProjectiles.length - 1; i >= 0; i -= 1) {
    const bolt = enemyProjectiles[i];
    if (Math.hypot(bolt.position.x - state.player.x, bolt.position.z - state.player.z) < 3) {
      enemyProjectiles.splice(i, 1);
      scene.remove(bolt);
    }
  }
  showProjectSprite("rally", "$GONE", state.player.x, state.player.z, "#4f70ff");
}

function swordRadius() {
  return attackRadius + state.perks.swordRadius + (lowPower ? 0.4 : 0);
}

function attack() {
  if (state.phase !== "play" || state.attackCooldown > 0 || state.dash.timer > 0) return;
  const base = state.weapon === "bow" ? 0.48 : state.weapon === "arc" ? 1.0 : 0.38;
  state.attackCooldown = base * state.perks.cooldownMult;
  state.attackTimer = attackDuration;
  canvas.classList.remove("is-attacking");
  window.requestAnimationFrame(() => canvas.classList.add("is-attacking"));
  window.setTimeout(() => {
    canvas.classList.remove("is-attacking");
  }, attackDuration * 1000);

  if (state.weapon === "bow") {
    fireArrows();
    return;
  }
  if (state.weapon === "arc") {
    fireArc();
    return;
  }

  const radius = swordRadius();
  const hitSet = new Set();
  const targets = targetMobs();
  targets.forEach((mob) => {
    const distance = Math.hypot(state.player.x - mob.position.x, state.player.z - mob.position.z);
    if (distance > radius + (mob.userData.isBoss ? 1.6 : 0)) return;
    damageMob(mob, 1, 0.7, { source: "sword" });
    hitSet.add(mob);
  });
  if (state.perks.coneRange > 0) {
    const facingX = Math.sin(state.player.rotation);
    const facingZ = Math.cos(state.player.rotation);
    const cosLimit = Math.cos((25 * Math.PI) / 180);
    targets.forEach((mob) => {
      if (hitSet.has(mob) || !mob.userData.alive) return;
      const dx = mob.position.x - state.player.x;
      const dz = mob.position.z - state.player.z;
      const distance = Math.hypot(dx, dz);
      if (distance > state.perks.coneRange + (mob.userData.isBoss ? 1.6 : 0) || distance < 0.01) return;
      if ((dx / distance) * facingX + (dz / distance) * facingZ < cosLimit) return;
      damageMob(mob, 1, 0.9, { source: "cone" });
      hitSet.add(mob);
    });
    spawnBeam(state.player.x, state.player.z, state.player.x + facingX * state.perks.coneRange, state.player.z + facingZ * state.perks.coneRange, "#fff6a3", 0.25, 1.0);
  }
  if (hitSet.size) reportCombat();
  else if (state.perks.coneRange <= 0) setMessage("Move closer to a mob before attacking.");
}

function reportCombat() {
  if (state.boss.stage === "fight") return;
  const castleIndex = state.unlockedIndex;
  const item = castleObjects[castleIndex];
  if (!item) return;
  const mobsLeft = activeMobsForCastle(castleIndex).length;
  const nodesLeft = remainingNodes(castleIndex);
  const noun = item.castle.objective.noun;
  if (mobsLeft > 0) {
    setMessage(`${mobsLeft} ${pluralize("mob", mobsLeft)} left.`);
  } else if (nodesLeft > 0) {
    setMessage(`Mobs cleared. ${nodesLeft} ${pluralize(noun, nodesLeft)} left. ${item.castle.objective.label}.`);
  } else {
    setMessage("Mobs cleared.");
  }
}

function aimAngle() {
  const base = state.player.rotation;
  if (!lowPower) return base;
  let best = base;
  let bestDelta = (18 * Math.PI) / 180;
  targetMobs().forEach((mob) => {
    const angle = Math.atan2(mob.position.x - state.player.x, mob.position.z - state.player.z);
    let delta = angle - base;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    if (Math.abs(delta) < bestDelta) {
      bestDelta = Math.abs(delta);
      best = angle;
    }
  });
  return best;
}

function fireArrows() {
  const count = Math.max(1, Math.round(state.perks.arrowCount));
  const baseAngle = aimAngle();
  const speed = 25 * state.perks.arrowSpeedMult;
  const range = bowRange + state.perks.bowRange;
  for (let i = 0; i < count; i += 1) {
    const offset = count === 1 ? 0 : (i - (count - 1) / 2) * 0.22;
    const angle = baseAngle + offset;
    const dirX = Math.sin(angle);
    const dirZ = Math.cos(angle);
    const arrow = new THREE.Group();
    const shaft = new THREE.Mesh(arrowShaftGeometry, arrowShaftMaterial);
    const head = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
    head.position.z = -0.68;
    head.rotation.x = -Math.PI / 2;
    arrow.add(shaft, head);
    arrow.position.set(state.player.x + dirX * 0.9, 1.08, state.player.z + dirZ * 0.9);
    arrow.rotation.y = Math.atan2(-dirX, -dirZ);
    arrow.userData = { vx: dirX * speed, vz: dirZ * speed, age: 0, maxAge: range / speed };
    projectiles.push(arrow);
    scene.add(arrow);
  }
}

function fireArc() {
  const targets = targetMobs();
  const range = arcRange + state.perks.arcRange;
  let first = null;
  let bestDistance = range;
  targets.forEach((mob) => {
    const distance = Math.hypot(state.player.x - mob.position.x, state.player.z - mob.position.z);
    if (distance < bestDistance) {
      bestDistance = distance;
      first = mob;
    }
  });
  if (!first) {
    setMessage("No enemy in arc range.");
    return;
  }
  const chain = [first];
  let current = first;
  while (chain.length < 1 + state.perks.chainTargets) {
    let next = null;
    let nextDistance = arcChainRange;
    targets.forEach((mob) => {
      if (chain.includes(mob)) return;
      const distance = Math.hypot(current.position.x - mob.position.x, current.position.z - mob.position.z);
      if (distance < nextDistance) {
        nextDistance = distance;
        next = mob;
      }
    });
    if (!next) break;
    chain.push(next);
    current = next;
  }
  let fromX = state.player.x;
  let fromZ = state.player.z;
  chain.forEach((mob) => {
    spawnBeam(fromX, fromZ, mob.position.x, mob.position.z, "#8bd3ff", 0.35, 1.3);
    fromX = mob.position.x;
    fromZ = mob.position.z;
    damageMob(mob, 1, 0.4, { source: "arc" });
  });
  state.arcFlash = 0.3;
  reportCombat();
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    const data = projectile.userData;
    data.age += dt;
    projectile.position.x += data.vx * dt;
    projectile.position.z += data.vz * dt;
    projectile.position.y = 1.08 + Math.sin(data.age * 28) * 0.035;

    let remove = data.age >= data.maxAge;
    if (!remove) {
      const targets = targetMobs();
      for (const mob of targets) {
        const reach = 1.08 + (mob.userData.isBoss ? 1.5 : 0);
        const distance = Math.hypot(projectile.position.x - mob.position.x, projectile.position.z - mob.position.z);
        if (distance >= reach) continue;
        damageMob(mob, 1, 1.05, { source: "arrow" });
        reportCombat();
        remove = true;
        break;
      }
    }
    if (remove) {
      projectiles.splice(i, 1);
      scene.remove(projectile);
    }
  }
}

function fireEnemyBoltFrom(x, z, dirX, dirZ, damage, speed, color) {
  if (!boltMaterials.has(color)) boltMaterials.set(color, new THREE.MeshBasicMaterial({ color }));
  const bolt = new THREE.Mesh(boltGeometry, boltMaterials.get(color));
  const finalSpeed = speed * state.perks.boltSpeedMult;
  bolt.position.set(x, 1.08, z);
  bolt.userData = {
    vx: dirX * finalSpeed,
    vz: dirZ * finalSpeed,
    age: 0,
    maxAge: 15.5 / finalSpeed,
    damage,
  };
  enemyProjectiles.push(bolt);
  scene.add(bolt);
}

function fireEnemyBolt(mob, dx, dz, distance) {
  fireEnemyBoltFrom(mob.position.x, mob.position.z, dx / distance, dz / distance, mob.userData.shootDamage, mob.userData.boltSpeed || 8.4, "#fb7185");
}

function updateEnemyProjectiles(dt) {
  for (let i = enemyProjectiles.length - 1; i >= 0; i -= 1) {
    const bolt = enemyProjectiles[i];
    bolt.userData.age += dt;
    bolt.position.x += bolt.userData.vx * dt;
    bolt.position.z += bolt.userData.vz * dt;
    bolt.position.y = 1.08 + Math.sin(bolt.userData.age * 18) * 0.08;
    bolt.scale.setScalar(1 + Math.sin(bolt.userData.age * 22) * 0.18);
    const distance = Math.hypot(state.player.x - bolt.position.x, state.player.z - bolt.position.z);
    let remove = bolt.userData.age >= bolt.userData.maxAge;
    if (!remove && distance < 0.95) {
      spawnBurst(bolt.position.x, 1.1, bolt.position.z, "#fb7185", 6, { speed: 2.4, lift: 2.4, life: 0.5, scale: 0.8 });
      const hurt = hurtPlayer(bolt.userData.damage, { push: 4.5, fromX: bolt.position.x, fromZ: bolt.position.z, source: "bolt" });
      if (hurt && clock.elapsedTime - state.messageAt > 1.2) setMessage("A ranged hit. Keep moving.");
      // hurtPlayer may respawn the player and clear this array.
      if (!enemyProjectiles.includes(bolt)) return;
      remove = true;
    }
    if (remove) {
      enemyProjectiles.splice(i, 1);
      scene.remove(bolt);
    }
  }
}

function updateTheme() {
  scratchColor.copy(baseThemeColor);
  if (state.boss.stage === "fight" || state.boss.stage === "defeated") {
    scratchColor.lerp(bossThemeColor, 0.85);
  } else {
    const focus = state.focusItem;
    if (focus) {
      const distance = Math.hypot(state.player.x - focus.x, state.player.z - focus.z);
      scratchColor.lerp(new THREE.Color(focus.castle.color), distance <= triggerRadius ? 1 : 0.32);
    }
  }
  state.themeColor.lerp(scratchColor, 0.018);
  scene.background = state.themeColor;
  scene.fog.color.copy(state.themeColor);
}

function updatePlayer(dt) {
  player.position.set(state.player.x, 0, state.player.z);
  player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, state.player.rotation, Math.min(1, dt * 10));
  const bob = Math.sin(clock.elapsedTime * 10) * 0.055 * Math.min(state.player.speed / 8, 1);
  player.position.y = bob;

  const attackProgress = state.attackTimer > 0 ? 1 - state.attackTimer / attackDuration : 0;
  const windup = THREE.MathUtils.smoothstep(attackProgress, 0, 0.24);
  const strike = THREE.MathUtils.smoothstep(attackProgress, 0.16, 0.62);
  const recovery = THREE.MathUtils.smoothstep(attackProgress, 0.64, 1);
  const swing = attackProgress > 0 ? Math.sin(attackProgress * Math.PI) : 0;
  const weaponPivot = player.userData.weaponPivot;
  if (weaponPivot) {
    weaponPivot.visible = state.weapon === "sword";
    const slashArc = THREE.MathUtils.lerp(-1.55, 2.45, strike);
    const returnArc = THREE.MathUtils.lerp(slashArc, -0.5, recovery);
    weaponPivot.rotation.x = THREE.MathUtils.lerp(0.52, -0.34, strike) + recovery * 0.46;
    weaponPivot.rotation.y = THREE.MathUtils.lerp(1.3, -2.8, strike) + recovery * 2.8;
    weaponPivot.rotation.z = -0.62 - windup * 1.15 + returnArc;
    weaponPivot.position.x = 0.58 + windup * 0.28 - strike * 0.78 + recovery * 0.5;
    weaponPivot.position.y = 1.16 + windup * 0.34 - recovery * 0.34;
    weaponPivot.position.z = -0.2 - strike * 0.84 + recovery * 0.84;
    weaponPivot.scale.setScalar(1 + swing * 0.14);
  }

  const bowPivot = player.userData.bowPivot;
  if (bowPivot) {
    bowPivot.visible = state.weapon === "bow";
    const draw = state.weapon === "bow" ? swing : 0;
    bowPivot.rotation.x = 0.18 - draw * 0.12;
    bowPivot.rotation.y = -0.18 + draw * 0.16;
    bowPivot.rotation.z = -0.28 - draw * 0.18;
    bowPivot.position.x = 0.64 - draw * 0.1;
    bowPivot.position.z = -0.3 - draw * 0.12;
    bowPivot.scale.setScalar(1 + draw * 0.05);
    const [, stringTop, stringBottom, nockedArrow] = bowPivot.children;
    if (stringTop && stringBottom && nockedArrow) {
      stringTop.position.x = 0.09 - draw * 0.16;
      stringBottom.position.x = 0.09 - draw * 0.16;
      stringTop.rotation.z = -0.09 - draw * 0.12;
      stringBottom.rotation.z = 0.09 + draw * 0.12;
      nockedArrow.position.z = -0.48 + draw * 0.18;
      nockedArrow.position.x = 0.04 - draw * 0.14;
    }
  }

  const arcPivot = player.userData.arcPivot;
  if (arcPivot) {
    arcPivot.visible = state.weapon === "arc";
    state.arcFlash = Math.max(0, state.arcFlash - dt);
    const flash = state.arcFlash / 0.3;
    arcPivot.rotation.z = -0.35 - swing * 0.5;
    arcPivot.position.z = -0.2 - swing * 0.5;
    player.userData.arcCore.rotation.y += dt * (3 + flash * 20);
    player.userData.arcCore.scale.setScalar(1 + flash * 0.9);
  }
  player.userData.wingMaterial.emissiveIntensity = state.weapon === "arc" ? 1.4 + Math.sin(clock.elapsedTime * 6) * 0.3 : 0.65;

  player.rotation.x = -swing * 0.1;
  player.rotation.z = -swing * 0.08;

  const wings = player.userData.wings || [];
  wings.forEach((wing, index) => {
    wing.rotation.z = (index === 0 ? -0.22 : 0.22) + Math.sin(clock.elapsedTime * 8) * 0.06 * (index === 0 ? -1 : 1);
  });

  const swordFlash = state.weapon === "sword" && state.attackTimer > 0 ? state.attackTimer / attackDuration : 0;
  attackRing.position.set(state.player.x, 0.07, state.player.z);
  attackRing.visible = swordFlash > 0;
  attackRing.material.opacity = swordFlash * 0.75;
  attackRing.scale.setScalar((swordRadius() / attackRadius) * (1 + (1 - swordFlash) * 0.08));

  const shielded = state.invulnTimer > 0 || state.dash.timer > 0;
  shieldBubble.visible = shielded;
  if (shielded) {
    shieldBubble.material.opacity = 0.18 + Math.sin(clock.elapsedTime * 12) * 0.08;
    shieldBubble.scale.setScalar(1 + Math.sin(clock.elapsedTime * 6) * 0.04);
  }
}

function updateCamera(dt) {
  const fight = state.boss.stage === "fight";
  scratchVector.set(state.player.x, fight ? 15.5 : 13.5, state.player.z + (fight ? 20.5 : 18));
  camera.position.lerp(scratchVector, Math.min(1, dt * 4.8));
  scratchVector.set(state.player.x, 1.5, state.player.z - 4);
  camera.lookAt(scratchVector);
}

function animateWorld(dt) {
  const time = clock.elapsedTime;
  for (const object of worldObjects) {
    if (object.isPoints) {
      object.rotation.y += dt * 0.01;
      continue;
    }
    if (object.geometry?.type === "TorusGeometry") object.rotation.z += (object.userData.spin || 0.18) * dt;
    if (object.userData.baseY !== undefined) object.position.y = object.userData.baseY + Math.sin(time * 2.1 + object.position.x) * 0.16;
  }
}

function setCardList(items) {
  cardListNode.replaceChildren(
    ...items.map(({ text, done }) => {
      const li = document.createElement("li");
      li.textContent = text;
      if (done) li.classList.add("is-done");
      return li;
    }),
  );
}

const bossCardLine = "The Fragmenter is every disconnected system a team lives with. This is what Victor gets hired to reconnect.";

function updateHud(force = false) {
  if (!zoneNode || !progressNode || !progressBarNode || !mobsNode || !nodesNode || !healthNode || !healthBarNode || !cardNode || !cardKickerNode || !cardTitleNode || !cardCopyNode || !cardListNode) return;
  const item = castleObjects[state.unlockedIndex] || null;
  const fight = state.boss.stage === "fight";
  const mobsLeft = fight ? targetMobs().filter((mob) => !mob.userData.isBoss).length : item ? activeMobsForCastle(item.index).length : 0;
  const nodesLeft = item ? remainingNodes(item.index) : 0;
  const focus = state.focusItem;
  const inForecourt = Boolean(item && focus === item);
  const toastVisible = state.phase !== "intro" && Boolean(state.message) && clock.elapsedTime - state.messageAt < toastDuration;
  const dashTotal = dashCooldownTotal();
  const dashFraction = state.abilities.dash ? 1 - Math.min(1, state.dash.cooldown / Math.max(0.01, dashTotal)) : 0;
  const dashBucket = state.abilities.dash ? Math.round(dashFraction * 10) : -1;
  const signature = [
    state.phase,
    state.unlockedIndex,
    mobsLeft,
    nodesLeft,
    Math.round(state.playerHealth),
    Math.round(state.perks.maxHealth),
    visited.size,
    focus ? focus.index : -1,
    focus?.discovered ? 1 : 0,
    inForecourt ? 1 : 0,
    toastVisible ? state.message : "",
    state.completed ? 1 : 0,
    state.collected.length,
    state.weapon,
    dashBucket,
    state.boss.stage,
    Math.round(state.boss.hp * 2),
    state.kills,
  ].join("|");
  if (!force && signature === state.lastHudId) return;
  state.lastHudId = signature;

  let zone = "Vic's Quest";
  if (state.phase === "ending" || state.completed) zone = "World reconnected";
  else if (state.phase === "discovery") zone = "Choose your upgrade";
  else if (state.phase === "cv") zone = "Your CV";
  else if (state.phase === "play") {
    if (state.boss.stage === "approach") zone = "Road to the Fragmenter";
    else if (state.boss.stage === "fight") zone = fragmentsAlive() > 0 ? "Break the fragments" : "Strike the core";
    else if (state.boss.stage === "defeated") zone = "World reconnected";
    else if (!item) zone = "All castles unlocked";
    else if (objectiveComplete(item.index)) zone = "Gate open. Walk inside.";
    else if (inForecourt) zone = item.castle.objective.label;
    else zone = `Road to ${item.castle.shortTitle}`;
  }
  zoneNode.textContent = zone;
  mobsNode.textContent = String(mobsLeft);
  nodesNode.textContent = String(nodesLeft);
  healthNode.textContent = String(Math.round(state.playerHealth));
  healthBarNode.style.width = `${(state.playerHealth / state.perks.maxHealth) * 100}%`;
  healthTrackNode?.classList.toggle("is-low", state.playerHealth / state.perks.maxHealth < 0.4);
  progressNode.textContent = `CV ${state.collected.length}/${castles.length}`;
  progressBarNode.style.width = `${(visited.size / castles.length) * 100}%`;
  if (toastNode) {
    toastNode.textContent = state.message;
    toastNode.classList.toggle("is-hidden", !toastVisible);
  }
  if (stageNode) stageNode.dataset.dash = state.abilities.dash ? "true" : "false";
  if (dashChipNode) {
    dashChipNode.classList.toggle("is-hidden", !state.abilities.dash);
    dashChipNode.classList.toggle("is-ready", state.abilities.dash && state.dash.cooldown <= 0);
    if (dashFillNode) dashFillNode.style.transform = `scaleX(${dashFraction.toFixed(2)})`;
  }
  document.querySelectorAll('[data-game-tap="Dash"]').forEach((button) => {
    button.classList.toggle("is-cooling", state.abilities.dash && state.dash.cooldown > 0);
    button.style.setProperty("--cd", (dashBucket / 10).toFixed(1));
  });
  if (bossNode) {
    const showBoss = state.boss.stage === "fight" || state.boss.stage === "defeated";
    bossNode.classList.toggle("is-hidden", !showBoss);
    if (bossFillNode) bossFillNode.style.width = `${Math.max(0, (state.boss.hp / state.boss.maxHp) * 100)}%`;
    if (bossTextNode) {
      const armoured = state.boss.stage === "fight" && fragmentsAlive() > 0;
      bossTextNode.textContent = state.perks.showNumbers
        ? `${Math.max(0, state.boss.hp).toFixed(1).replace(/\.0$/, "")} / ${state.boss.maxHp}${armoured ? " · armoured" : ""}`
        : armoured
          ? "Armoured by fragments"
          : "";
    }
  }

  const bossStage = state.boss.stage === "approach" || state.boss.stage === "fight";
  const showCard = state.phase === "play" && (Boolean(focus) || bossStage) && state.boss.stage !== "defeated";
  cardNode.classList.toggle("is-hidden", !showCard);
  if (!showCard) return;

  if (bossStage) {
    cardNode.style.setProperty("--castle-color", "#c084fc");
    cardKickerNode.textContent = state.boss.stage === "approach" ? "Final chapter" : "Boss";
    cardTitleNode.textContent = "The Fragmenter";
    cardCopyNode.textContent = bossCardLine;
    setCardList(
      state.boss.stage === "approach"
        ? [{ text: "Follow the road past the last castle" }, { text: "Two hearts wait before the arena" }]
        : [
            { text: fragmentsAlive() > 0 ? `${fragmentsAlive()} fragments shield the core` : "Core exposed", done: fragmentsAlive() === 0 },
            { text: state.abilities.dash ? "Dash out of the slam ring" : "Step out of the slam ring" },
          ],
    );
    return;
  }

  const castle = focus.castle;
  cardNode.style.setProperty("--castle-color", castle.color);
  if (focus.discovered) {
    const entry = state.collected.find((collected) => collected.castleId === castle.id);
    const artifact = entry ? castle.artifacts.find((candidate) => candidate.id === entry.artifactId) : null;
    cardKickerNode.textContent = `Chapter ${castle.chapter} · Reconnected`;
    cardTitleNode.textContent = artifact ? `Upgrade: ${artifact.upgrade.name}` : castle.shortTitle;
    cardCopyNode.textContent = artifact ? `${artifact.title}. ${artifact.fact}` : castle.intro;
    setCardList([
      { text: artifact ? artifact.upgrade.effect : "Upgrade equipped", done: true },
      { text: `${visited.size} of ${castles.length} chapters` },
    ]);
    return;
  }

  const done = objectiveComplete(focus.index);
  const noun = castle.objective.noun;
  cardKickerNode.textContent = `Chapter ${castle.chapter}`;
  cardTitleNode.textContent = done ? "The gate is open" : castle.objective.label;
  cardCopyNode.textContent = castle.intro;
  setCardList([
    { text: mobsLeft > 0 ? `${mobsLeft} ${pluralize("mob", mobsLeft)} left` : "Mobs cleared", done: mobsLeft === 0 },
    {
      text: nodesLeft > 0 ? `${nodesLeft} ${pluralize(noun, nodesLeft)} left` : `${capitalize(pluralize(noun, 2))} collected`,
      done: nodesLeft === 0,
    },
    { text: done ? "Walk inside to choose an upgrade" : "Open the gate", done: false },
  ]);
}

const weaponLabels = { sword: "Sword", bow: "Bow", arc: "Graph Arc" };

function updateWeaponUi() {
  const label = weaponLabels[state.weapon] || "Sword";
  weaponNodes.forEach((node) => {
    node.textContent = label;
  });
  document.querySelectorAll('[data-game-tap="Weapon"]').forEach((button) => {
    button.textContent = state.weapon === "arc" ? "ARC" : label.toUpperCase();
  });
}

function updateAbilityUi() {
  if (dashHintNode) dashHintNode.textContent = state.abilities.dash ? "" : "(unlocks after castle 1)";
  if (stageNode) stageNode.dataset.dash = state.abilities.dash ? "true" : "false";
  updateHud(true);
}

function switchWeapon() {
  const index = state.weapons.indexOf(state.weapon);
  state.weapon = state.weapons[(index + 1) % state.weapons.length];
  state.attackCooldown = Math.min(state.attackCooldown, 0.12);
  setMessage(`${weaponLabels[state.weapon]} ready.`);
  updateWeaponUi();
  updateHud(true);
}

// Perks are always rebuilt from the collected upgrades so re-choosing inside a
// discovery panel never double-applies anything.
function recomputePerks(options = {}) {
  const perks = basePerks();
  state.collected.forEach((entry) => {
    const found = findArtifact(entry);
    if (found?.artifact.upgrade?.perks) applyPerkDeltas(perks, found.artifact.upgrade.perks);
  });
  state.perks = perks;
  if (options.healFull) state.playerHealth = perks.maxHealth;
  if (options.healNow) heal(options.healNow, { silent: true });
  state.playerHealth = Math.min(state.playerHealth, perks.maxHealth);
  syncCompanions();
}

function grantCoreUnlock(castleIndex) {
  const unlock = coreUnlocks[castleIndex];
  if (!unlock) return null;
  if (unlock.id === "dash") state.abilities.dash = true;
  if (unlock.id === "arc") {
    state.abilities.arc = true;
    if (!state.weapons.includes("arc")) state.weapons.push("arc");
  }
  updateAbilityUi();
  return unlock;
}

function startGame() {
  if (state.phase !== "intro") return;
  hidePanel(introNode);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  setPhase("play");
  state.run.startedAt = clock.elapsedTime;
  state.run.lastInputAt = clock.elapsedTime;
  setMessage("Follow the road. Clear the forecourt of the first castle.");
  updateHud(true);
}

function openDiscovery(item) {
  if (!discoveryNode || !discoveryChoicesNode) {
    item.discovered = true;
    visited.add(item.castle.id);
    state.unlockedIndex = Math.max(state.unlockedIndex, item.index + 1);
    return;
  }
  keys.clear();
  releaseJoystick();
  state.attackHeld = false;
  state.player.vx = 0;
  state.player.vz = 0;
  state.dash.timer = 0;
  state.discovery = { index: item.index, chosen: null };
  setPhase("discovery");
  const castle = item.castle;
  discoveryNode.style.setProperty("--castle-color", castle.color);
  discoveryKickerNode.textContent = `Chapter ${castle.chapter} · ${castle.shortTitle}`;
  discoveryTitleNode.textContent = "Choose your upgrade";
  discoveryIntroNode.textContent = castle.prompt;
  discoveryChoicesNode.replaceChildren(
    ...castle.artifacts.map((artifact, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "artifact-choice";
      button.dataset.artifactIndex = String(index);
      const key = document.createElement("kbd");
      key.textContent = String(index + 1);
      const lane = document.createElement("em");
      lane.className = "artifact-lane";
      lane.textContent = artifact.upgrade.lane;
      const title = document.createElement("b");
      title.textContent = artifact.upgrade.name;
      const teaser = document.createElement("span");
      teaser.textContent = artifact.upgrade.effect;
      const cv = document.createElement("small");
      cv.textContent = `Real life: ${artifact.fact}`;
      button.append(key, lane, title, teaser, cv);
      button.addEventListener("click", () => chooseArtifact(index));
      return button;
    }),
  );
  discoveryRevealNode.classList.add("is-hidden");
  showPanel(discoveryNode);
  window.setTimeout(() => {
    if (state.phase === "discovery") discoveryChoicesNode.querySelector("button")?.focus({ preventScroll: true });
  }, 40);
  updateHud(true);
}

function chooseArtifact(index) {
  if (state.phase !== "discovery") return;
  const item = castleObjects[state.discovery.index];
  const artifact = item?.castle.artifacts[index];
  if (!artifact) return;
  const alreadyChosen = state.discovery.chosen === index;
  state.discovery.chosen = index;
  state.collected = state.collected.filter((entry) => entry.castleId !== item.castle.id);
  state.collected.push({ castleId: item.castle.id, artifactId: artifact.id });
  recomputePerks({ healFull: Boolean(artifact.upgrade.healFull), healNow: artifact.upgrade.healNow || 0 });
  discoveryChoicesNode.querySelectorAll("button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-selected", buttonIndex === index);
  });
  if (revealLaneNode) revealLaneNode.textContent = artifact.upgrade.lane;
  revealTitleNode.textContent = artifact.upgrade.name;
  revealGameNode.textContent = artifact.upgrade.effect;
  revealRealNode.textContent = `${artifact.title}. ${artifact.example}`;
  revealLinkNode.textContent = artifact.link.label;
  revealLinkNode.href = artifact.link.href;
  const unlock = coreUnlocks[item.index];
  if (revealUnlockNode) {
    revealUnlockNode.classList.toggle("is-hidden", !unlock);
    if (unlock) {
      revealUnlockTitleNode.textContent = `${unlock.name} (${unlock.kind})`;
      revealUnlockCopyNode.textContent = `${unlock.effect} ${unlock.control}. ${unlock.cv}`;
    }
  }
  discoveryContinueNode.textContent = item.index === castles.length - 1 ? "Face the Fragmenter" : "Continue the quest";
  discoveryRevealNode.classList.remove("is-hidden");
  discoveryContinueNode.focus();
  discoveryRevealNode.scrollIntoView?.({ block: "nearest" });
  if (!alreadyChosen) {
    spawnBurst(item.x, 2.6, item.z, item.castle.color, 12, { speed: 2.8, lift: 3.4, life: 0.8 });
    vibrate(25);
  }
}

function moveChoiceFocus(direction) {
  const buttons = [...discoveryChoicesNode.querySelectorAll("button")];
  if (!buttons.length) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + buttons.length) % buttons.length;
  buttons[nextIndex].focus({ preventScroll: true });
}

function continueDiscovery() {
  if (state.phase !== "discovery" || state.discovery.chosen === null) return;
  const item = castleObjects[state.discovery.index];
  if (!item) return;
  item.discovered = true;
  visited.add(item.castle.id);
  state.unlockedIndex = Math.max(state.unlockedIndex, item.index + 1);
  hidePanel(discoveryNode);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  spawnRingPulse(item.x, item.z, item.castle.color, 6, 0.9);
  const unlock = grantCoreUnlock(item.index);
  if (state.perks.checkpointShield > 0) state.invulnTimer = Math.max(state.invulnTimer, state.perks.checkpointShield);
  setPhase("play");
  state.run.lastInputAt = clock.elapsedTime;
  if (item.index === castles.length - 1) {
    state.boss.stage = "approach";
    setMessage("Something waits at the end of the road. Two hearts first.");
    updateHud(true);
    return;
  }
  const next = castles[state.unlockedIndex];
  if (unlock) {
    setMessage(`${unlock.name} ready. ${unlock.control}. Leave through the back gate.`);
  } else if (next) {
    setMessage(`${item.castle.shortTitle} reconnected. Next: ${next.shortTitle} (${next.artifacts.map((artifact) => artifact.project).join(", ")}).`);
  }
  updateHud(true);
}

function findArtifact(entry) {
  const castle = castles.find((candidate) => candidate.id === entry.castleId);
  const artifact = castle?.artifacts.find((candidate) => candidate.id === entry.artifactId);
  return castle && artifact ? { castle, artifact } : null;
}

function rankedTags() {
  const counts = new Map();
  state.collected.forEach((entry, order) => {
    const found = findArtifact(entry);
    if (!found) return;
    const current = counts.get(found.artifact.tag) || { count: 0, order };
    counts.set(found.artifact.tag, { count: current.count + 1, order: current.order });
  });
  return [...counts.entries()].sort((a, b) => b[1].count - a[1].count || a[1].order - b[1].order).map(([tag]) => tag);
}

function buildSummary() {
  const ranked = rankedTags();
  const first = tagCopy[ranked[0]];
  const second = tagCopy[ranked[1]];
  if (!first) return "You crossed every castle. Head back to the main site to explore the full portfolio.";
  return `${first.line}${second ? ` ${second.line}` : ""} Your build points to ${first.fit}${second ? ` and ${second.fit}` : ""}. Start the conversation there.`;
}

function doesLines() {
  const ranked = rankedTags();
  const chosen = ranked.slice(0, 3).map((tag) => tagCopy[tag].does);
  const fallback = ["infra", "commerce", "product"].map((tag) => tagCopy[tag].does);
  fallback.forEach((line) => {
    if (chosen.length < 3 && !chosen.includes(line)) chosen.push(line);
  });
  return chosen;
}

function renderBuildEntry(found, withLink) {
  const li = document.createElement("li");
  li.style.setProperty("--castle-color", found.castle.color);
  const lane = document.createElement("em");
  lane.className = "artifact-lane";
  lane.textContent = found.artifact.upgrade.lane;
  const title = document.createElement("b");
  title.textContent = found.artifact.upgrade.name;
  li.append(lane, title, document.createTextNode(found.artifact.upgrade.effect + " "));
  const meta = document.createElement("span");
  meta.textContent = `${found.artifact.title}: ${found.artifact.fact}`;
  li.append(meta);
  if (withLink) {
    const link = document.createElement("a");
    link.href = found.artifact.link.href;
    link.textContent = found.artifact.link.label;
    link.target = "_blank";
    link.rel = "noopener";
    li.append(link);
  }
  return li;
}

function renderAbilityList(node) {
  if (!node) return;
  node.replaceChildren(
    ...[
      { unlock: coreUnlocks[0], owned: state.abilities.dash, lockedText: "Unlocks after the first castle." },
      { unlock: coreUnlocks[1], owned: state.abilities.arc, lockedText: "Unlocks after the second castle." },
    ].map(({ unlock, owned, lockedText }) => {
      const li = document.createElement("li");
      if (!owned) li.classList.add("is-empty");
      const title = document.createElement("b");
      title.textContent = owned ? unlock.name : `${unlock.name} (locked)`;
      li.append(title, document.createTextNode(owned ? `${unlock.effect} ${unlock.control}. ` : `${lockedText} `));
      const meta = document.createElement("span");
      meta.textContent = unlock.cv;
      li.append(meta);
      return li;
    }),
  );
}

function renderUpgradeList(node, withLink) {
  if (!node) return;
  const entries = state.collected.map(findArtifact).filter(Boolean);
  if (entries.length) {
    node.replaceChildren(...entries.map((found) => renderBuildEntry(found, withLink)));
  } else {
    const li = document.createElement("li");
    li.className = "is-empty";
    li.textContent = "No upgrades yet. Clear the first castle and pick one of three real projects.";
    node.replaceChildren(li);
  }
}

function openCv() {
  if (state.phase !== "play" || !cvNode) return;
  keys.clear();
  releaseJoystick();
  state.attackHeld = false;
  setPhase("cv");
  renderAbilityList(cvAbilitiesNode);
  renderUpgradeList(cvUpgradesNode, true);
  if (cvStackNode) {
    const stacks = state.perks.killStack > 0 ? Math.min(state.perks.killStackCap, state.kills * state.perks.killStack) : 0;
    cvStackNode.textContent = stacks > 0 ? `Self-Improving: +${Math.round(stacks * 100)}% damage from ${state.kills} kills.` : "";
    cvStackNode.hidden = stacks <= 0;
  }
  if (cvSkipNode) cvSkipNode.hidden = !(visited.size === castles.length && !state.completed);
  if (cvResetConfirmNode) cvResetConfirmNode.hidden = true;
  if (cvResetNode) cvResetNode.hidden = false;
  showPanel(cvNode);
  document.querySelectorAll("[data-game-open-cv]").forEach((button) => button.setAttribute("aria-expanded", "true"));
  window.setTimeout(() => {
    if (state.phase === "cv") cvNode.querySelector("[data-cv-close]")?.focus({ preventScroll: true });
  }, 40);
  updateHud(true);
}

function closeCv() {
  if (state.phase !== "cv") return;
  hidePanel(cvNode);
  document.querySelectorAll("[data-game-open-cv]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  setPhase("play");
  state.run.lastInputAt = clock.elapsedTime;
  updateHud(true);
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function openEnding() {
  keys.clear();
  releaseJoystick();
  state.attackHeld = false;
  hidePanel(cvNode);
  setPhase("ending");
  if (endingSummaryNode) endingSummaryNode.textContent = buildSummary();
  if (endingStatsNode) {
    endingStatsNode.textContent = `${formatDuration(clock.elapsedTime - state.run.startedAt)} played · ${state.deaths} ${pluralize("fall", state.deaths)} · ${state.collected.length}/${castles.length} upgrades${state.boss.stage === "defeated" ? " · Fragmenter defeated" : ""}`;
  }
  if (endingDoesNode) {
    endingDoesNode.replaceChildren(
      ...doesLines().map((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        return li;
      }),
    );
  }
  if (endingArtifactsNode) {
    const entries = state.collected.map(findArtifact).filter(Boolean);
    endingArtifactsNode.replaceChildren(
      ...entries.map((found) => {
        const li = document.createElement("li");
        li.style.setProperty("--castle-color", found.castle.color);
        const lane = document.createElement("em");
        lane.className = "artifact-lane";
        lane.textContent = found.artifact.upgrade.lane;
        const title = document.createElement("strong");
        title.textContent = found.artifact.upgrade.name;
        const chapter = document.createElement("span");
        chapter.textContent = `${found.artifact.title} · ${found.artifact.fact}`;
        const link = document.createElement("a");
        link.href = found.artifact.link.href;
        link.textContent = found.artifact.link.label;
        link.target = "_blank";
        link.rel = "noopener";
        li.append(lane, title, chapter, link);
        return li;
      }),
    );
  }
  renderAbilityList(endingAbilitiesNode);
  showPanel(endingNode);
  window.setTimeout(() => {
    if (state.phase === "ending") endingNode?.querySelector("a, button")?.focus({ preventScroll: true });
  }, 40);
  updateHud(true);
}

function render() {
  renderer.setClearColor(state.themeColor, 1);
  renderer.render(scene, camera);
}

function tick() {
  const dt = Math.min(0.033, clock.getDelta());
  update(dt);
  render();
  requestAnimationFrame(tick);
}

function isTouchLayout() {
  return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
}

function enterMobileFullscreen() {
  if (!isTouchLayout() || document.fullscreenElement) return;
  document.documentElement.requestFullscreen?.().catch(() => {});
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
}

// Keyboard: WASD/arrows move, Space/E attack, Shift dash, Q weapon, Tab CV,
// R reset, F fullscreen, 1-3 pick an upgrade while a discovery panel is open.
window.addEventListener("keydown", (event) => {
  const key = event.key;
  if (event.repeat && !movementKeys.has(key)) return;
  markInput();
  if (key === "f" || key === "F") {
    toggleFullscreen();
    return;
  }

  if (state.phase === "intro") {
    if (movementKeys.has(key) || key === " " || key === "Enter" || key === "e" || key === "E") {
      if ((key === " " || key === "Enter") && introNode?.contains(document.activeElement)) return;
      if (key === " " || movementKeys.has(key)) event.preventDefault();
      startGame();
      if (movementKeys.has(key)) keys.add(key);
    }
    return;
  }

  if (state.phase === "discovery") {
    if (key === "1" || key === "2" || key === "3") {
      chooseArtifact(Number(key) - 1);
      return;
    }
    if (
      (key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown") &&
      document.activeElement?.classList.contains("artifact-choice")
    ) {
      event.preventDefault();
      moveChoiceFocus(key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1);
      return;
    }
    if (key === " " || key === "Enter") {
      if (discoveryNode?.contains(document.activeElement)) return;
      event.preventDefault();
      continueDiscovery();
      return;
    }
    if (key === "r" || key === "R") resetGame();
    return;
  }

  if (state.phase === "cv") {
    if (key === "Tab" || key === "Escape") {
      event.preventDefault();
      closeCv();
      return;
    }
    return;
  }

  if (state.phase === "ending") {
    if (key === "r" || key === "R") resetGame();
    return;
  }

  if (key === "Tab") {
    event.preventDefault();
    openCv();
    return;
  }
  if (key === "Shift") {
    event.preventDefault();
    startDash();
    return;
  }
  if (key === " " || key === "Space" || key === "e" || key === "E") {
    event.preventDefault();
    attack();
    return;
  }
  if (key === "r" || key === "R") {
    resetGame();
    return;
  }
  if (key === "q" || key === "Q") {
    switchWeapon();
    return;
  }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(key)) event.preventDefault();
  keys.add(key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

window.addEventListener("blur", () => {
  keys.clear();
  state.attackHeld = false;
  releaseJoystick();
});

function setJoystickFromEvent(event) {
  const joystick = state.joystick;
  const dx = event.clientX - joystick.centerX;
  const dy = event.clientY - joystick.centerY;
  const length = Math.hypot(dx, dy);
  const capped = Math.min(length, joystick.radius);
  const deadzone = 0.14;
  const raw = joystick.radius > 0 ? capped / joystick.radius : 0;
  joystick.magnitude = raw <= deadzone ? 0 : Math.min(1, (raw - deadzone) / (1 - deadzone));
  if (length > 0) {
    joystick.x = dx / length;
    joystick.y = dy / length;
  } else {
    joystick.x = 0;
    joystick.y = 0;
  }
  const knobX = length > 0 ? (dx / length) * capped : 0;
  const knobY = length > 0 ? (dy / length) * capped : 0;
  if (joystickKnobNode) joystickKnobNode.style.transform = `translate(${knobX.toFixed(1)}px, ${knobY.toFixed(1)}px)`;
}

function releaseJoystick() {
  const joystick = state.joystick;
  joystick.active = false;
  joystick.pointerId = null;
  joystick.x = 0;
  joystick.y = 0;
  joystick.magnitude = 0;
  if (joystickKnobNode) joystickKnobNode.style.transform = "translate(0px, 0px)";
  joystickNode?.classList.remove("is-active");
}

function measureJoystick() {
  const rect = joystickNode.getBoundingClientRect();
  state.joystick.centerX = rect.left + rect.width / 2;
  state.joystick.centerY = rect.top + rect.height / 2;
  state.joystick.radius = Math.max(24, rect.width / 2 - joystickKnobNode.offsetWidth / 2);
}

if (joystickNode && joystickKnobNode) {
  joystickNode.addEventListener("pointerdown", (event) => {
    if (state.joystick.active) return;
    event.preventDefault();
    markInput();
    enterMobileFullscreen();
    if (state.phase === "intro") startGame();
    if (state.phase !== "play") return;
    const joystick = state.joystick;
    joystick.active = true;
    joystick.pointerId = event.pointerId;
    measureJoystick();
    try {
      joystickNode.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is best-effort on touch devices.
    }
    joystickNode.classList.add("is-active");
    setJoystickFromEvent(event);
  });
  joystickNode.addEventListener("pointermove", (event) => {
    if (!state.joystick.active || event.pointerId !== state.joystick.pointerId) return;
    event.preventDefault();
    markInput();
    measureJoystick();
    setJoystickFromEvent(event);
  });
  document.addEventListener("fullscreenchange", () => releaseJoystick());
  window.addEventListener("resize", () => releaseJoystick());
  const endJoystick = (event) => {
    if (!state.joystick.active || event.pointerId !== state.joystick.pointerId) return;
    event.preventDefault();
    try {
      joystickNode.releasePointerCapture(event.pointerId);
    } catch {
      // Some browsers release capture automatically.
    }
    releaseJoystick();
  };
  joystickNode.addEventListener("pointerup", endJoystick);
  joystickNode.addEventListener("pointercancel", endJoystick);
  joystickNode.addEventListener("lostpointercapture", () => releaseJoystick());
  joystickNode.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("fullscreenchange", () => releaseJoystick());
  window.addEventListener("resize", () => releaseJoystick());
}

function handleTap(action) {
  markInput();
  if (action === "Attack") {
    if (state.phase === "intro") startGame();
    else attack();
  } else if (action === "Weapon") {
    switchWeapon();
  } else if (action === "Dash") {
    if (state.phase === "intro") startGame();
    else if (!state.abilities.dash) setMessage("Dash unlocks after the first castle.");
    else startDash();
  }
}

for (const button of document.querySelectorAll("[data-game-tap]")) {
  const action = button.dataset.gameTap;
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.dataset.ignoreClick = "true";
    enterMobileFullscreen();
    handleTap(action);
    if (action === "Attack" && state.phase === "play") state.attackHeld = true;
    button.classList.add("is-pressed");
  });
  const release = (event) => {
    if (event?.preventDefault) event.preventDefault();
    if (action === "Attack") state.attackHeld = false;
    button.classList.remove("is-pressed");
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (button.dataset.ignoreClick === "true") {
      delete button.dataset.ignoreClick;
      return;
    }
    handleTap(action);
  });
}

document.querySelectorAll("[data-game-start]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    markInput();
    enterMobileFullscreen();
    startGame();
  });
});

document.querySelectorAll("[data-game-restart]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    resetGame();
  });
});

document.querySelectorAll("[data-game-open-cv]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    markInput();
    if (state.phase === "cv") closeCv();
    else if (state.phase === "intro") {
      startGame();
      openCv();
    } else openCv();
  });
});

document.querySelectorAll("[data-cv-close]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    closeCv();
  });
});

cvSkipNode?.addEventListener("click", (event) => {
  event.preventDefault();
  if (state.phase !== "cv") return;
  state.completed = true;
  openEnding();
});

cvResetNode?.addEventListener("click", (event) => {
  event.preventDefault();
  if (cvResetConfirmNode) {
    cvResetConfirmNode.hidden = false;
    cvResetNode.hidden = true;
    cvResetConfirmNode.focus({ preventScroll: true });
  } else {
    resetGame();
  }
});

cvResetConfirmNode?.addEventListener("click", (event) => {
  event.preventDefault();
  resetGame();
});

discoveryContinueNode?.addEventListener("click", (event) => {
  event.preventDefault();
  continueDiscovery();
});

document.addEventListener("selectstart", (event) => {
  if (event.target.closest?.(".touch-controls")) event.preventDefault();
});

// Debug and automation hooks.
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(1 / 60);
  render();
};

window.render_game_to_text = () => {
  const current = castleObjects[state.unlockedIndex];
  const targets = targetMobs();
  return JSON.stringify({
    renderer: "threejs",
    mode: "linear-castle-quest",
    phase: state.phase,
    active: state.activeCastle?.id || "hub",
    unlockedIndex: state.unlockedIndex,
    completed: state.completed,
    activeMobCount: targets.length,
    remainingNodes: current ? remainingNodes(current.index) : 0,
    gateProgress: current ? Number(current.gateProgress.toFixed(2)) : 1,
    mobs: targets.map((mob) => ({
      type: mob.userData.type,
      hp: Number(mob.userData.hp.toFixed(2)),
      x: Number(mob.position.x.toFixed(2)),
      z: Number(mob.position.z.toFixed(2)),
      boss: Boolean(mob.userData.isBoss),
      fragment: Boolean(mob.userData.isFragment),
      elite: Boolean(mob.userData.elite),
    })),
    nodes: current
      ? current.nodes
          .filter((node) => node.userData.active)
          .map((node) => ({ x: Number(node.position.x.toFixed(2)), z: Number(node.position.z.toFixed(2)) }))
      : [],
    playerHealth: Math.round(state.playerHealth),
    maxHealth: state.perks.maxHealth,
    weapon: state.weapon,
    weapons: [...state.weapons],
    abilities: { ...state.abilities },
    dash: { cooldown: Number(state.dash.cooldown.toFixed(2)), active: state.dash.timer > 0 },
    perks: { ...state.perks },
    kills: state.kills,
    deaths: state.deaths,
    attackHeld: state.attackHeld,
    packs: castles.map((castle, index) => activeMobsForCastle(index).map((mob) => `${mob.userData.elite ? "E:" : ""}${mob.userData.type}`)),
    companions: companions.length,
    boss: { stage: state.boss.stage, hp: Number(state.boss.hp.toFixed(1)), maxHp: state.boss.maxHp, fragments: fragmentsAlive(), minionWave: state.boss.minionWave },
    projectileCount: projectiles.length,
    enemyProjectileCount: enemyProjectiles.length,
    particleCount: particles.length,
    player: {
      x: Number(state.player.x.toFixed(2)),
      z: Number(state.player.z.toFixed(2)),
    },
    joystick: { active: state.joystick.active, magnitude: Number(state.joystick.magnitude.toFixed(2)) },
    collected: state.collected.map((entry) => entry.artifactId),
    castleColliders: buildingColliders.length,
    pickupCount: pickups.length,
    visitedCount: visited.size,
    visitedIds: [...visited],
    castleCount: castles.length,
    message: state.message,
    canvas: {
      width: canvas.width,
      height: canvas.height,
    },
  });
};

buildWorld();
resize();
updateWeaponUi();
updateAbilityUi();
syncCompanions();
updateHud(true);
hidePanel(discoveryNode);
hidePanel(cvNode);
hidePanel(endingNode);
window.addEventListener("resize", resize);
render();
requestAnimationFrame(tick);
