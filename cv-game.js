import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("game");
const stage = document.querySelector(".game-stage");
const zoneNode = document.querySelector("[data-game-zone]");
const progressNode = document.querySelector("[data-game-progress]");
const progressBarNode = document.querySelector("[data-game-progress-bar]");
const cardKickerNode = document.querySelector("[data-game-card-kicker]");
const cardTitleNode = document.querySelector("[data-game-card-title]");
const cardCopyNode = document.querySelector("[data-game-card-copy]");
const cardListNode = document.querySelector("[data-game-card-list]");
const keys = new Set();
const jumpKeys = new Set(["ArrowUp", "w", "W", " ", "Space"]);

const sections = [
  {
    id: "bio",
    title: "BIO",
    color: "#f4bf45",
    sky: "#7ab8d4",
    floor: "#78a95f",
    motif: "city",
    detail:
      "Victor Cazacu: Bucharest-born founder, builder, and internet systems person moving through entrepreneurship, crypto, AI, and games.",
    bullets: ["Started with tiny products", "Crypto-native since 2017", "Building AI systems now"],
  },
  {
    id: "company",
    title: "COMPANY OS",
    color: "#f07f2f",
    sky: "#2b1307",
    floor: "#d66a2c",
    motif: "filesystem",
    detail: "Build companies as file systems: context, knowledge bases, agents, cron jobs, monitoring, and human review loops.",
    bullets: ["Process architecture", "Business context", "Human review loops"],
  },
  {
    id: "automation",
    title: "AUTOMATION",
    color: "#7cc77d",
    sky: "#071c20",
    floor: "#1f9d8a",
    motif: "agents",
    detail: "Ship the work before the meeting: enrichment agents, outreach drafts, support copilots, meeting prep, and content pipelines.",
    bullets: ["RevOps agents", "Support copilots", "Distribution loops"],
  },
  {
    id: "cloud",
    title: "AI CLOUD",
    color: "#6ea8d8",
    sky: "#16213e",
    floor: "#576ca8",
    motif: "gpu",
    detail: "Run models locally and in the cloud: GPU VPS machines, containers, Kubernetes pods, monitoring, storage, and model serving.",
    bullets: ["GPU containers", "Kubernetes pods", "Private inference endpoints"],
  },
  {
    id: "crypto",
    title: "CRYPTO",
    color: "#4f70ff",
    sky: "#030614",
    floor: "#345af5",
    motif: "contracts",
    detail: "Build on-chain products across tokens, marketplaces, gaming loops, prediction markets, reputation, payments, and communities.",
    bullets: ["200K+ community funding", "50K Polygon grant", "x402-style payments"],
  },
  {
    id: "content",
    title: "CONTENT",
    color: "#d95f9d",
    sky: "#22091f",
    floor: "#a83582",
    motif: "media",
    detail: "Automate video and content for Instagram, TikTok, YouTube, image models, repurposing systems, and growth experiments.",
    bullets: ["Short-form workflows", "Creative agents", "Repurposing pipelines"],
  },
  {
    id: "projects",
    title: "PROJECTS",
    color: "#6fd18c",
    sky: "#061913",
    floor: "#29a164",
    motif: "market",
    detail: "Active builds include Arkadia Park, Baguri, Grand Cafe Bucharest, pump-bump, clip-ro, Marketz.ro, libergent, and commerce systems.",
    bullets: ["Arkadia Park", "Baguri and Marketz", "libergent / pump-bump"],
  },
  {
    id: "oss",
    title: "OSS",
    color: "#7dd3fc",
    sky: "#0b1524",
    floor: "#456783",
    motif: "oss",
    detail: "Open source stack I keep close: Linux, Docker, Kubernetes, ComfyUI, Uptime Kuma, Ultimate Vocal Remover, Gaussian, and wc3ui.",
    bullets: ["Linux foundations", "ComfyUI workflows", "Monitoring and media tools"],
  },
  {
    id: "games",
    title: "GAMES",
    color: "#fb7185",
    sky: "#240812",
    floor: "#b8324c",
    motif: "worlds",
    detail: "Build games as living economies: mechanics, 3D models, progression, lore, communities, and distribution loops.",
    bullets: ["Game systems", "Worldbuilding", "Player economies"],
  },
  {
    id: "contact",
    title: "CONTACT",
    color: "#b58bd9",
    sky: "#25153d",
    floor: "#8b6fd1",
    motif: "signal",
    detail: "Find the rest of the site through vicorico.fun, the CV page, Game CV, GitHub, and X.",
    bullets: ["github.com/Vicorico17", "x.com/Vicorico17", "vicorico.fun"],
  },
];

