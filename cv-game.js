import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("game");
const zoneNode = document.querySelector("[data-game-zone]");
const progressNode = document.querySelector("[data-game-progress]");
const progressBarNode = document.querySelector("[data-game-progress-bar]");
const cardKickerNode = document.querySelector("[data-game-card-kicker]");
const cardTitleNode = document.querySelector("[data-game-card-title]");
const cardCopyNode = document.querySelector("[data-game-card-copy]");
const cardListNode = document.querySelector("[data-game-card-list]");
const keys = new Set();

const castles = [
  {
    id: "ai",
    title: "AI Systems Castle",
    shortTitle: "AI Systems",
    color: "#f4bf45",
    position: [-24, -18],
    detail:
      "AI process architecture, local-first applications, GPU-backed model deployment, Kubernetes, second-brain knowledge bases, lead generation agents, support copilots, and internal workflows that reduce coordination.",
    bullets: [
      "Five-node Kubernetes homelab",
      "GPU containers and model serving",
      "Context engineering and quality control",
      "Privacy-preserving local AI for professional services",
    ],
  },
  {
    id: "automation",
    title: "Automation Castle",
    shortTitle: "Automation",
    color: "#7cc77d",
    position: [0, -28],
    detail:
      "Lead enrichment agents, first-touch emails, customer support copilots, meeting prep, content operations pipelines, second brains, review loops, and workflow automation.",
    bullets: ["RevOps agents", "Support copilots", "Meeting prep", "Content pipelines"],
  },
  {
    id: "crypto",
    title: "Crypto Rails Castle",
    shortTitle: "Crypto Rails",
    color: "#4f70ff",
    position: [24, -18],
    detail:
      "Smart contracts, token standards, marketplaces, gaming loops, prediction markets, community coins, NFT systems, on-chain reputation, x402-style payments, and Solana tooling.",
    bullets: ["ERC-20 / ERC-721 / ERC-1155", "$200K+ community funding", "$50K Polygon grant", "x402-style payments"],
  },
  {
    id: "creative",
    title: "Creative Factory Castle",
    shortTitle: "Creative Factory",
    color: "#d95f9d",
    position: [-28, 12],
    detail:
      "Automated video and content creation for Instagram, TikTok, YouTube, image models, repurposing systems, music video automation, storytelling, and growth experiments.",
    bullets: ["ComfyUI workflows", "Seedance and Glif agents", "Short-form production", "YouTube repurposing"],
  },
  {
    id: "projects",
    title: "Projects Castle",
    shortTitle: "Projects",
    color: "#6fd18c",
    position: [0, 18],
    detail:
      "Active builds and artifacts: Arkadia Park, Baguri, Grand Cafe Bucharest, pump-bump, clip-ro, Marketz.ro, libergent, and commerce systems.",
    bullets: ["Arkadia Park", "Baguri", "libergent", "Grand Cafe Bucharest"],
  },
  {
    id: "games",
    title: "Game Worlds Castle",
    shortTitle: "Game Worlds",
    color: "#fb7185",
    position: [28, 12],
    detail:
      "Games as living economies: mechanics, 3D models, progression, lore, communities, rewards, scarcity, marketplaces, wallets, collectibles, and distribution loops.",
    bullets: ["Game systems", "Worldbuilding", "Player economies", "Web3 theme park"],
  },
];

const clock = new THREE.Clock();
const visited = new Set();
const worldObjects = [];
const castleObjects = [];
const worldBounds = 42;
const triggerRadius = 7.2;

