(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const startsInTouchLayout = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  if (startsInTouchLayout) {
    canvas.width = 720;
    canvas.height = 540;
  }
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const keys = new Set();
  const jumpKeys = new Set(["ArrowUp", "w", "W", " ", "Space"]);

  const sections = [
    {
      id: "bio",
      title: "BIO",
      color: "#f4bf45",
      theme: {
        skyTop: "#9ed5e6",
        skyMid: "#d7f0f0",
        ground: "#78a95f",
        platform: "#6d8b4f",
        trim: "#365a3d",
        motif: "city",
      },
      detail:
        "Founder turned engineer and marketer in Bucharest building local-first AI tools, crypto tooling, and creative automation.",
      bullets: ["Bucharest / remote", "Local-first AI", "AI x crypto products"],
    },
    {
      id: "study",
      title: "STUDY",
      color: "#7cc77d",
      theme: {
        skyTop: "#16213e",
        skyMid: "#344a7a",
        ground: "#25324f",
        platform: "#576ca8",
        trim: "#8bd3ff",
        motif: "orbits",
      },
      detail:
        "Focused on AI cloud engineering: Kubernetes, GPU containers, AWS, Linux, security, smart contracts, and x402.",
      bullets: ["Kubernetes and GPU containers", "AWS, Linux, security", "Smart contracts and x402"],
    },
    {
      id: "experience",
      title: "WORK",
      color: "#e86f51",
      theme: {
        skyTop: "#2b1412",
        skyMid: "#7b2d21",
        ground: "#4b2c23",
        platform: "#b95d3b",
        trim: "#ffd166",
        motif: "network",
      },
      detail:
        "Crypto-native since 2017. Raised 200K+ in community funding, won a 50K Polygon grant, and ships AI automation systems.",
      bullets: ["Crypto-native since 2017", "200K+ community funding", "50K Polygon grant"],
    },
    {
      id: "projects",
      title: "PROJECTS",
      color: "#6ea8d8",
      theme: {
        skyTop: "#062822",
        skyMid: "#0f766e",
        ground: "#143b35",
        platform: "#1f9d8a",
        trim: "#d4f7e7",
        motif: "terminal",
      },
      detail:
        "libergent, baguri, Grand Cafe Bucharest, pump-bump, ComfyUI workflows, audio/video automation, and creative agents.",
      bullets: ["libergent and baguri", "Grand Cafe Bucharest", "pump-bump and creative AI"],
    },
    {
      id: "contact",
      title: "CONTACT",
      color: "#b58bd9",
      theme: {
        skyTop: "#25153d",
        skyMid: "#6d4ea2",
        ground: "#33244f",
        platform: "#8b6fd1",
        trim: "#f2e9ff",
        motif: "signal",
      },
      detail:
        "hello@vicorico.fun | vicorico.fun | github.com/Vicorico17 | Bucharest, Romania and remote.",
      bullets: ["hello@vicorico.fun", "github.com/Vicorico17", "vicorico.fun"],
    },
  ];

  const defaultTheme = {
    skyTop: "#8fcfe2",
    skyMid: "#d6eef0",
    ground: "#78a95f",
    platform: "#6d8b4f",
    trim: "#365a3d",
    motif: "clouds",
  };

  const state = {
    mode: "title",
    cameraX: 0,
    activeId: null,
    themeId: null,
    revealedCount: 0,
    messageTimer: 0,
    worldTime: 0,
    lastTime: 0,
    player: {
      x: 72,
      y: 406,
      w: 34,
      h: 46,
      vx: 0,
      vy: 0,
      grounded: true,
      facing: 1,
      jumpQueued: false,
      canDoubleJump: true,
      doubleJumped: false,
      wingTimer: 0,
      wingPhase: 0,
    },
    platforms: [
      { x: 0, y: 452, w: 1820, h: 88, move: "static", phase: 0 },
      { x: 210, y: 398, w: 148, h: 20, move: "bob", phase: 0.1 },
      { x: 492, y: 398, w: 148, h: 20, move: "bob", phase: 1.4 },
      { x: 774, y: 398, w: 148, h: 20, move: "bob", phase: 2.7 },
      { x: 1056, y: 398, w: 148, h: 20, move: "bob", phase: 4.0 },
      { x: 1338, y: 398, w: 148, h: 20, move: "bob", phase: 5.3 },
    ],
    blocks: [],
  };

  state.blocks = sections.map((section, index) => ({
    ...section,
    x: 255 + index * 282,
    y: 286,
    w: 58,
    h: 58,
    revealed: false,
    bump: 0,
    hits: 0,
    phase: index * 1.35,
  }));

  function resetGame() {
    state.mode = "play";
    state.cameraX = 0;
    state.activeId = null;
    state.themeId = null;
    state.revealedCount = 0;
    state.messageTimer = 0;
    state.worldTime = 0;
    Object.assign(state.player, {
      x: 72,
      y: 406,
      w: 34,
      h: 46,
      vx: 0,
      vy: 0,
      grounded: true,
      facing: 1,
      jumpQueued: false,
      canDoubleJump: true,
      doubleJumped: false,
      wingTimer: 0,
      wingPhase: 0,
    });
    for (const block of state.blocks) {
      block.revealed = false;
      block.bump = 0;
      block.hits = 0;
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
    block.hits += 1;
    block.bump = 1;
    state.activeId = block.id;
    state.themeId = block.id;
    state.messageTimer = 8;
  }

  function queueJump() {
    if (state.mode === "title") {
      resetGame();
      return;
    }
    state.player.jumpQueued = true;
  }

  function movingPlatformRect(platform) {
    if (platform.move !== "bob") return platform;
    return {
      ...platform,
      y: platform.y + Math.sin(state.worldTime * 1.75 + platform.phase) * 8,
    };
  }

  function movingBlockRect(block) {
    const floatY = Math.sin(state.worldTime * 1.45 + block.phase) * 5;
    const floatX = Math.sin(state.worldTime * 0.75 + block.phase) * 4;
    return {
      ...block,
      x: block.x + floatX,
      y: block.y + floatY + block.bump * -8,
    };
  }

  function update(dt) {
    if (state.mode === "title") {
      if (keys.has("Enter") || keys.has(" ") || keys.has("Space")) resetGame();
      return;
    }

    if (keys.has("r") || keys.has("R")) resetGame();
    state.worldTime += dt;

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

    if (player.jumpQueued) {
      if (player.grounded) {
        player.vy = jumpPower;
        player.grounded = false;
        player.canDoubleJump = true;
        player.doubleJumped = false;
      } else if (player.canDoubleJump) {
        player.vy = jumpPower * 0.92;
        player.canDoubleJump = false;
        player.doubleJumped = true;
        player.wingTimer = 0.85;
      }
      player.jumpQueued = false;
    }

    player.vy += gravity * dt;
    player.wingPhase += dt * 18;
    player.wingTimer = Math.max(0, player.wingTimer - dt);
    player.x += player.vx * dt;

    const previousBottom = player.y + player.h;
    player.y += player.vy * dt;
    player.grounded = false;

    for (const platform of state.platforms) {
      const platformRect = movingPlatformRect(platform);
      if (!rectsOverlap(player, platformRect)) continue;
      if (player.vy > 0 && previousBottom <= platformRect.y + 4) {
        player.y = platformRect.y - player.h;
        player.vy = 0;
        player.grounded = true;
        player.canDoubleJump = true;
        player.doubleJumped = false;
      }
    }

    for (const block of state.blocks) {
      const blockRect = movingBlockRect(block);
      const centerAligned = player.x + player.w * 0.5 > blockRect.x - 32 && player.x + player.w * 0.5 < blockRect.x + blockRect.w + 32;
      const headStrike =
        player.vy < 0 &&
        centerAligned &&
        player.y <= blockRect.y + blockRect.h + 12 &&
        player.y >= blockRect.y + 12;
      if (headStrike) {
        player.y = blockRect.y + blockRect.h;
        player.vy = 85;
        reveal(block);
        continue;
      }
      if (!rectsOverlap(player, blockRect)) continue;
      const wasBelow = player.y > blockRect.y + blockRect.h - 24 && player.vy < 0 && centerAligned;
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
      player.canDoubleJump = true;
      player.doubleJumped = false;
      player.wingTimer = 0;
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

  function activeTheme() {
    const active = state.blocks.find((block) => block.id === state.themeId);
    return active ? active.theme : defaultTheme;
  }

  function drawCloud(x, y, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 26 * s, 0, Math.PI * 2);
    ctx.arc(x + 28 * s, y - 12 * s, 32 * s, 0, Math.PI * 2);
    ctx.arc(x + 62 * s, y, 24 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMotif(theme) {
    ctx.save();
    ctx.globalAlpha = 0.72;

    if (theme.motif === "city") {
      ctx.fillStyle = "rgba(23, 37, 43, 0.24)";
      for (let i = 0; i < 9; i += 1) {
        const x = ((i * 138 - state.cameraX * 0.18) % 1200) - 80;
        const h = 56 + (i % 4) * 18;
        ctx.fillRect(x, 436 - h, 72, h);
        ctx.fillStyle = "rgba(255, 248, 222, 0.48)";
        ctx.fillRect(x + 16, 436 - h + 18, 10, 10);
        ctx.fillRect(x + 42, 436 - h + 38, 10, 10);
        ctx.fillStyle = "rgba(23, 37, 43, 0.24)";
      }
    } else if (theme.motif === "orbits") {
      ctx.strokeStyle = "rgba(139, 211, 255, 0.34)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        const x = 160 + i * 230 - state.cameraX * 0.1;
        ctx.beginPath();
        ctx.ellipse(x, 155, 88 + i * 6, 28 + i * 4, -0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = i % 2 ? "#f4bf45" : "#8bd3ff";
        ctx.beginPath();
        ctx.arc(x + 68, 132 + i * 6, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.motif === "network") {
      ctx.strokeStyle = "rgba(255, 209, 102, 0.38)";
      ctx.fillStyle = "rgba(255, 209, 102, 0.62)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i += 1) {
        const x = 90 + i * 160 - state.cameraX * 0.16;
        const y = 118 + (i % 3) * 42;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 92, y + 30);
        ctx.lineTo(x + 42, y + 92);
        ctx.stroke();
        for (const p of [{ x, y }, { x: x + 92, y: y + 30 }, { x: x + 42, y: y + 92 }]) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (theme.motif === "terminal") {
      for (let i = 0; i < 5; i += 1) {
        const x = 72 + i * 210 - state.cameraX * 0.14;
        ctx.fillStyle = "rgba(3, 19, 16, 0.48)";
        roundedRect(x, 88 + (i % 2) * 42, 150, 88, 6);
        ctx.fill();
        ctx.fillStyle = "rgba(212, 247, 231, 0.72)";
        ctx.fillRect(x + 18, 112 + (i % 2) * 42, 70, 7);
        ctx.fillRect(x + 18, 134 + (i % 2) * 42, 112, 7);
        ctx.fillRect(x + 18, 156 + (i % 2) * 42, 46, 7);
      }
    } else if (theme.motif === "signal") {
      ctx.strokeStyle = "rgba(242, 233, 255, 0.42)";
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i += 1) {
        const x = 130 + i * 190 - state.cameraX * 0.12;
        for (let r = 28; r <= 92; r += 32) {
          ctx.beginPath();
          ctx.arc(x, 172, r, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(242, 233, 255, 0.62)";
        ctx.beginPath();
        ctx.arc(x, 172, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (const cloud of [
        { x: 80, y: 70, s: 1 },
        { x: 430, y: 92, s: 0.8 },
        { x: 760, y: 58, s: 1.1 },
      ]) {
        const x = (cloud.x - state.cameraX * 0.25 + 1200) % 1200 - 120;
        drawCloud(x, cloud.y, cloud.s, "#ffffff");
      }
    }

    ctx.restore();
  }

  function drawBackground() {
    const theme = activeTheme();
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, theme.skyTop);
    gradient.addColorStop(0.62, theme.skyMid);
    gradient.addColorStop(1, "#eef2e6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    drawMotif(theme);

    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, 436, W, 104);
  }

  function drawWorld() {
    const cam = state.cameraX;
    const theme = activeTheme();
    ctx.save();
    ctx.translate(-cam, 0);

    for (const platform of state.platforms) {
      const platformRect = movingPlatformRect(platform);
      ctx.fillStyle = theme.platform;
      ctx.fillRect(platformRect.x, platformRect.y, platformRect.w, platformRect.h);
      ctx.fillStyle = theme.trim;
      ctx.fillRect(platformRect.x, platformRect.y, platformRect.w, 8);
      ctx.strokeStyle = "#213927";
      ctx.lineWidth = 3;
      ctx.strokeRect(platformRect.x, platformRect.y, platformRect.w, platformRect.h);
      if (platform.move === "bob") {
        ctx.strokeStyle = "rgba(23, 37, 43, 0.34)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(platform.x + 12, platform.y + platform.h + 9);
        ctx.quadraticCurveTo(platform.x + platform.w / 2, platform.y + platform.h + 22, platform.x + platform.w - 12, platform.y + platform.h + 9);
        ctx.stroke();
      }
    }

    for (const block of state.blocks) {
      const rect = movingBlockRect(block);
      ctx.fillStyle = block.revealed ? "#f6f1d2" : block.color;
      ctx.strokeStyle = "#17252b";
      ctx.lineWidth = 4;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = "rgba(23, 37, 43, 0.18)";
      ctx.fillRect(rect.x + 8, rect.y + rect.h + 7, rect.w - 16, 4);
      drawText(block.revealed ? "!" : "?", rect.x + rect.w / 2, rect.y + 8, 34, "#17252b", "center", 900);
      drawText(block.title, rect.x + rect.w / 2, rect.y - 31, 13, "#17252b", "center", 900);
    }

    const p = state.player;
    if (p.wingTimer > 0 || p.doubleJumped) {
      const flap = Math.sin(p.wingPhase) * 7;
      const fade = Math.min(1, p.wingTimer * 2.2 + (p.doubleJumped ? 0.35 : 0));
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.fillStyle = "#f8fbff";
      ctx.strokeStyle = "#17252b";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(p.x + 9, p.y + 19);
      ctx.quadraticCurveTo(p.x - 20, p.y + 2 + flap, p.x - 31, p.y + 27 - flap * 0.25);
      ctx.quadraticCurveTo(p.x - 12, p.y + 31, p.x + 9, p.y + 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.x + 25, p.y + 19);
      ctx.quadraticCurveTo(p.x + 54, p.y + 2 + flap, p.x + 65, p.y + 27 - flap * 0.25);
      ctx.quadraticCurveTo(p.x + 46, p.y + 31, p.x + 25, p.y + 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#8bd3ff";
      ctx.globalAlpha = fade * 0.62;
      ctx.fillRect(p.x - 18, p.y + 19 + flap * 0.15, 9, 4);
      ctx.fillRect(p.x + 43, p.y + 19 + flap * 0.15, 9, 4);
      ctx.restore();
    }

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
    const theme = activeTheme();
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
      const panelX = W < 820 ? 132 : 312;
      const panelW = W < 820 ? W - panelX - 22 : 622;
      const textW = panelW - 74;
      ctx.fillStyle = "rgb(255 255 255 / 0.96)";
      roundedRect(panelX, 22, panelW, 166, 8);
      ctx.fill();
      ctx.strokeStyle = active.color;
      ctx.lineWidth = 5;
      ctx.stroke();
      drawText(active.title, panelX + 24, 40, 22, "#17252b", "left", 900);
      wrapText(active.detail, panelX + 24, 72, textW, 20, "#24363d", 15);
      ctx.font = "800 14px Inter, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#17252b";
      active.bullets.forEach((bullet, index) => {
        const y = 120 + index * 18;
        ctx.fillStyle = theme.platform;
        ctx.fillRect(panelX + 24, y + 5, 8, 8);
        ctx.fillStyle = "#17252b";
        ctx.fillText(bullet, panelX + 42, y);
      });
    }

    if (state.revealedCount === state.blocks.length) {
      ctx.fillStyle = "rgb(23 37 43 / 0.9)";
      roundedRect(W / 2 - 155, 438, 310, 56, 8);
      ctx.fill();
      drawText("Vicorico CV unlocked", W / 2, 454, 19, "#fff8de", "center", 900);
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
    roundedRect(235, 242, 490, 156, 8);
    ctx.fill();
    ctx.strokeStyle = "#17252b";
    ctx.lineWidth = 3;
    ctx.stroke();
    drawText("Move: A/D or arrows", W / 2, 268, 22, "#17252b", "center", 800);
    drawText("Jump twice to sprout wings", W / 2, 304, 22, "#17252b", "center", 800);
    drawText("Hit blocks from below to reveal CV details", W / 2, 340, 20, "#415158", "center", 750);
    drawText("Each block changes the whole world", W / 2, 366, 18, "#415158", "center", 750);
    drawText("Press Enter to start", W / 2, 424, 24, "#e65f3f", "center", 900);
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

  function isTouchLayout() {
    return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  }

  function enterMobileFullscreen() {
    if (!isTouchLayout() || document.fullscreenElement) return;
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "f" || event.key === "F") {
      toggleFullscreen();
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "Space"].includes(event.key)) {
      event.preventDefault();
    }
    if (jumpKeys.has(event.key) && !keys.has(event.key)) {
      queueJump();
    }
    keys.add(event.key);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key);
  });

  for (const button of document.querySelectorAll("[data-game-key]")) {
    const key = button.dataset.gameKey;
    let lastPointerPress = 0;
    const press = (event) => {
      event.preventDefault();
      lastPointerPress = performance.now();
      try {
        button.setPointerCapture?.(event.pointerId);
      } catch {
        // Pointer capture is best-effort on mobile browser controls.
      }
      enterMobileFullscreen();
      if (jumpKeys.has(key) && !keys.has(key)) {
        queueJump();
      }
      keys.add(key);
      button.classList.add("is-pressed");
      if (state.mode === "title") resetGame();
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
    button.addEventListener("touchstart", press, { passive: false });
    button.addEventListener("touchend", release, { passive: false });
    button.addEventListener("touchcancel", release, { passive: false });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (performance.now() - lastPointerPress < 350) return;
      enterMobileFullscreen();
      if (jumpKeys.has(key)) queueJump();
    });
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  for (const button of document.querySelectorAll("[data-game-tap]")) {
    let lastPointerPress = 0;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      lastPointerPress = performance.now();
      try {
        button.setPointerCapture?.(event.pointerId);
      } catch {
        // Pointer capture is best-effort on mobile browser controls.
      }
      enterMobileFullscreen();
      if (state.mode === "title") resetGame();
      button.classList.add("is-pressed");
    });
    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      try {
        button.releasePointerCapture?.(event.pointerId);
      } catch {
        // Some browsers release capture automatically.
      }
      button.classList.remove("is-pressed");
    });
    button.addEventListener("pointercancel", () => button.classList.remove("is-pressed"));
    button.addEventListener("pointerleave", () => button.classList.remove("is-pressed"));
    button.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        lastPointerPress = performance.now();
        enterMobileFullscreen();
        if (state.mode === "title") resetGame();
        button.classList.add("is-pressed");
      },
      { passive: false }
    );
    button.addEventListener(
      "touchend",
      (event) => {
        event.preventDefault();
        button.classList.remove("is-pressed");
      },
      { passive: false }
    );
    button.addEventListener("touchcancel", () => button.classList.remove("is-pressed"), { passive: false });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (performance.now() - lastPointerPress < 350) return;
      enterMobileFullscreen();
      if (state.mode === "title") resetGame();
    });
  }

  document.addEventListener("selectstart", (event) => {
    if (event.target.closest?.(".touch-controls")) {
      event.preventDefault();
    }
  });

  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i += 1) update(1 / 60);
    render();
  };

  window.render_game_to_text = () => {
    const visibleBlocks = state.blocks
      .map((block) => ({ block, rect: movingBlockRect(block) }))
      .filter(({ rect }) => rect.x + rect.w > state.cameraX && rect.x < state.cameraX + W)
      .map(({ block, rect }) => ({
        id: block.id,
        title: block.title,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        revealed: block.revealed,
      }));
    const visiblePlatforms = state.platforms
      .map((platform) => movingPlatformRect(platform))
      .filter((platform) => platform.x + platform.w > state.cameraX && platform.x < state.cameraX + W)
      .map((platform) => ({
        x: Math.round(platform.x),
        y: Math.round(platform.y),
        moving: platform.move === "bob",
      }));
    return JSON.stringify({
      coordinates: "origin top-left, x right, y down",
      mode: state.mode,
      cameraX: Math.round(state.cameraX),
      worldTime: Number(state.worldTime.toFixed(2)),
      player: {
        x: Math.round(state.player.x),
        y: Math.round(state.player.y),
        vx: Math.round(state.player.vx),
        vy: Math.round(state.player.vy),
        grounded: state.player.grounded,
      },
      visibleBlocks,
      visiblePlatforms,
      activeId: state.activeId,
      themeId: state.themeId,
      revealedCount: state.revealedCount,
      revealedIds: state.blocks.filter((block) => block.revealed).map((block) => block.id),
      jump: {
        canDoubleJump: state.player.canDoubleJump,
        doubleJumped: state.player.doubleJumped,
        wingTimer: Number(state.player.wingTimer.toFixed(2)),
      },
      touchControls: document.querySelectorAll("[data-game-key], [data-game-tap]").length,
      mobileFullscreenLayout: isTouchLayout(),
      fullscreen: Boolean(document.fullscreenElement),
    });
  };

  render();
  requestAnimationFrame(tick);
})();
