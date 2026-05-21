(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const keys = new Set();

  const sections = [
    {
      id: "bio",
      title: "BIO",
      color: "#f4bf45",
      detail:
        "Founder turned engineer and marketer in Bucharest building local-first AI tools, crypto tooling, and creative automation.",
    },
    {
      id: "study",
      title: "STUDY",
      color: "#7cc77d",
      detail:
        "Focused on AI cloud engineering: Kubernetes, GPU containers, AWS, Linux, security, smart contracts, and x402.",
    },
    {
      id: "experience",
      title: "WORK",
      color: "#e86f51",
      detail:
        "Crypto-native since 2017. Raised 200K+ in community funding, won a 50K Polygon grant, and ships AI automation systems.",
    },
    {
      id: "projects",
      title: "PROJECTS",
      color: "#6ea8d8",
      detail:
        "libergent, baguri, Grand Cafe Bucharest, pump-bump, ComfyUI workflows, audio/video automation, and creative agents.",
    },
    {
      id: "contact",
      title: "CONTACT",
      color: "#b58bd9",
      detail:
        "hello@vicorico.fun | vicorico.fun | github.com/Vicorico17 | Bucharest, Romania and remote.",
    },
  ];

  const state = {
    mode: "title",
    cameraX: 0,
    activeId: null,
    revealedCount: 0,
    messageTimer: 0,
    lastTime: 0,
    player: {
      x: 72,
      y: 346,
      w: 34,
      h: 46,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1,
    },
    platforms: [
      { x: 0, y: 452, w: 1820, h: 88 },
      { x: 260, y: 370, w: 120, h: 20 },
      { x: 700, y: 350, w: 142, h: 20 },
      { x: 1150, y: 382, w: 132, h: 20 },
      { x: 1530, y: 330, w: 150, h: 20 },
    ],
    blocks: [],
  };

  state.blocks = sections.map((section, index) => ({
    ...section,
    x: 238 + index * 300,
    y: index % 2 === 0 ? 246 : 214,
    w: 58,
    h: 58,
    revealed: false,
    bump: 0,
  }));

  function resetGame() {
    state.mode = "play";
    state.cameraX = 0;
    state.activeId = null;
    state.revealedCount = 0;
    state.messageTimer = 0;
    Object.assign(state.player, {
      x: 72,
      y: 346,
      w: 34,
      h: 46,
      vx: 0,
      vy: 0,
      grounded: false,
      facing: 1,
    });
    for (const block of state.blocks) {
      block.revealed = false;
      block.bump = 0;
    }
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function reveal(block) {
    if (!block.revealed) {
      block.revealed = true;
      state.revealedCount += 1;
    }
    block.bump = 1;
    state.activeId = block.id;
    state.messageTimer = 6;
  }

  function update(dt) {
    if (state.mode === "title") {
      if (keys.has("Enter") || keys.has(" ") || keys.has("Space")) resetGame();
      return;
    }

    if (keys.has("r") || keys.has("R")) resetGame();

    const player = state.player;
    const accel = 1450;
    const friction = player.grounded ? 0.78 : 0.92;
    const maxSpeed = 255;
    const gravity = 1550;
    const jumpPower = -610;

    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
      player.vx -= accel * dt;
      player.facing = -1;
    }
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
      player.vx += accel * dt;
      player.facing = 1;
    }
    player.vx *= friction;
    player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));

    if ((keys.has("ArrowUp") || keys.has("w") || keys.has("W") || keys.has(" ") || keys.has("Space")) && player.grounded) {
      player.vy = jumpPower;
      player.grounded = false;
    }

    player.vy += gravity * dt;
    player.x += player.vx * dt;

    for (const platform of state.platforms) {
      if (!rectsOverlap(player, platform)) continue;
      if (player.vx > 0) player.x = platform.x - player.w;
      if (player.vx < 0) player.x = platform.x + platform.w;
      player.vx = 0;
    }

    player.y += player.vy * dt;
    player.grounded = false;

    for (const platform of state.platforms) {
      if (!rectsOverlap(player, platform)) continue;
      if (player.vy > 0) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.grounded = true;
      } else if (player.vy < 0) {
        player.y = platform.y + platform.h;
        player.vy = 0;
      }
    }

    for (const block of state.blocks) {
      const blockRect = { x: block.x, y: block.y + block.bump * -8, w: block.w, h: block.h };
      if (!rectsOverlap(player, blockRect)) continue;
      const wasBelow = player.y > blockRect.y + blockRect.h - 18 && player.vy < 0;
      if (wasBelow) {
        player.y = blockRect.y + blockRect.h;
        player.vy = 85;
        reveal(block);
      } else if (player.vy > 0 && player.y + player.h < blockRect.y + 22) {
        player.y = blockRect.y - player.h;
        player.vy = 0;
        player.grounded = true;
      } else if (player.x + player.w / 2 < blockRect.x + blockRect.w / 2) {
        player.x = blockRect.x - player.w;
        player.vx = 0;
      } else {
        player.x = blockRect.x + blockRect.w;
        player.vx = 0;
      }
    }

    if (player.y > H + 140) {
      player.x = Math.max(42, player.x - 180);
      player.y = 320;
      player.vx = 0;
      player.vy = 0;
    }
    player.x = Math.max(20, Math.min(1760, player.x));

    for (const block of state.blocks) {
      block.bump = Math.max(0, block.bump - dt * 5.5);
    }
    state.messageTimer = Math.max(0, state.messageTimer - dt);

    const targetCamera = Math.max(0, Math.min(900, player.x - W * 0.42));
    state.cameraX += (targetCamera - state.cameraX) * Math.min(1, dt * 8);
  }

  function drawText(text, x, y, size, color, align = "left", weight = 800) {
    ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(text, x, y, maxWidth, lineHeight, color, size = 18) {
    ctx.font = `700 ${size}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#8fcfe2");
    gradient.addColorStop(0.62, "#d6eef0");
    gradient.addColorStop(1, "#eef2e6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff";
    for (const cloud of [
      { x: 80, y: 70, s: 1 },
      { x: 430, y: 92, s: 0.8 },
      { x: 760, y: 58, s: 1.1 },
    ]) {
      const x = (cloud.x - state.cameraX * 0.25 + 1200) % 1200 - 120;
      ctx.beginPath();
      ctx.arc(x, cloud.y, 26 * cloud.s, 0, Math.PI * 2);
      ctx.arc(x + 28 * cloud.s, cloud.y - 12 * cloud.s, 32 * cloud.s, 0, Math.PI * 2);
      ctx.arc(x + 62 * cloud.s, cloud.y, 24 * cloud.s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#78a95f";
    ctx.fillRect(0, 436, W, 104);
  }

  function drawWorld() {
    const cam = state.cameraX;
    ctx.save();
    ctx.translate(-cam, 0);

    for (const platform of state.platforms) {
      ctx.fillStyle = "#6d8b4f";
      ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
      ctx.fillStyle = "#365a3d";
      ctx.fillRect(platform.x, platform.y, platform.w, 8);
      ctx.strokeStyle = "#213927";
      ctx.lineWidth = 3;
      ctx.strokeRect(platform.x, platform.y, platform.w, platform.h);
    }

    for (const block of state.blocks) {
      const y = block.y + block.bump * -8;
      ctx.fillStyle = block.revealed ? "#f6f1d2" : block.color;
      ctx.strokeStyle = "#17252b";
      ctx.lineWidth = 4;
      ctx.fillRect(block.x, y, block.w, block.h);
      ctx.strokeRect(block.x, y, block.w, block.h);
      drawText(block.revealed ? "!" : "?", block.x + block.w / 2, y + 8, 34, "#17252b", "center", 900);
      drawText(block.title, block.x + block.w / 2, y - 31, 13, "#17252b", "center", 900);
    }

    const p = state.player;
    ctx.fillStyle = "#315b75";
    ctx.fillRect(p.x + 7, p.y + 14, 20, 28);
    ctx.fillStyle = "#e65f3f";
    ctx.fillRect(p.x + 3, p.y + 8, 28, 16);
    ctx.fillStyle = "#f3c58f";
    ctx.fillRect(p.x + 8, p.y, 18, 16);
    ctx.fillStyle = "#17252b";
    ctx.fillRect(p.facing === 1 ? p.x + 22 : p.x + 8, p.y + 5, 4, 4);
    ctx.fillStyle = "#17252b";
    ctx.fillRect(p.x + 3, p.y + 42, 10, 5);
    ctx.fillRect(p.x + 21, p.y + 42, 10, 5);

    ctx.restore();
  }

  function drawHud() {
    ctx.fillStyle = "rgb(255 255 255 / 0.9)";
    roundedRect(20, 18, 272, 62, 8);
    ctx.fill();
    ctx.strokeStyle = "#17252b";
    ctx.lineWidth = 2;
    ctx.stroke();
    drawText("VICORICO QUEST", 36, 28, 22, "#17252b", "left", 900);
    drawText(`${state.revealedCount}/${state.blocks.length} details found`, 36, 54, 15, "#3d4b50", "left", 700);

    const active = state.blocks.find((block) => block.id === state.activeId);
    if (active && state.messageTimer > 0) {
      ctx.fillStyle = "rgb(255 255 255 / 0.96)";
      roundedRect(330, 22, 590, 116, 8);
      ctx.fill();
      ctx.strokeStyle = active.color;
      ctx.lineWidth = 5;
      ctx.stroke();
      drawText(active.title, 354, 40, 22, "#17252b", "left", 900);
      wrapText(active.detail, 354, 72, 520, 21, "#24363d", 16);
    }

    if (state.revealedCount === state.blocks.length) {
      ctx.fillStyle = "rgb(23 37 43 / 0.9)";
      roundedRect(326, 438, 310, 56, 8);
      ctx.fill();
    drawText("Vicorico CV unlocked", 481, 454, 19, "#fff8de", "center", 900);
    }
  }

  function drawTitle() {
    drawBackground();
    drawWorld();
    ctx.fillStyle = "rgb(238 242 230 / 0.9)";
    ctx.fillRect(0, 0, W, H);
    drawText("VICORICO QUEST", W / 2, 108, 54, "#17252b", "center", 900);
    drawText("A platformer CV for AI infrastructure, cloud, and crypto tooling", W / 2, 178, 22, "#415158", "center", 800);
    ctx.fillStyle = "#fffdf2";
    roundedRect(255, 242, 450, 142, 8);
    ctx.fill();
    ctx.strokeStyle = "#17252b";
    ctx.lineWidth = 3;
    ctx.stroke();
    drawText("Move: A/D or arrows", W / 2, 268, 22, "#17252b", "center", 800);
    drawText("Jump: W, Up, or Space", W / 2, 304, 22, "#17252b", "center", 800);
    drawText("Hit blocks from below to reveal CV details", W / 2, 340, 20, "#415158", "center", 750);
    drawText("Press Enter to start", W / 2, 420, 24, "#e65f3f", "center", 900);
  }

  function render() {
    if (state.mode === "title") {
      drawTitle();
      return;
    }
    drawBackground();
    drawWorld();
    drawHud();
  }

  function tick(time) {
    const dt = Math.min(0.033, (time - state.lastTime) / 1000 || 1 / 60);
    state.lastTime = time;
    update(dt);
    render();
    requestAnimationFrame(tick);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "f" || event.key === "F") {
      toggleFullscreen();
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "Space"].includes(event.key)) {
      event.preventDefault();
    }
    keys.add(event.key);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key);
  });

  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i += 1) update(1 / 60);
    render();
  };

  window.render_game_to_text = () => {
    const visibleBlocks = state.blocks
      .filter((block) => block.x + block.w > state.cameraX && block.x < state.cameraX + W)
      .map((block) => ({
        id: block.id,
        title: block.title,
        x: Math.round(block.x),
        y: Math.round(block.y),
        revealed: block.revealed,
      }));
    return JSON.stringify({
      coordinates: "origin top-left, x right, y down",
      mode: state.mode,
      cameraX: Math.round(state.cameraX),
      player: {
        x: Math.round(state.player.x),
        y: Math.round(state.player.y),
        vx: Math.round(state.player.vx),
        vy: Math.round(state.player.vy),
        grounded: state.player.grounded,
      },
      visibleBlocks,
      activeId: state.activeId,
      revealedCount: state.revealedCount,
    });
  };

  render();
  requestAnimationFrame(tick);
})();