const spacing = 26;
const startZ = 12;
const finishZ = -((sections.length - 1) * spacing + 18);
const clock = new THREE.Clock();
const worldObjects = [];
const sectionObjects = [];
const revealed = new Set();

const state = {
  mode: "title",
  activeIndex: 0,
  lastHudIndex: -1,
  lastHudProgress: -1,
  lastHudMode: "",
  themeColor: new THREE.Color(sections[0].sky),
  player: {
    x: 0,
    y: 0.85,
    z: startZ,
    vx: 0,
    vy: 0,
    grounded: true,
    laneLean: 0,
  },
};

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = state.themeColor.clone();
scene.fog = new THREE.Fog(state.themeColor.clone(), 18, 92);

const camera = new THREE.PerspectiveCamera(56, 16 / 9, 0.1, 240);
camera.position.set(0, 7.6, 21);

const ambient = new THREE.HemisphereLight(0xffffff, 0x151923, 1.6);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
keyLight.position.set(7, 12, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 80;
keyLight.shadow.camera.left = -36;
keyLight.shadow.camera.right = 36;
keyLight.shadow.camera.top = 36;
keyLight.shadow.camera.bottom = -36;
scene.add(keyLight);

const routeGroup = new THREE.Group();
const decorGroup = new THREE.Group();
scene.add(routeGroup, decorGroup);

const player = createPlayer();
scene.add(player);

buildRoute();
buildStars();
resize();
updateHud(0, true);
window.addEventListener("resize", resize);

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.52,
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

function buildRoute() {
  const railMat = material("#111827", { metalness: 0.2, roughness: 0.42 });
  const edgeMat = material("#f4bf45", { emissive: "#f4bf45", emissiveIntensity: 0.35 });

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const z = sectionZ(i);
    const floor = makeBox(9, 0.35, 16, section.floor, 0, -0.18, z, { roughness: 0.58 });
    routeGroup.add(floor);

    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 16), edgeMat);
    const rightRail = leftRail.clone();
    leftRail.position.set(-4.8, 0.12, z);
    rightRail.position.set(4.8, 0.12, z);
    routeGroup.add(leftRail, rightRail);

    if (i < sections.length - 1) {
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, spacing - 16), railMat);
      bridge.position.set(0, -0.08, z - spacing / 2);
      bridge.receiveShadow = true;
      routeGroup.add(bridge);
    }

    const station = buildStation(section, i, z);
    sectionObjects.push(station);
    decorGroup.add(station.group);
  }
}

function buildStation(section, index, z) {
  const group = new THREE.Group();
  const color = new THREE.Color(section.color);
  const portalMat = material(section.color, { emissive: section.color, emissiveIntensity: 0.72, metalness: 0.28, roughness: 0.26 });
  const glassMat = material("#ffffff", { transparent: true, opacity: 0.14, roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide });
  const darkMat = material("#070b12", { roughness: 0.48, metalness: 0.14 });

  const gate = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.08, 14, 84), portalMat);
  gate.position.set(0, 3.4, z - 3.2);
  gate.rotation.x = Math.PI / 2;
  gate.castShadow = true;
  gate.userData.spin = 0.28 + index * 0.015;

  const innerGate = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.035, 10, 64), portalMat);
  innerGate.position.copy(gate.position);
  innerGate.rotation.x = Math.PI / 2;
  innerGate.userData.spin = -0.44;

  const monolith = makeBox(2.2, 4.2, 0.46, "#080b10", 3.2, 2.1, z + 1.3, {
    emissive: section.color,
    emissiveIntensity: 0.12,
    metalness: 0.25,
    roughness: 0.34,
  });
  monolith.userData.baseY = monolith.position.y;

  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 2.7), glassMat);
  face.position.set(3.2, 2.38, z + 1.05);
  face.rotation.y = Math.PI;

  const label = makeTextSprite(section.title, {
    background: "rgba(5, 7, 12, 0.72)",
    color: "#ffffff",
    height: 1.0,
    fontSize: 62,
  });
  label.position.set(3.2, 4.75, z + 0.85);

  const indexLabel = makeTextSprite(String(index + 1).padStart(2, "0"), {
    color: section.color,
    height: 0.72,
    fontSize: 70,
  });
  indexLabel.position.set(-3.2, 3.8, z + 1.2);

  const beacon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), portalMat);
  beacon.position.set(0, 2.6, z + 1.3);
  beacon.userData.baseY = beacon.position.y;

  const base = makeBox(3.4, 0.22, 1.4, section.color, 0, 0.28, z + 1.3, {
    emissive: section.color,
    emissiveIntensity: 0.24,
  });

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), darkMat);
  shadow.position.set(0, 0.03, z + 1.3);
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.y = 0.28;

  group.add(gate, innerGate, monolith, face, label, indexLabel, beacon, base, shadow);
  addMotif(group, section, index, z, color);

  worldObjects.push(gate, innerGate, monolith, beacon);
  return { group, gate, innerGate, monolith, beacon, section, index, z, revealed: false };
}

