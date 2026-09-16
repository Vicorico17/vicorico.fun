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
const weaponNodes = document.querySelectorAll("[data-game-weapon]");
const toastNode = document.querySelector("[data-game-toast]");
const cardNode = document.querySelector("[data-game-card]");
const cardKickerNode = document.querySelector("[data-game-card-kicker]");
const cardTitleNode = document.querySelector("[data-game-card-title]");
const cardCopyNode = document.querySelector("[data-game-card-copy]");
const cardListNode = document.querySelector("[data-game-card-list]");
const introNode = document.querySelector("[data-game-intro]");
const discoveryNode = document.querySelector("[data-game-discovery]");
const discoveryKickerNode = document.querySelector("[data-discovery-kicker]");
const discoveryTitleNode = document.querySelector("[data-discovery-title]");
const discoveryIntroNode = document.querySelector("[data-discovery-intro]");
const discoveryChoicesNode = document.querySelector("[data-discovery-choices]");
const discoveryRevealNode = document.querySelector("[data-discovery-reveal]");
const revealTitleNode = document.querySelector("[data-reveal-title]");
const revealCopyNode = document.querySelector("[data-reveal-copy]");
const revealLinkNode = document.querySelector("[data-reveal-link]");
const discoveryContinueNode = document.querySelector("[data-discovery-continue]");
const endingNode = document.querySelector("[data-game-ending]");
const endingSummaryNode = document.querySelector("[data-ending-summary]");
const endingArtifactsNode = document.querySelector("[data-ending-artifacts]");
const joystickNode = document.querySelector("[data-game-joystick]");
const joystickKnobNode = document.querySelector("[data-game-joystick-knob]");
const keys = new Set();
const movementKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"]);