const state = {
  activeCastle: null,
  lastHudId: "",
  themeColor: new THREE.Color("#111827"),
  player: {
    x: 0,
    z: 0,
    rotation: 0,
    speed: 0,
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

const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 240);
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

const player = createPlayer();
scene.add(player);

buildWorld();
resize();
updateHud(null, true);
window.addEventListener("resize", resize);

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

function createPlayer() {
  const group = new THREE.Group();
  const bodyMat = material("#e65f3f", { roughness: 0.38, metalness: 0.18 });
  const darkMat = material("#17252b", { roughness: 0.62 });
  const skinMat = material("#f3c58f", { roughness: 0.72 });
  const glowMat = material("#8bd3ff", { emissive: "#8bd3ff", emissiveIntensity: 0.65 });

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

  group.add(body, head, visor, pack, leftWing, rightWing);
  group.userData.wings = [leftWing, rightWing];
  return group;
}

function buildWorld() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(96, 96, 12, 12),
    material("#253322", { roughness: 0.86 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const pathMat = material("#3b3127", { roughness: 0.72 });
  for (const castle of castles) {
    const [x, z] = castle.position;
    const path = makeBox(Math.abs(x) > Math.abs(z) ? Math.abs(x) + 8 : 5, 0.04, Math.abs(z) >= Math.abs(x) ? Math.abs(z) + 8 : 5, "#3b3127", x / 2, 0.025, z / 2, { roughness: 0.8 });
    path.material = pathMat;
    scene.add(path);
  }

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.12, 48), material("#2f3c34", { roughness: 0.8 }));
  plaza.position.y = 0.06;
  plaza.receiveShadow = true;
  scene.add(plaza);

  const centerLabel = makeTextSprite("Walk Into A Castle", {
    background: "rgba(5, 7, 12, 0.72)",
    color: "#ffffff",
    height: 1.05,
    fontSize: 54,
  });
  centerLabel.position.set(0, 3.1, 0);
  scene.add(centerLabel);

  castles.forEach((castle, index) => {
    const built = buildCastle(castle, index);
    castleObjects.push(built);
    scene.add(built.group);
  });

  buildTrees();
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

  const base = makeBox(8.4, 0.28, 8.4, "#1d2527", 0, 0.14, 0, { roughness: 0.72 });
  const keep = makeBox(3.6, 5.2, 3.3, wall, 0, 2.74, 0.6, { roughness: 0.55, metalness: 0.08 });
  const roof = makeCone(2.75, 2.2, accent, 0, 6.45, 0.6, { emissive: accent, emissiveIntensity: 0.18 });
  const gate = makeBox(2.15, 2.4, 0.3, dark, 0, 1.28, -3.63, { emissive: accent, emissiveIntensity: 0.18 });
  const gateGlow = makeBox(1.28, 1.58, 0.08, accent, 0, 1.25, -3.82, { emissive: accent, emissiveIntensity: 0.55, transparent: true, opacity: 0.68 });

  group.add(base, keep, roof, gate, gateGlow);

  const towerPositions = [
    [-3.45, -3.45],
    [3.45, -3.45],
    [-3.45, 3.45],
    [3.45, 3.45],
  ];
  for (const [tx, tz] of towerPositions) {
    const tower = makeCylinder(0.82, 4.8, wall, tx, 2.5, tz, { roughness: 0.54 });
    const cap = makeCone(1.15, 1.45, accent, tx, 5.62, tz, { emissive: accent, emissiveIntensity: 0.16 });
    group.add(tower, cap);
  }

  const walls = [
    makeBox(7.2, 1.8, 0.44, wall, 0, 1.02, -3.72),
    makeBox(7.2, 1.8, 0.44, wall, 0, 1.02, 3.72),
    makeBox(0.44, 1.8, 7.2, wall, -3.72, 1.02, 0),
    makeBox(0.44, 1.8, 7.2, wall, 3.72, 1.02, 0),
  ];
  walls.forEach((wallMesh) => group.add(wallMesh));

  const ring = new THREE.Mesh(new THREE.TorusGeometry(triggerRadius, 0.035, 8, 96), accentMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.08;
  ring.userData.spin = index % 2 ? -0.18 : 0.18;
  group.add(ring);
  worldObjects.push(ring, gateGlow);

  const label = makeTextSprite(castle.shortTitle, {
    background: "rgba(5, 7, 12, 0.72)",
    color: "#ffffff",
    height: 1.0,
    fontSize: 58,
  });
  label.position.set(0, 8.2, -1.2);
  group.add(label);

  const icon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), accentMat);
  icon.position.set(0, 7.1, 0.6);
  icon.userData.baseY = icon.position.y;
  group.add(icon);
  worldObjects.push(icon);

  return { group, castle, x, z, ring, icon };
}