function addMotif(group, section, index, z, color) {
  const accent = section.color;
  const side = index % 2 === 0 ? -1 : 1;
  const xBase = side * 7.2;
  const motif = new THREE.Group();
  motif.position.z = z + 0.8;

  if (section.motif === "city") {
    for (let i = 0; i < 7; i += 1) {
      motif.add(makeBox(0.9, 1.4 + i * 0.22, 0.9, i % 2 ? "#315b75" : "#213927", xBase + i * 0.58 * side, 0.7 + i * 0.11, -4 + i * 0.9));
    }
  } else if (section.motif === "filesystem") {
    for (let i = 0; i < 4; i += 1) {
      const folder = makeBox(1.6, 0.84, 0.22, accent, xBase, 1 + i * 0.52, -4.5 + i * 1.8, {
        emissive: accent,
        emissiveIntensity: 0.18,
      });
      motif.add(folder);
      motif.add(makeLine([[xBase, 1 + i * 0.52, -3.7 + i * 1.8], [xBase - side * 1.2, 1.6 + i * 0.42, -2.8 + i * 1.8]], accent));
    }
  } else if (section.motif === "agents") {
    const points = [
      [xBase, 1.2, -4],
      [xBase - side * 1.4, 2.2, -2.7],
      [xBase + side * 0.9, 2.8, -1.2],
      [xBase - side * 0.4, 1.6, 0.6],
    ];
    for (const point of points) {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), material(accent, { emissive: accent, emissiveIntensity: 0.7 }));
      node.position.set(...point);
      motif.add(node);
    }
    for (let i = 0; i < points.length - 1; i += 1) motif.add(makeLine([points[i], points[i + 1]], accent));
  } else if (section.motif === "gpu") {
    const board = makeBox(3.2, 1.9, 0.18, "#17252b", xBase, 1.7, -2.8, { emissive: accent, emissiveIntensity: 0.1 });
    motif.add(board);
    for (let i = 0; i < 6; i += 1) motif.add(makeBox(0.28, 0.42, 0.08, accent, xBase - 1.1 + i * 0.44, 1.7, -2.65, { emissive: accent, emissiveIntensity: 0.35 }));
  } else if (section.motif === "contracts") {
    for (let i = 0; i < 3; i += 1) {
      const slab = makeBox(1.18, 1.68, 0.12, "#f8fbff", xBase + i * 0.56 * side, 1.55 + i * 0.1, -4 + i * 1.4);
      slab.rotation.y = side * 0.22;
      motif.add(slab);
      motif.add(makeLine([[slab.position.x - 0.34, slab.position.y, slab.position.z - 0.1], [slab.position.x + 0.34, slab.position.y, slab.position.z - 0.1]], accent));
    }
  } else if (section.motif === "media") {
    for (let i = 0; i < 4; i += 1) {
      const screen = makeBox(1.7, 1.05, 0.1, "#05070c", xBase, 1.45 + i * 0.18, -4.5 + i * 1.55, { emissive: accent, emissiveIntensity: 0.12 });
      screen.rotation.y = side * 0.24;
      motif.add(screen);
      const play = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 3), material(accent, { emissive: accent, emissiveIntensity: 0.5 }));
      play.position.set(screen.position.x, screen.position.y, screen.position.z - 0.12);
      play.rotation.z = Math.PI / 2;
      motif.add(play);
    }
  } else if (section.motif === "market") {
    for (let i = 0; i < 3; i += 1) {
      motif.add(makeBox(1.8, 0.95, 0.8, "#11251d", xBase + i * 0.9 * side, 0.55, -4.2 + i * 1.8));
      motif.add(makeBox(1.95, 0.18, 1.05, accent, xBase + i * 0.9 * side, 1.15, -4.2 + i * 1.8, { emissive: accent, emissiveIntensity: 0.26 }));
    }
  } else if (section.motif === "oss") {
    for (let i = 0; i < 8; i += 1) {
      const cube = makeBox(0.54, 0.54, 0.54, i % 2 ? accent : "#101827", xBase + Math.sin(i) * 1.4, 0.5 + (i % 3) * 0.58, -5 + i * 0.9, {
        emissive: i % 2 ? accent : "#000000",
        emissiveIntensity: i % 2 ? 0.22 : 0,
      });
      cube.rotation.set(i * 0.2, i * 0.3, 0);
      motif.add(cube);
    }
  } else if (section.motif === "worlds") {
    for (let i = 0; i < 5; i += 1) {
      const peak = new THREE.Mesh(new THREE.ConeGeometry(0.8 + i * 0.08, 2 + i * 0.2, 4), material(i % 2 ? accent : "#280912", { emissive: accent, emissiveIntensity: i % 2 ? 0.14 : 0 }));
      peak.position.set(xBase + i * 0.65 * side, 1, -5 + i * 1.3);
      peak.rotation.y = Math.PI / 4;
      peak.castShadow = true;
      motif.add(peak);
    }
  } else if (section.motif === "signal") {
    for (let i = 0; i < 4; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62 + i * 0.42, 0.018, 8, 48), material(accent, { emissive: accent, emissiveIntensity: 0.52 }));
      ring.position.set(xBase, 2.1, -3);
      ring.rotation.y = Math.PI / 2;
      ring.scale.x = 0.72;
      motif.add(ring);
      worldObjects.push(ring);
    }
  }

  group.add(motif);
}