// Every castle is one chapter of the portfolio. The objective is the lightweight,
// subject-flavoured task in the forecourt; the artifacts are the three real-world
// choices offered inside the castle. Each artifact links to a project or a section
// of the main site and carries a tag that shapes the personalised ending.
const castles = [
  {
    id: "ai",
    chapter: 1,
    title: "AI Systems Castle",
    shortTitle: "AI Systems",
    color: "#f4bf45",
    position: [0, -24],
    intro: "The first gate hums with ideas. Here AI becomes useful work: deployed models, private data, and agents with real jobs.",
    prompt: "Three ways AI became useful work here. Pick one to inspect.",
    objective: { label: "Reconnect the model nodes", noun: "node", done: "Model nodes reconnected." },
    nodeShape: "octahedron",
    nodeLayout: "spread",
    trait: "antenna",
    artifacts: [
      {
        id: "model-deployment",
        title: "Model Deployment",
        teaser: "GPUs, containers, private endpoints",
        tag: "infra",
        example:
          "Provisioned GPU VPS machines, mounted GPUs into containers, ran Kubernetes pods, and served LLMs and image models behind private inference endpoints with auth layers.",
        link: { label: "Read the AI systems chapter", href: "index.html#story-ai" },
      },
      {
        id: "private-ai",
        title: "Private AI",
        teaser: "Local-first models over company knowledge",
        tag: "infra",
        example:
          "Neo Labs is a local company operating system for running a venture studio: a portfolio dashboard, agent workflows, and portable, versioned company state that stays on your own machine.",
        link: { label: "Open Neo Labs on GitHub", href: "https://github.com/Vicorico17/neo-labs" },
      },
      {
        id: "agent-workflows",
        title: "Agent Workflows",
        teaser: "MCP tools and agents managing agents",
        tag: "agents",
        example:
          "Masscall turns natural-language requests into coordinated work across calendars, email, Slack, and Notion, with MCP servers giving agents controlled access to tools.",
        link: { label: "Open Masscall", href: "https://masscall.vercel.app" },
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
    prompt: "Three workflows that got a smarter next move. Pick one to inspect.",
    objective: { label: "Repair the broken workflow", noun: "step", done: "Workflow repaired." },
    nodeShape: "gear",
    nodeLayout: "spread",
    trait: "gear",
    artifacts: [
      {
        id: "lead-enrichment",
        title: "Lead Enrichment",
        teaser: "Research, score, and route leads",
        tag: "revops",
        example:
          "AClienti is an evidence-backed research desk that turns recent public customer signals into ranked opportunities and practical content direction, the research step that runs before any outreach.",
        link: { label: "Open AClienti on GitHub", href: "https://github.com/Vicorico17/ACLIENTI" },
      },
      {
        id: "distribution-pipeline",
        title: "Distribution Pipeline",
        teaser: "One source asset, every platform",
        tag: "creative",
        example:
          "DistroNow turns a website into a brand profile and then into social content: Firecrawl extraction, Supabase storage, and generation wired into one distribution workflow.",
        link: { label: "Open DistroNow", href: "https://distronow.vercel.app" },
      },
      {
        id: "self-improving-loop",
        title: "Self-Improving Loop",
        teaser: "Agents that fix their own tests",
        tag: "agents",
        example:
          "Eval-driven loops where agents fix their own tests, run CI/CD, and orchestrate work across repos, with review gates, confidence checks, and monitoring for failed jobs.",
        link: { label: "Read about agent orchestration", href: "index.html#story-ai" },
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
    prompt: "Three rails built through the cycles. Pick one to inspect.",
    objective: { label: "Unlock the transaction path", noun: "key", done: "Transaction path unlocked." },
    nodeShape: "diamond",
    nodeLayout: "spread",
    trait: "diamond",
    artifacts: [
      {
        id: "community-coin",
        title: "Community Coin",
        teaser: "$GONE on Polygon",
        tag: "community",
        example:
          "$GONE became the biggest community coin on Polygon, reaching a $10M market cap and more than 20k holders, alongside $200K+ community fundraising and a $50K Polygon grant.",
        link: { label: "Read the crypto chapter", href: "index.html#story-crypto" },
      },
      {
        id: "prediction-market",
        title: "Prediction Market",
        teaser: "LMSR pricing, shares, settlement",
        tag: "markets",
        example:
          "BJJ Predict is a free-play prediction market built on Smoothcomp-style event data with winner shares, LMSR pricing, and leaderboards. Marketz.ro applies the same mechanics to Romanian markets.",
        link: { label: "Open BJJ Predict", href: "https://bjj-predict.vercel.app" },
      },
      {
        id: "agent-payments",
        title: "Agent Payments",
        teaser: "x402, ACP, AP2, ERC-8004",
        tag: "commerce",
        example:
          "REALSOUL issues short-lived proof that a live human approved a specific call, message, or transaction, part of a toolkit spanning x402 payment flows, ACP checkout, AP2 agent payments, and ERC-8004 agent identity.",
        link: { label: "Open REALSOUL", href: "https://realsoul-ten.vercel.app" },
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
    prompt: "Three ecosystems that left a tool behind. Pick one to recover.",
    objective: { label: "Recover tools from past ecosystems", noun: "tool", done: "Tools recovered." },
    nodeShape: "crate",
    nodeLayout: "spread",
    trait: "banner",
    artifacts: [
      {
        id: "terra-cycle",
        title: "Terra Luna Cycle",
        teaser: "Products through a full market cycle",
        tag: "community",
        example:
          "Went all in on crypto during the Luna era, shipping products and communities through the NFT boom and the crash that followed, with Arkadia Park still running today.",
        link: { label: "See the career timeline", href: "index.html#career" },
      },
      {
        id: "polygon-grant",
        title: "Polygon Grant",
        teaser: "Ecosystem operator",
        tag: "community",
        example:
          "Launched and grew Polygon-native community projects, including $GONE, and received a $50K Polygon grant for ecosystem work.",
        link: { label: "See the career timeline", href: "index.html#career" },
      },
      {
        id: "hyperliquid-thirdweb",
        title: "Hyperliquid & Thirdweb",
        teaser: "Research and tooling surfaces",
        tag: "product",
        example:
          "Hyperliquid research and Thirdweb tooling surfaces for token launches and NFT products, plus Solana tooling, across 100+ projects worked on.",
        link: { label: "See the career timeline", href: "index.html#career" },
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
    prompt: "Three pieces of the content factory. Pick one to inspect.",
    objective: { label: "Collect the media fragments", noun: "fragment", done: "Fragments collected." },
    nodeShape: "frame",
    nodeLayout: "spread",
    trait: "frame",
    artifacts: [
      {
        id: "clip-engine",
        title: "Clip Engine",
        teaser: "Long-form video into ranked shorts",
        tag: "creative",
        example:
          "ClipRO turns long-form YouTube videos and YouTube, Twitch, or Kick streams into ranked short clips ready for distribution.",
        link: { label: "Open ClipRO", href: "https://clip-ro.vercel.app" },
      },
      {
        id: "ai-artist-catalog",
        title: "AI Artist Catalog",
        teaser: "Song briefs, releases, promo plans",
        tag: "creative",
        example:
          "AutoArt manages AI artist catalogs, song briefs, release packages, and promo plans, while Studio Chat connects a local Codex chat flow to Logic Pro through LogicProMCP.",
        link: { label: "Open AutoArt", href: "https://autoart-nine.vercel.app" },
      },
      {
        id: "live-studio",
        title: "Live Studio",
        teaser: "Real-time AI video and multistream",
        tag: "creative",
        example:
          "Streamwin combines real-time AI video, multistream distribution, IRL controls, and vision-aware Twitch automations in one interactive live studio.",
        link: { label: "Open Streamwin", href: "https://streamwin.vercel.app" },
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
    prompt: "Three shipped builds from the workshop. Pick one to inspect.",
    objective: { label: "Gather the build blueprints", noun: "blueprint", done: "Blueprints gathered." },
    nodeShape: "scroll",
    nodeLayout: "spread",
    trait: "wrench",
    artifacts: [
      {
        id: "libergent",
        title: "libergent",
        teaser: "Romanian marketplace search",
        tag: "product",
        example:
          "Romanian marketplace search with structured extraction, direct HTML parsing, fallback providers, local scoring, and a cost-aware provider strategy.",
        link: { label: "Open libergent", href: "https://libergent.com" },
      },
      {
        id: "taptime",
        title: "TapTime",
        teaser: "Passive-NFC attendance",
        tag: "product",
        example:
          "A passive-NFC workplace attendance checkpoint that turns a simple tap into a secure, location-specific check-in or check-out flow.",
        link: { label: "Open TapTime", href: "https://taptime-mvp.vercel.app" },
      },
      {
        id: "bvb-lol",
        title: "bvb.lol",
        teaser: "Bucharest Stock Exchange terminal",
        tag: "product",
        example:
          "An open-source, read-only terminal that makes the Bucharest Stock Exchange easier to follow through clean instrument pages, filings, events, and market context.",
        link: { label: "Open bvb.lol", href: "https://bvblol.vercel.app" },
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
    prompt: "Three ways to keep a world alive. Pick one to carry to the end.",
    objective: { label: "Complete the player loop", noun: "token", done: "Player loop complete." },
    nodeShape: "loop",
    nodeLayout: "orbit",
    trait: "crown",
    artifacts: [
      {
        id: "arkadia-park",
        title: "Arkadia Park",
        teaser: "A crypto theme park that kept running",
        tag: "worlds",
        example:
          "A long-running crypto theme park and community world built around games, culture, ownership, quests, and real participation.",
        link: { label: "Read the game worlds chapter", href: "index.html#story-games" },
      },
      {
        id: "esports-signal",
        title: "Esports Signal",
        teaser: "Ranking the matches that matter",
        tag: "product",
        example:
          "HomeSports is an importance-ranked League of Legends esports matchboard combining live schedules with transparent ratings. Sprite LoL explores an AI companion players can message for League-focused help.",
        link: { label: "Open HomeSports", href: "https://homesports.vercel.app" },
      },
      {
        id: "playable-portfolio",
        title: "Playable Portfolio",
        teaser: "This quest, built with Three.js",
        tag: "worlds",
        example:
          "Vic's Quest is this game: a CV turned into an explorable route with castles, combat, objectives, and artifacts, built as a static Three.js site.",
        link: { label: "View the source", href: "https://github.com/Vicorico17/vicorico.fun" },
      },
    ],
  },
];

const tagCopy = {
  infra: {
    fit: "AI infrastructure and forward-deployed engineering",
    line: "You kept choosing the machinery underneath: GPUs, containers, private endpoints, and model serving.",
  },
  agents: {
    fit: "agent systems and automation",
    line: "You followed the agents: orchestration, MCP tools, and loops that improve their own work.",
  },
  revops: {
    fit: "revenue operations automation",
    line: "You picked the revenue engine: research, enrichment, and outreach that routes into the CRM.",
  },
  community: {
    fit: "community-led crypto products",
    line: "You chose the crowd: community coins, grants, and market cycles survived.",
  },
  markets: {
    fit: "market design and prediction products",
    line: "You went for market design: odds, shares, settlement, and incentives.",
  },
  commerce: {
    fit: "agentic commerce rails",
    line: "You followed the rails where AI agents meet crypto: x402, ACP, AP2, and proof of human approval.",
  },
  product: {
    fit: "shipped products and founder-led builds",
    line: "You inspected shipped builds: real products with real users and real constraints.",
  },
  creative: {
    fit: "creative automation and content pipelines",
    line: "You lit up the factory: clips, catalogs, and live studios that publish on repeat.",
  },
  worlds: {
    fit: "game worlds and living economies",
    line: "You built worlds: loops, economies, and reasons for players to return.",
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
const worldBoundsX = 26;
const worldStartZ = 8;
const worldEndZ = -266;
const triggerRadius = 5.8;
const attackRadius = 3.2;
const bowRange = 15;
const attackDuration = 0.42;
const gateOffset = 8.2;
const gateAnimDuration = 0.8;
const nodeCollectRadius = 1.45;
const playerSpeed = 9.4;
const toastDuration = 2.8;

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
  weapon: "sword",
  playerHealth: 100,
  message: "Follow the road. Clear the forecourt of the first castle.",
  messageAt: 0,
  collected: [],
  discovery: { index: -1, chosen: null },
  joystick: { active: false, pointerId: null, x: 0, y: 0, magnitude: 0, centerX: 0, centerY: 0, radius: 40 },
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

const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 130);
camera.position.set(0, 15, 20);

const ambient = new THREE.HemisphereLight(0xffffff, 0x10131d, 1.8);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(18, 30, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
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

function makeTextSprite(text, options = {}) {
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
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  const spriteHeight = options.height || 1.6;
  sprite.scale.set((width / height) * spriteHeight, spriteHeight, 1);
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

function createPlayer() {
  const group = new THREE.Group();
  const bodyMat = material("#e65f3f", { roughness: 0.38, metalness: 0.18 });
  const darkMat = material("#17252b", { roughness: 0.62 });
  const skinMat = material("#f3c58f", { roughness: 0.72 });
  const glowMat = material("#8bd3ff", { emissive: "#8bd3ff", emissiveIntensity: 0.65 });
  const swordMat = material("#fff6a3", { emissive: "#f4bf45", emissiveIntensity: 1.15, roughness: 0.28, metalness: 0.18 });
  const bowMat = material("#6fd18c", { emissive: "#6fd18c", emissiveIntensity: 0.75, roughness: 0.34, metalness: 0.12 });

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

  group.add(body, head, visor, pack, leftWing, rightWing, weaponPivot, bowPivot);
  group.userData.wings = [leftWing, rightWing];
  group.userData.weaponPivot = weaponPivot;
  group.userData.bowPivot = bowPivot;
  return group;
}

const player = createPlayer();
scene.add(player);

// The sword reach indicator only appears for the duration of a swing.
const attackRing = new THREE.Mesh(
  new THREE.RingGeometry(attackRadius - 0.22, attackRadius, 48),
  new THREE.MeshBasicMaterial({ color: "#fff6a3", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
);
attackRing.rotation.x = -Math.PI / 2;
attackRing.position.y = 0.07;
attackRing.renderOrder = 10;
attackRing.visible = false;
scene.add(attackRing);

function buildWorld() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 360, 40, 48),
    material("#253322", { roughness: 0.86 }),
  );
  ground.position.z = -126;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const path = makeBox(10, 0.04, 290, "#3b3127", 0, 0.025, -122, { roughness: 0.8 });
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

  // A light column that rises once the chapter is reconnected.
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

// Objective pieces sit in the forecourt among the mobs. Every castle reuses the
// same collect-by-walking mechanic; only the shape, the words, and the layout change.
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
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }),
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

function spawnMobPack(castle, castleIndex) {
  const [, castleZ] = castle.position;
  const formations = [
    { x: 0, z: castleZ + gateOffset + 2.2 },
    { x: -4.6, z: castleZ + gateOffset + 3.6 },
    { x: 4.6, z: castleZ + gateOffset + 3.6 },
    { x: -7.2, z: castleZ + gateOffset - 1.1 },
    { x: 7.2, z: castleZ + gateOffset - 1.1 },
  ];
  formations.forEach((spawn, mobIndex) => {
    const type = ["brute", "crawler", "seer", "runner", "sentinel"][(mobIndex + castleIndex) % 5];
    const mob = createMob(castle, type);
    const mobData = mob.userData;
    mob.position.set(spawn.x, 0, spawn.z);
    mob.userData = {
      castleIndex,
      type,
      color: castle.color,
      hp: mobData.maxHp,
      maxHp: mobData.maxHp,
      speed: mobData.speed,
      damage: mobData.damage,
      shootDamage: mobData.shootDamage,
      shootRange: mobData.shootRange,
      shootInterval: mobData.shootInterval,
      baseScale: mobData.baseScale,
      hitBurst: mobData.hitBurst,
      alive: true,
      hitTimer: 0,
      shootCooldown: mobData.shootInterval ? 0.7 + mobIndex * 0.24 : Infinity,
      baseX: spawn.x,
      baseZ: spawn.z,
      phase: mobIndex * 1.7 + castleIndex,
    };
    mobs.push(mob);
    scene.add(mob);
  });
}

function createMob(castle, type = "brute") {
  const group = new THREE.Group();
  const color = castle.color;
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
  group.traverse((child) => {
    if (child.isMesh && child.material?.emissive) child.userData.baseEmissive = child.material.emissiveIntensity;
  });
  group.scale.setScalar(stats.scale);
  group.userData.maxHp = stats.maxHp;
  group.userData.speed = stats.speed;
  group.userData.damage = stats.damage;
  group.userData.shootDamage = stats.shootDamage || 0;
  group.userData.shootRange = stats.shootRange || 0;
  group.userData.shootInterval = stats.shootInterval || 0;
  group.userData.baseScale = stats.scale;
  group.userData.hitBurst = hitBurst;
  return group;
}

// Small castle-specific ornaments so each forecourt's enemies read differently.
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

function buildTrees() {
  const trunkMat = material("#433019", { roughness: 0.82 });
  const leafMat = material("#1d5135", { roughness: 0.75 });
  for (let i = 0; i < 230; i += 1) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const x = side * (13 + Math.random() * 118);
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

function buildPickups() {
  const pickupMat = material("#fb7185", { emissive: "#fb7185", emissiveIntensity: 1.05, roughness: 0.28, metalness: 0.08 });
  castles.forEach((castle, index) => {
    if (index === castles.length - 1) return;
    const nextCastle = castles[index + 1];
    const z = (castle.position[1] + nextCastle.position[1]) / 2;
    [-1, 1].forEach((side) => {
      const pickup = createHeartPickup(pickupMat);
      pickup.position.set(side * (7.2 + (index % 2) * 2.8), 0.85, z);
      pickup.userData.baseY = pickup.position.y;
      pickup.userData.spin = side * 1.15;
      pickup.userData.active = true;
      pickups.push(pickup);
      worldObjects.push(pickup);
      scene.add(pickup);
    });
  });
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

// Lightweight particle and timed-effect helpers used for hits, defeats,
// pickups, gate openings, and the "reconnect" beams.
function particleMaterial(color) {
  if (!particleMaterials.has(color)) particleMaterials.set(color, new THREE.MeshBasicMaterial({ color }));
  return particleMaterials.get(color);
}

function spawnBurst(x, y, z, color, count, options = {}) {
  for (let i = 0; i < count; i += 1) {
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

function spawnRingPulse(x, z, color, radius, duration = 0.5) {
  const mesh = new THREE.Mesh(
    pulseGeometry,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, depthTest: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.06, z);
  mesh.renderOrder = 9;
  effects.push({
    mesh,
    age: 0,
    maxAge: duration,
    tick(t) {
      const scale = 0.4 + t * radius;
      mesh.scale.set(scale, scale, 1);
      mesh.material.opacity = (1 - t) * 0.9;
    },
  });
  scene.add(mesh);
}

function spawnBeam(fromX, fromZ, toX, toZ, color, duration = 1.3) {
  const dx = toX - fromX;
  const dz = toZ - fromZ;
  const length = Math.max(0.1, Math.hypot(dx, dz));
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, length),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }),
  );
  mesh.position.set((fromX + toX) / 2, 1.1, (fromZ + toZ) / 2);
  mesh.rotation.y = Math.atan2(dx, dz);
  effects.push({
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

function updateEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i -= 1) {
    const effect = effects[i];
    effect.age += dt;
    const t = Math.min(1, effect.age / effect.maxAge);
    effect.tick(t);
    if (effect.age >= effect.maxAge) {
      scene.remove(effect.mesh);
      effect.mesh.material.dispose();
      if (effect.mesh.geometry !== pulseGeometry) effect.mesh.geometry.dispose();
      effects.splice(i, 1);
    }
  }
}

function clearTransientObjects() {
  projectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  enemyProjectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  particles.splice(0).forEach((particle) => scene.remove(particle));
  effects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    effect.mesh.material.dispose();
    if (effect.mesh.geometry !== pulseGeometry) effect.mesh.geometry.dispose();
  });
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
  state.weapon = "sword";
  state.playerHealth = 100;
  state.collected = [];
  state.discovery = { index: -1, chosen: null };
  visited.clear();
  mobs.forEach((mob) => {
    mob.userData.hp = mob.userData.maxHp;
    mob.userData.alive = true;
    mob.userData.hitTimer = 0;
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
  keys.clear();
  releaseJoystick();
  hidePanel(introNode);
  hidePanel(discoveryNode);
  hidePanel(endingNode);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  setPhase("play");
  setMessage("Quest reset. Follow the road to the first castle.");
  updateWeaponUi();
  updateHud(true);
}

// Falling in combat sends the player back to the current forecourt with full
// health. Progress and collected artifacts are kept so a run stays short.
function respawn() {
  const item = castleObjects[state.unlockedIndex];
  state.playerHealth = 100;
  state.player.x = 0;
  state.player.z = item ? Math.min(worldStartZ, item.z + gateOffset + 9) : 0;
  state.player.vx = 0;
  state.player.vz = 0;
  state.player.hitCooldown = 1.2;
  state.player.rotation = Math.PI;
  projectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  enemyProjectiles.splice(0).forEach((projectile) => scene.remove(projectile));
  if (item) {
    activeMobsForCastle(item.index).forEach((mob) => {
      mob.position.set(mob.userData.baseX, 0, mob.userData.baseZ);
      mob.userData.shootCooldown = mob.userData.shootInterval ? 1.2 : Infinity;
    });
  }
  setMessage("You fell. Back at the last gate with full health.");
  updateHud(true);
}

function update(dt) {
  const playing = state.phase === "play";
  state.attackTimer = Math.max(0, state.attackTimer - dt);
  if (playing) {
    state.attackCooldown = Math.max(0, state.attackCooldown - dt);
    state.player.hitCooldown = Math.max(0, state.player.hitCooldown - dt);
    updateMovement(dt);
    updateMobs(dt);
    updateProjectiles(dt);
    updateEnemyProjectiles(dt);
    updatePickups(dt);
  }
  updateNodes(dt);
  updateCastles(dt);
  if (playing) updateDiscoveryTrigger();
  updateParticles(dt);
  updateEffects(dt);
  updateTheme();
  updatePlayer(dt);
  updateCamera(dt);
  animateWorld(dt);
  updateHud();
}

function updateMovement(dt) {
  const digitalForward = (keys.has("ArrowUp") || keys.has("w") || keys.has("W") ? 1 : 0) - (keys.has("ArrowDown") || keys.has("s") || keys.has("S") ? 1 : 0);
  const digitalStrafe = (keys.has("ArrowRight") || keys.has("d") || keys.has("D") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("a") || keys.has("A") ? 1 : 0);
  let inputX = digitalStrafe;
  let inputZ = -digitalForward;
  let magnitude = Math.hypot(inputX, inputZ);

  if (magnitude > 0) {
    inputX /= magnitude;
    inputZ /= magnitude;
    magnitude = 1;
  } else if (state.joystick.active && state.joystick.magnitude > 0) {
    inputX = state.joystick.x;
    inputZ = state.joystick.y;
    magnitude = state.joystick.magnitude;
  }

  if (magnitude > 0) {
    const speed = playerSpeed * magnitude;
    state.player.x += inputX * speed * dt;
    state.player.z += inputZ * speed * dt;
    state.player.rotation = Math.atan2(inputX, inputZ);
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

function updateMobs(dt) {
  const activeIndex = state.unlockedIndex;
  mobs.forEach((mob) => {
    const isActive = mob.userData.alive && mob.userData.castleIndex === activeIndex;
    mob.visible = mob.userData.alive && mob.userData.castleIndex >= activeIndex && mob.userData.castleIndex <= activeIndex + 1;
    if (!mob.visible) return;

    const time = clock.elapsedTime + mob.userData.phase;
    mob.rotation.y += dt * 1.8;
    mob.position.y = Math.sin(time * 4) * 0.08;
    const baseScale = mob.userData.baseScale || 1;
    mob.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), Math.min(1, dt * 8));
    mob.userData.hitTimer = Math.max(0, mob.userData.hitTimer - dt);
    const isHit = mob.userData.hitTimer > 0;
    const hitBurst = mob.userData.hitBurst;
    if (hitBurst) {
      const hitProgress = mob.userData.hitTimer / 0.18;
      hitBurst.visible = isHit;
      hitBurst.material.opacity = Math.max(0, hitProgress) * 0.95;
      hitBurst.scale.setScalar(1 + (1 - hitProgress) * 1.35);
      hitBurst.rotation.z += dt * 11;
    }
    mob.children.forEach((child) => {
      if (!child.material?.emissive) return;
      const base = child.userData.baseEmissive ?? 0.18;
      child.material.emissiveIntensity = isHit ? Math.max(1.2, base) : base;
    });

    if (!isActive) {
      mob.position.x = mob.userData.baseX;
      mob.position.z = mob.userData.baseZ;
      return;
    }

    const dx = state.player.x - mob.position.x;
    const dz = state.player.z - mob.position.z;
    const distance = Math.hypot(dx, dz);
    mob.userData.shootCooldown = Math.max(0, mob.userData.shootCooldown - dt);
    if (mob.userData.shootRange && distance < mob.userData.shootRange && distance > 2.4 && mob.userData.shootCooldown <= 0) {
      fireEnemyBolt(mob, dx, dz, distance);
      mob.userData.shootCooldown = mob.userData.shootInterval;
    }
    if (distance < 12 && distance > 0.1) {
      mob.position.x += (dx / distance) * dt * mob.userData.speed;
      mob.position.z += (dz / distance) * dt * mob.userData.speed;
    } else {
      const patrolRadius = mob.userData.type === "runner" ? 2.4 : 1.45;
      mob.position.x = THREE.MathUtils.lerp(mob.position.x, mob.userData.baseX + Math.sin(time * 0.85) * patrolRadius, Math.min(1, dt * 1.4));
      mob.position.z = THREE.MathUtils.lerp(mob.position.z, mob.userData.baseZ + Math.cos(time * 0.7) * patrolRadius, Math.min(1, dt * 1.4));
    }
    if (distance < 1.35) {
      state.playerHealth = Math.max(0, state.playerHealth - dt * mob.userData.damage);
      setMessage("A mob is hitting you. Back up and attack.");
      if (state.player.hitCooldown <= 0 && distance > 0.05) {
        let pushX = dx / distance;
        let pushZ = dz / distance;
        if (Math.abs(pushX) < 0.28) pushX = mob.userData.phase % 2 > 1 ? 0.72 : -0.72;
        const pushLength = Math.max(0.001, Math.hypot(pushX, pushZ));
        pushX /= pushLength;
        pushZ /= pushLength;
        state.player.x += pushX * 1.25;
        state.player.z += pushZ * 1.25;
        state.player.vx += pushX * 7.2;
        state.player.vz += pushZ * 7.2;
        state.player.hitCooldown = 0.34;
      }
      if (state.playerHealth <= 0) respawn();
    }
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
      state.playerHealth = Math.min(100, state.playerHealth + 22);
      spawnBurst(pickup.position.x, pickup.position.y, pickup.position.z, "#fb7185", 8, { speed: 2.6, lift: 3, life: 0.6, scale: 0.8 });
      setMessage("Health restored.");
    }
  });
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
        if (isCurrent && !item.discovered) setMessage("The gate is opening. Walk inside.");
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

function damageMob(mob, amount, knockback = 0.55) {
  mob.userData.hp -= amount;
  mob.userData.hitTimer = 0.18;
  mob.scale.setScalar((mob.userData.baseScale || 1) * 1.18);
  const dx = mob.position.x - state.player.x;
  const dz = mob.position.z - state.player.z;
  const length = Math.max(0.001, Math.hypot(dx, dz));
  mob.position.x += (dx / length) * knockback;
  mob.position.z += (dz / length) * knockback;
  spawnBurst(mob.position.x, 1.1, mob.position.z, "#fff6a3", 4, { speed: 2.6, lift: 2.4, life: 0.45, scale: 0.7 });
  if (mob.userData.hp <= 0) defeatMob(mob);
}

function defeatMob(mob) {
  mob.userData.alive = false;
  mob.visible = false;
  const color = mob.userData.color || "#fff6a3";
  spawnBurst(mob.position.x, 0.9, mob.position.z, color, 14, { speed: 4.2, lift: 4.2, life: 0.8 });
  spawnRingPulse(mob.position.x, mob.position.z, color, 3.2, 0.55);
}

function attack() {
  if (state.phase !== "play" || state.attackCooldown > 0) return;
  state.attackCooldown = state.weapon === "bow" ? 0.48 : 0.38;
  state.attackTimer = attackDuration;
  canvas.classList.remove("is-attacking");
  window.requestAnimationFrame(() => canvas.classList.add("is-attacking"));
  window.setTimeout(() => {
    canvas.classList.remove("is-attacking");
  }, attackDuration * 1000);

  if (state.weapon === "bow") {
    fireArrow();
    return;
  }

  let hit = false;
  const castleIndex = state.unlockedIndex;
  activeMobsForCastle(castleIndex).forEach((mob) => {
    const distance = Math.hypot(state.player.x - mob.position.x, state.player.z - mob.position.z);
    if (distance > attackRadius) return;
    damageMob(mob, 1, 0.7);
    hit = true;
  });
  if (hit) reportCombat(castleIndex);
  else setMessage("Move closer to a mob before attacking.");
}

function reportCombat(castleIndex) {
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

function fireArrow() {
  const direction = new THREE.Vector3(Math.sin(state.player.rotation), 0, Math.cos(state.player.rotation));
  const arrow = new THREE.Group();
  const shaft = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.09, 1.05),
    material("#fff6a3", { emissive: "#f4bf45", emissiveIntensity: 0.85, roughness: 0.26 }),
  );
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.32, 8),
    material("#6fd18c", { emissive: "#6fd18c", emissiveIntensity: 0.9, roughness: 0.3 }),
  );
  head.position.z = -0.68;
  head.rotation.x = -Math.PI / 2;
  arrow.add(shaft, head);
  arrow.position.set(state.player.x + direction.x * 0.9, 1.08, state.player.z + direction.z * 0.9);
  arrow.rotation.y = Math.atan2(-direction.x, -direction.z);
  arrow.userData = {
    vx: direction.x * 25,
    vz: direction.z * 25,
    age: 0,
    maxAge: bowRange / 25,
  };
  projectiles.push(arrow);
  scene.add(arrow);
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.userData.age += dt;
    projectile.position.x += projectile.userData.vx * dt;
    projectile.position.z += projectile.userData.vz * dt;
    projectile.position.y = 1.08 + Math.sin(projectile.userData.age * 28) * 0.035;

    let remove = projectile.userData.age >= projectile.userData.maxAge;
    if (!remove) {
      const castleIndex = state.unlockedIndex;
      const hitMob = activeMobsForCastle(castleIndex).find((mob) => Math.hypot(projectile.position.x - mob.position.x, projectile.position.z - mob.position.z) < 1.08);
      if (hitMob) {
        damageMob(hitMob, 1, 1.05);
        remove = true;
        reportCombat(castleIndex);
      }
    }
    if (remove) {
      projectiles.splice(i, 1);
      scene.remove(projectile);
    }
  }
}

function fireEnemyBolt(mob, dx, dz, distance) {
  const direction = new THREE.Vector3(dx / distance, 0, dz / distance);
  const bolt = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 14, 10),
    new THREE.MeshBasicMaterial({ color: "#fb7185" }),
  );
  bolt.position.set(mob.position.x, 1.08, mob.position.z);
  bolt.userData = {
    vx: direction.x * 8.4,
    vz: direction.z * 8.4,
    age: 0,
    maxAge: 1.85,
    damage: mob.userData.shootDamage,
  };
  enemyProjectiles.push(bolt);
  scene.add(bolt);
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
      const pushX = (state.player.x - bolt.position.x) / Math.max(0.001, distance);
      const pushZ = (state.player.z - bolt.position.z) / Math.max(0.001, distance);
      state.playerHealth = Math.max(0, state.playerHealth - bolt.userData.damage);
      state.player.vx += pushX * 4.5;
      state.player.vz += pushZ * 4.5;
      spawnBurst(bolt.position.x, 1.1, bolt.position.z, "#fb7185", 6, { speed: 2.4, lift: 2.4, life: 0.5, scale: 0.8 });
      setMessage("A ranged mob hit you.");
      remove = true;
      if (state.playerHealth <= 0) {
        enemyProjectiles.splice(i, 1);
        scene.remove(bolt);
        respawn();
        return;
      }
    }
    if (remove) {
      enemyProjectiles.splice(i, 1);
      scene.remove(bolt);
    }
  }
}

function updateTheme() {
  // Base sky stays dark. A castle's forecourt gets a light wash of its colour;
  // stepping inside the trigger ring commits to the full colour.
  const target = new THREE.Color("#111827");
  const focus = state.focusItem;
  if (focus) {
    const distance = Math.hypot(state.player.x - focus.x, state.player.z - focus.z);
    target.lerp(new THREE.Color(focus.castle.color), distance <= triggerRadius ? 1 : 0.32);
  }
  state.themeColor.lerp(target, 0.018);
  scene.background = state.themeColor.clone();
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
  attackRing.scale.setScalar(1 + (1 - swordFlash) * 0.08);
}

function updateCamera(dt) {
  const desired = new THREE.Vector3(state.player.x, 13.5, state.player.z + 18);
  camera.position.lerp(desired, Math.min(1, dt * 4.8));
  camera.lookAt(new THREE.Vector3(state.player.x, 1.5, state.player.z - 4));
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

function updateHud(force = false) {
  if (!zoneNode || !progressNode || !progressBarNode || !mobsNode || !nodesNode || !healthNode || !healthBarNode || !cardNode || !cardKickerNode || !cardTitleNode || !cardCopyNode || !cardListNode) return;
  const item = castleObjects[state.unlockedIndex] || null;
  const mobsLeft = item ? activeMobsForCastle(item.index).length : 0;
  const nodesLeft = item ? remainingNodes(item.index) : 0;
  const focus = state.focusItem;
  const inForecourt = Boolean(item && focus === item);
  const toastVisible = state.phase !== "intro" && Boolean(state.message) && clock.elapsedTime - state.messageAt < toastDuration;
  const signature = [
    state.phase,
    state.unlockedIndex,
    mobsLeft,
    nodesLeft,
    Math.round(state.playerHealth),
    visited.size,
    focus ? focus.index : -1,
    focus?.discovered ? 1 : 0,
    inForecourt ? 1 : 0,
    toastVisible ? state.message : "",
    state.completed ? 1 : 0,
  ].join("|");
  if (!force && signature === state.lastHudId) return;
  state.lastHudId = signature;

  let zone = "Vic's Quest";
  if (state.phase === "ending" || state.completed) zone = "World reconnected";
  else if (state.phase === "discovery") zone = "Discovery";
  else if (state.phase === "play") {
    if (!item) zone = "All castles unlocked";
    else if (objectiveComplete(item.index)) zone = "Gate open. Walk inside.";
    else if (inForecourt) zone = item.castle.objective.label;
    else zone = `Road to ${item.castle.shortTitle}`;
  }
  zoneNode.textContent = zone;
  mobsNode.textContent = String(mobsLeft);
  nodesNode.textContent = String(nodesLeft);
  healthNode.textContent = String(Math.round(state.playerHealth));
  healthBarNode.style.width = `${state.playerHealth}%`;
  progressNode.textContent = `${visited.size}/${castles.length}`;
  progressBarNode.style.width = `${(visited.size / castles.length) * 100}%`;
  if (toastNode) {
    toastNode.textContent = state.message;
    toastNode.classList.toggle("is-hidden", !toastVisible);
  }

  const showCard = state.phase === "play" && Boolean(focus);
  cardNode.classList.toggle("is-hidden", !showCard);
  if (!showCard) return;

  const castle = focus.castle;
  cardNode.style.setProperty("--castle-color", castle.color);
  if (focus.discovered) {
    const entry = state.collected.find((collected) => collected.castleId === castle.id);
    const artifact = entry ? castle.artifacts.find((candidate) => candidate.id === entry.artifactId) : null;
    cardKickerNode.textContent = `Chapter ${castle.chapter} · Reconnected`;
    cardTitleNode.textContent = artifact ? artifact.title : castle.shortTitle;
    cardCopyNode.textContent = artifact ? artifact.example : castle.intro;
    setCardList([
      { text: "Artifact collected", done: true },
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
    { text: done ? "Walk inside to choose an artifact" : "Open the gate", done: false },
  ]);
}

function updateWeaponUi() {
  const label = state.weapon === "bow" ? "Bow" : "Sword";
  weaponNodes.forEach((node) => {
    node.textContent = label;
  });
  document.querySelectorAll('[data-game-tap="Weapon"]').forEach((button) => {
    button.textContent = label.toUpperCase();
  });
}

function switchWeapon() {
  state.weapon = state.weapon === "sword" ? "bow" : "sword";
  state.attackCooldown = Math.min(state.attackCooldown, 0.12);
  setMessage(`${state.weapon === "bow" ? "Bow" : "Sword"} ready.`);
  updateWeaponUi();
  updateHud(true);
}

// Story panels: intro, per-castle discovery, and the ending.
function startGame() {
  if (state.phase !== "intro") return;
  hidePanel(introNode);
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  setPhase("play");
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
  state.player.vx = 0;
  state.player.vz = 0;
  state.discovery = { index: item.index, chosen: null };
  setPhase("discovery");
  const castle = item.castle;
  discoveryNode.style.setProperty("--castle-color", castle.color);
  discoveryKickerNode.textContent = `Chapter ${castle.chapter} · ${castle.shortTitle}`;
  discoveryTitleNode.textContent = "Choose one artifact";
  discoveryIntroNode.textContent = castle.prompt;
  discoveryChoicesNode.replaceChildren(
    ...castle.artifacts.map((artifact, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "artifact-choice";
      button.dataset.artifactIndex = String(index);
      const key = document.createElement("kbd");
      key.textContent = String(index + 1);
      const title = document.createElement("b");
      title.textContent = artifact.title;
      const teaser = document.createElement("span");
      teaser.textContent = artifact.teaser;
      button.append(key, title, teaser);
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
  state.discovery.chosen = index;
  state.collected = state.collected.filter((entry) => entry.castleId !== item.castle.id);
  state.collected.push({ castleId: item.castle.id, artifactId: artifact.id });
  discoveryChoicesNode.querySelectorAll("button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-selected", buttonIndex === index);
  });
  revealTitleNode.textContent = artifact.title;
  revealCopyNode.textContent = artifact.example;
  revealLinkNode.textContent = artifact.link.label;
  revealLinkNode.href = artifact.link.href;
  discoveryContinueNode.textContent = item.index === castles.length - 1 ? "See the ending" : "Continue the quest";
  discoveryRevealNode.classList.remove("is-hidden");
  discoveryContinueNode.focus();
  discoveryRevealNode.scrollIntoView?.({ block: "nearest" });
  spawnBurst(item.x, 2.6, item.z, item.castle.color, 12, { speed: 2.8, lift: 3.4, life: 0.8 });
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
  if (item.index === castles.length - 1) {
    state.completed = true;
    openEnding();
    return;
  }
  setPhase("play");
  const next = castles[state.unlockedIndex];
  setMessage(`${item.castle.shortTitle} reconnected. Leave through the back gate${next ? ` and follow the road to ${next.shortTitle}` : ""}.`);
  updateHud(true);
}

function findArtifact(entry) {
  const castle = castles.find((candidate) => candidate.id === entry.castleId);
  const artifact = castle?.artifacts.find((candidate) => candidate.id === entry.artifactId);
  return castle && artifact ? { castle, artifact } : null;
}

function buildSummary() {
  const counts = new Map();
  state.collected.forEach((entry) => {
    const found = findArtifact(entry);
    if (!found) return;
    counts.set(found.artifact.tag, (counts.get(found.artifact.tag) || 0) + 1);
  });
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  const first = tagCopy[ranked[0]];
  const second = tagCopy[ranked[1]];
  if (!first) return "You crossed every castle. Head back to the main site to explore the full portfolio.";
  const lines = [first.line];
  if (second) lines.push(second.line);
  lines.push(`Your route points to ${first.fit}${second ? ` and ${second.fit}` : ""}. Start the conversation there.`);
  return lines.join(" ");
}

function openEnding() {
  keys.clear();
  releaseJoystick();
  setPhase("ending");
  if (endingSummaryNode) endingSummaryNode.textContent = buildSummary();
  if (endingArtifactsNode) {
    endingArtifactsNode.replaceChildren(
      ...state.collected.map((entry) => {
        const found = findArtifact(entry);
        const li = document.createElement("li");
        if (!found) return li;
        li.style.setProperty("--castle-color", found.castle.color);
        const title = document.createElement("strong");
        title.textContent = found.artifact.title;
        const chapter = document.createElement("span");
        chapter.textContent = found.castle.shortTitle;
        const link = document.createElement("a");
        link.href = found.artifact.link.href;
        link.textContent = found.artifact.link.label;
        link.target = "_blank";
        link.rel = "noopener";
        li.append(title, chapter, link);
        return li;
      }),
    );
  }
  showPanel(endingNode);
  window.setTimeout(() => {
    if (state.phase === "ending") endingNode?.querySelector("a, button")?.focus({ preventScroll: true });
  }, 40);
  const last = castleObjects[castles.length - 1];
  if (last) {
    spawnBurst(last.x, 6.5, last.z, last.castle.color, 30, { speed: 5, lift: 5, life: 1.2 });
    spawnRingPulse(last.x, last.z, last.castle.color, 9, 1.2);
  }
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

// Keyboard: WASD/arrows move, Space/E attack, Q weapon, R reset, F fullscreen,
// 1-3 pick an artifact while a discovery panel is open.
window.addEventListener("keydown", (event) => {
  const key = event.key;
  if (event.repeat && !movementKeys.has(key)) return;
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

  if (state.phase === "ending") {
    if (key === "r" || key === "R") resetGame();
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
  releaseJoystick();
});

// Virtual joystick: an analog stick that follows the finger and springs back.
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

if (joystickNode && joystickKnobNode) {
  joystickNode.addEventListener("pointerdown", (event) => {
    if (state.joystick.active) return;
    event.preventDefault();
    enterMobileFullscreen();
    if (state.phase === "intro") startGame();
    if (state.phase !== "play") return;
    const rect = joystickNode.getBoundingClientRect();
    const joystick = state.joystick;
    joystick.active = true;
    joystick.pointerId = event.pointerId;
    joystick.centerX = rect.left + rect.width / 2;
    joystick.centerY = rect.top + rect.height / 2;
    joystick.radius = Math.max(24, rect.width / 2 - joystickKnobNode.offsetWidth / 2);
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
    const rect = joystickNode.getBoundingClientRect();
    state.joystick.centerX = rect.left + rect.width / 2;
    state.joystick.centerY = rect.top + rect.height / 2;
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
}

function handleTap(action) {
  if (action === "Attack") {
    if (state.phase === "intro") startGame();
    else attack();
  } else if (action === "Weapon") {
    switchWeapon();
  } else if (state.phase !== "intro") {
    resetGame();
  }
}

for (const button of document.querySelectorAll("[data-game-tap]")) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.dataset.ignoreClick = "true";
    enterMobileFullscreen();
    handleTap(button.dataset.gameTap);
    button.classList.add("is-pressed");
  });
  button.addEventListener("pointerup", (event) => {
    event.preventDefault();
    button.classList.remove("is-pressed");
  });
  button.addEventListener("pointercancel", () => button.classList.remove("is-pressed"));
  button.addEventListener("pointerleave", () => button.classList.remove("is-pressed"));
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (button.dataset.ignoreClick === "true") {
      delete button.dataset.ignoreClick;
      return;
    }
    handleTap(button.dataset.gameTap);
  });
}

document.querySelectorAll("[data-game-start]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
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
  return JSON.stringify({
    renderer: "threejs",
    mode: "linear-castle-quest",
    phase: state.phase,
    active: state.activeCastle?.id || "hub",
    unlockedIndex: state.unlockedIndex,
    completed: state.completed,
    activeMobCount: current ? activeMobsForCastle(current.index).length : 0,
    remainingNodes: current ? remainingNodes(current.index) : 0,
    mobs: current
      ? activeMobsForCastle(current.index).map((mob) => ({
          type: mob.userData.type,
          hp: mob.userData.hp,
          x: Number(mob.position.x.toFixed(2)),
          z: Number(mob.position.z.toFixed(2)),
        }))
      : [],
    nodes: current
      ? current.nodes
          .filter((node) => node.userData.active)
          .map((node) => ({ x: Number(node.position.x.toFixed(2)), z: Number(node.position.z.toFixed(2)) }))
      : [],
    gateProgress: current ? Number(current.gateProgress.toFixed(2)) : 1,
    playerHealth: Math.round(state.playerHealth),
    weapon: state.weapon,
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
updateHud(true);
hidePanel(discoveryNode);
hidePanel(endingNode);
window.addEventListener("resize", resize);
render();
requestAnimationFrame(tick);