function buildTrees() {
  const trunkMat = material("#433019", { roughness: 0.82 });
  const leafMat = material("#1d5135", { roughness: 0.75 });
  for (let i = 0; i < 70; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 16 + Math.random() * 32;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
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

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, true);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function resetGame() {
  state.player.x = 0;
  state.player.z = 0;
  state.player.rotation = 0;
  state.player.speed = 0;
  state.activeCastle = null;
  state.lastHudId = "";
  updateHud(null, true);
}

function update(dt) {
  updateMovement(dt);
  updateCastleTrigger();
  updateTheme();
  updatePlayer(dt);
  updateCamera(dt);
  animateWorld(dt);
}

function updateMovement(dt) {
  const forward = (keys.has("ArrowUp") || keys.has("w") || keys.has("W") ? 1 : 0) - (keys.has("ArrowDown") || keys.has("s") || keys.has("S") ? 1 : 0);
  const strafe = (keys.has("ArrowRight") || keys.has("d") || keys.has("D") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("a") || keys.has("A") ? 1 : 0);
  const length = Math.hypot(strafe, forward);
  const sprint = keys.has("Shift") ? 1.45 : 1;
  const speed = 10.5 * sprint;

  if (length > 0) {
    const nx = strafe / length;
    const nz = -forward / length;
    state.player.x += nx * speed * dt;
    state.player.z += nz * speed * dt;
    state.player.rotation = Math.atan2(nx, nz);
    state.player.speed = THREE.MathUtils.lerp(state.player.speed, speed, Math.min(1, dt * 8));
  } else {
    state.player.speed = THREE.MathUtils.lerp(state.player.speed, 0, Math.min(1, dt * 8));
  }

  state.player.x = THREE.MathUtils.clamp(state.player.x, -worldBounds, worldBounds);
  state.player.z = THREE.MathUtils.clamp(state.player.z, -worldBounds, worldBounds);
}

function updateCastleTrigger() {
  let active = null;
  let bestDistance = Infinity;

  for (const item of castleObjects) {
    const distance = Math.hypot(state.player.x - item.x, state.player.z - item.z);
    const inside = distance <= triggerRadius;
    item.ring.material.opacity = inside ? 1 : 0.72;
    item.ring.scale.setScalar(inside ? 1.04 : 1);
    if (inside && distance < bestDistance) {
      active = item.castle;
      bestDistance = distance;
    }
  }

  if (active) visited.add(active.id);
  state.activeCastle = active;
  updateHud(active);
}

function updateTheme() {
  const target = new THREE.Color(state.activeCastle?.color || "#111827");
  state.themeColor.lerp(target, 0.018);
  scene.background = state.themeColor.clone();
  scene.fog.color.copy(state.themeColor);
}

function updatePlayer(dt) {
  player.position.set(state.player.x, 0, state.player.z);
  player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, state.player.rotation, Math.min(1, dt * 10));
  const bob = Math.sin(clock.elapsedTime * 10) * 0.055 * Math.min(state.player.speed / 8, 1);
  player.position.y = bob;

  const wings = player.userData.wings || [];
  wings.forEach((wing, index) => {
    wing.rotation.z = (index === 0 ? -0.22 : 0.22) + Math.sin(clock.elapsedTime * 8) * 0.06 * (index === 0 ? -1 : 1);
  });
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

function updateHud(castle, force = false) {
  if (!zoneNode || !progressNode || !progressBarNode || !cardKickerNode || !cardTitleNode || !cardCopyNode || !cardListNode) return;
  const hudId = castle?.id || "hub";
  if (!force && state.lastHudId === hudId && Number(progressNode.dataset.count || 0) === visited.size) return;
  state.lastHudId = hudId;
  progressNode.dataset.count = String(visited.size);

  zoneNode.textContent = castle ? `Inside ${castle.shortTitle}` : "Central World";
  progressNode.textContent = `${visited.size}/${castles.length}`;
  progressBarNode.style.width = `${(visited.size / castles.length) * 100}%`;
  cardKickerNode.textContent = castle ? "Castle Data" : "3D World";
  cardTitleNode.textContent = castle ? castle.title : "Walk Into A Castle";
  cardCopyNode.textContent = castle
    ? castle.detail
    : "Move freely around the world. Each castle represents a category, and walking into its ring opens the matching information on this screen.";

  const bullets = castle
    ? castle.bullets
    : ["WASD or arrow keys to move", "Shift to sprint", "R to reset", "F for fullscreen"];
  cardListNode.replaceChildren(...bullets.map((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    return li;
  }));
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

window.addEventListener("keydown", (event) => {
  if (event.key === "f" || event.key === "F") {
    toggleFullscreen();
    return;
  }
  if (event.key === "r" || event.key === "R") {
    resetGame();
    return;
  }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) event.preventDefault();
  keys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

for (const button of document.querySelectorAll("[data-game-key]")) {
  const key = button.dataset.gameKey;
  const press = (event) => {
    event.preventDefault();
    enterMobileFullscreen();
    try {
      button.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is best-effort on touch devices.
    }
    keys.add(key);
    button.classList.add("is-pressed");
  };
  const release = (event) => {
    event.preventDefault();
    try {
      button.releasePointerCapture?.(event.pointerId);
    } catch {
      // Some browsers release capture automatically.
    }
    keys.delete(key);
    button.classList.remove("is-pressed");
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

for (const button of document.querySelectorAll("[data-game-tap]")) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    enterMobileFullscreen();
    resetGame();
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
    resetGame();
  });
}

document.addEventListener("selectstart", (event) => {
  if (event.target.closest?.(".touch-controls")) event.preventDefault();
});

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(1 / 60);
  render();
};

window.render_game_to_text = () => JSON.stringify({
  renderer: "threejs",
  mode: "free-roam-castles",
  active: state.activeCastle?.id || "hub",
  player: {
    x: Number(state.player.x.toFixed(2)),
    z: Number(state.player.z.toFixed(2)),
  },
  visitedCount: visited.size,
  visitedIds: [...visited],
  castleCount: castles.length,
  canvas: {
    width: canvas.width,
    height: canvas.height,
  },
});

render();
requestAnimationFrame(tick);