function makeLine(points, color) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(...point)));
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.72 }));
  return line;
}

function buildStars() {
  const count = 850;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = Math.random() * 38 + 3;
    positions[i * 3 + 2] = startZ - Math.random() * (Math.abs(finishZ) + 95);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.07,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    }),
  );
  scene.add(stars);
  worldObjects.push(stars);
}

function sectionZ(index) {
  return -index * spacing;
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, true);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function startGame() {
  if (state.mode === "complete") resetGame();
  if (state.mode === "title") state.mode = "play";
}

function resetGame() {
  revealed.clear();
  state.mode = "play";
  state.activeIndex = 0;
  state.lastHudIndex = -1;
  Object.assign(state.player, {
    x: 0,
    y: 0.85,
    z: startZ,
    vx: 0,
    vy: 0,
    grounded: true,
    laneLean: 0,
  });
  for (const station of sectionObjects) station.revealed = false;
  updateHud(0, true);
}

function queueJump() {
  startGame();
  if (!state.player.grounded) return;
  state.player.vy = 8.4;
  state.player.grounded = false;
}

function update(dt) {
  const playerState = state.player;
  const steer = (keys.has("ArrowRight") || keys.has("d") || keys.has("D") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("a") || keys.has("A") ? 1 : 0);
  const braking = keys.has("ArrowDown") || keys.has("s") || keys.has("S");
  const sprinting = keys.has("Shift");
  const speed = state.mode === "play" ? (braking ? 3.6 : sprinting ? 11.5 : 7.2) : 0;

  playerState.vx += steer * 18 * dt;
  playerState.vx *= Math.pow(0.0018, dt);
  playerState.x += playerState.vx * dt;
  playerState.x = THREE.MathUtils.clamp(playerState.x, -3.55, 3.55);
  playerState.z -= speed * dt;

  if (!playerState.grounded) {
    playerState.vy -= 22 * dt;
    playerState.y += playerState.vy * dt;
    if (playerState.y <= 0.85) {
      playerState.y = 0.85;
      playerState.vy = 0;
      playerState.grounded = true;
    }
  }

  if (playerState.z <= finishZ) {
    playerState.z = finishZ;
    state.mode = "complete";
  }

  const nearest = nearestSectionIndex(playerState.z);
  state.activeIndex = nearest;
  maybeReveal(nearest);
  updateTheme(sections[nearest]);
  updatePlayer(dt);
  updateCamera(dt);
  animateWorld(dt);
  updateHud(nearest);
}

function nearestSectionIndex(z) {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < sections.length; i += 1) {
    const distance = Math.abs(z - (sectionZ(i) + 1.2));
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestIndex;
}

function maybeReveal(index) {
  const station = sectionObjects[index];
  if (!station || station.revealed) return;
  const distance = Math.abs(state.player.z - (station.z + 1.2));
  if (distance > 6.2) return;
  station.revealed = true;
  revealed.add(station.section.id);
  flashStation(station);
}

function flashStation(station) {
  station.beacon.scale.setScalar(1.75);
  station.gate.scale.setScalar(1.16);
  station.innerGate.scale.setScalar(1.2);
}

function updateTheme(section) {
  const target = new THREE.Color(section.sky);
  state.themeColor.lerp(target, 0.035);
  scene.background = state.themeColor.clone();
  scene.fog.color.copy(state.themeColor);
}

function updatePlayer(dt) {
  const p = state.player;
  player.position.set(p.x, p.y, p.z);
  p.laneLean = THREE.MathUtils.lerp(p.laneLean, -p.vx * 0.035, Math.min(1, dt * 9));
  player.rotation.z = THREE.MathUtils.clamp(p.laneLean, -0.32, 0.32);
  player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, -p.vx * 0.018, Math.min(1, dt * 8));

  const wings = player.userData.wings || [];
  wings.forEach((wing, index) => {
    wing.rotation.z = (index === 0 ? -0.22 : 0.22) + Math.sin(clock.elapsedTime * 14) * 0.16 * (index === 0 ? -1 : 1);
    wing.visible = !p.grounded || state.mode !== "title";
  });
}

function updateCamera(dt) {
  const p = state.player;
  const desired = new THREE.Vector3(p.x * 0.36, 7.8 + Math.max(0, p.y - 0.85) * 0.28, p.z + 18);
  camera.position.lerp(desired, Math.min(1, dt * 5.2));
  const look = new THREE.Vector3(p.x * 0.58, 2.4, p.z - 10);
  camera.lookAt(look);
}

function animateWorld(dt) {
  const time = clock.elapsedTime;
  for (const object of worldObjects) {
    if (object.isPoints) {
      object.rotation.y += dt * 0.012;
      continue;
    }
    if (object.geometry?.type === "TorusGeometry") object.rotation.z += (object.userData.spin || 0.22) * dt;
    if (object.userData.baseY !== undefined) object.position.y = object.userData.baseY + Math.sin(time * 2.2 + object.position.z) * 0.12;
    object.scale.lerp(new THREE.Vector3(1, 1, 1), Math.min(1, dt * 5));
  }
}

function updateHud(index, force = false) {
  if (!zoneNode || !progressNode || !progressBarNode || !cardKickerNode || !cardTitleNode || !cardCopyNode || !cardListNode) return;
  const section = sections[index];
  const progress = revealed.size;
  if (!force && state.lastHudIndex === index && state.lastHudProgress === progress && state.lastHudMode === state.mode) return;
  state.lastHudIndex = index;
  state.lastHudProgress = progress;
  state.lastHudMode = state.mode;
  zoneNode.textContent = state.mode === "complete" ? "All worlds unlocked" : section.title;
  progressNode.textContent = `${progress}/${sections.length}`;
  progressBarNode.style.width = `${(progress / sections.length) * 100}%`;
  cardKickerNode.textContent = state.mode === "title" ? "3D Game CV" : `World ${String(index + 1).padStart(2, "0")}`;
  cardTitleNode.textContent = state.mode === "complete" ? "All Worlds Unlocked" : section.title;
  cardCopyNode.textContent =
    state.mode === "title"
      ? "Move through the 3D CV map to unlock each part of the story."
      : state.mode === "complete"
        ? "The 3D CV route is complete. Restart to run the world again."
        : section.detail;
  cardListNode.replaceChildren(...section.bullets.map((bullet) => {
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
  if (event.key === "Enter") {
    startGame();
    return;
  }
  if (event.key === "r" || event.key === "R") {
    resetGame();
    return;
  }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Space"].includes(event.key)) event.preventDefault();
  if (jumpKeys.has(event.key) && !keys.has(event.key)) queueJump();
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
    if (jumpKeys.has(key) && !keys.has(key)) queueJump();
    keys.add(key);
    button.classList.add("is-pressed");
    startGame();
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
    startGame();
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
    startGame();
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
  mode: state.mode,
  active: sections[state.activeIndex].id,
  player: {
    x: Number(state.player.x.toFixed(2)),
    y: Number(state.player.y.toFixed(2)),
    z: Number(state.player.z.toFixed(2)),
  },
  revealedCount: revealed.size,
  revealedIds: [...revealed],
  sectionCount: sections.length,
  canvas: {
    width: canvas.width,
    height: canvas.height,
  },
});

render();
requestAnimationFrame(tick);
