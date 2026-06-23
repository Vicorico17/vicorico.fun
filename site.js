const githubUser = "Vicorico17";
const reposNode = document.querySelector("[data-github-repos]");
const starsNode = document.querySelector("[data-total-stars]");
const totalReposNode = document.querySelector("[data-total-repos]");
const portalArtNode = document.querySelector("[data-portal-art]");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function initPortalArt() {
  if (!portalArtNode) return;

  const canvas = portalArtNode;
  const ctx = canvas.getContext("2d");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const capabilityLabels = [
    "AI INFRA",
    "GPU VPS",
    "LOCAL MODELS",
    "KUBERNETES",
    "DOCKER",
    "MODEL SERVING",
    "COMFYUI",
    "CONTENT OPS",
    "REVOPS AGENTS",
    "SUPPORT COPILOTS",
    "MEETING PREP",
    "KNOWLEDGE BASES",
    "CONTEXT ENGINEERING",
    "OSINT",
    "LINUX",
    "SECURITY",
    "SMART CONTRACTS",
    "ERC-20",
    "ERC-721",
    "ERC-1155",
    "X402 PAYMENTS",
    "PREDICTION MARKETS",
    "COMMUNITY COINS",
    "NFT SYSTEMS",
    "SOLANA TOOLING",
    "DISCORD WORLDS",
    "QUEST LOOPS",
    "MARKETPLACES",
    "DROPSHIPPING",
    "CHECKOUT FLOWS",
    "VIDEO AUTOMATION",
    "TIKTOK SYSTEMS",
    "YOUTUBE REPURPOSING",
    "IMAGE MODELS",
    "GROWTH LOOPS",
    "GAME ECONOMIES",
    "3D WORLDS",
    "WORLD BUILDING",
    "MONITORING",
    "UPTIME KUMA",
  ];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let animationFrame = 0;

  function uniqueLabels(count) {
    const shuffled = [...capabilityLabels];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function makeNodes() {
    const count = Math.max(28, Math.min(74, Math.round((width * height) / 26000)));
    const labelPool = uniqueLabels(Math.min(24, count));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      size: 2 + Math.random() * 5,
      label: labelPool[index] || "",
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    makeNodes();
  }

  function drawCircuit(time) {
    const cx = width / 2;
    const cy = height / 2;
    const size = Math.min(width, height) * 0.34;
    const spin = time * 0.00014;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(spin);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.setLineDash([16, 18]);

    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.rotate((Math.PI / 4) * i);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(212, 61, 23, 0.36)";
    ctx.beginPath();
    ctx.moveTo(-size * 0.72, 0);
    ctx.lineTo(-size * 0.28, -size * 0.28);
    ctx.lineTo(0, 0);
    ctx.lineTo(size * 0.28, -size * 0.28);
    ctx.lineTo(size * 0.72, 0);
    ctx.stroke();
    ctx.restore();
  }

  function draw(time = 0) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(6, 5, 10, 0.18)";
    ctx.fillRect(0, 0, width, height);

    drawCircuit(time);

    for (const node of nodes) {
      const pulse = Math.sin(time * 0.0012 + node.phase) * 0.5 + 0.5;
      node.x += motionQuery.matches ? 0 : node.vx;
      node.y += motionQuery.matches ? 0 : node.vy;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;

      ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + pulse * 0.34})`;
      ctx.fillRect(node.x, node.y, node.size, node.size);

      if (node.label && node.size > 3.8) {
        ctx.font = "800 11px Inter, system-ui, sans-serif";
        ctx.fillStyle = `rgba(242, 184, 75, ${0.24 + pulse * 0.28})`;
        ctx.fillText(node.label, node.x + 10, node.y - 3);
      }
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 135) continue;
        ctx.globalAlpha = 1 - distance / 135;
        ctx.beginPath();
        ctx.moveTo(a.x + a.size / 2, a.y + a.size / 2);
        ctx.lineTo(b.x + b.size / 2, b.y + b.size / 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (!motionQuery.matches) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  }

  function restart() {
    window.cancelAnimationFrame(animationFrame);
    resize();
    draw();
  }

  window.addEventListener("resize", restart);
  motionQuery.addEventListener("change", restart);
  restart();
}

function initIntroGate() {
  const enterButton = document.querySelector("[data-enter-site]");
  const aboutSection = document.querySelector("#about");

  if (!enterButton || !aboutSection) return;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  enterButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");

    window.requestAnimationFrame(() => {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initFlowArt() {
  const panels = Array.from(document.querySelectorAll("[data-flow-panel]"));
  if (panels.length === 0) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  function update() {
    ticking = false;

    const isMobile = window.innerWidth <= 768;

    panels.forEach((panel) => {
      const inner = panel.querySelector("[data-flow-inner]");
      if (!inner) return;

      if (motionQuery.matches) {
        inner.style.transform = "none";
        return;
      }

      const rect = panel.getBoundingClientRect();
      const scrollRange = Math.max(rect.height + window.innerHeight * 0.25, 1);
      const progress = clamp((window.innerHeight - rect.top) / scrollRange, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const rotation = lerp(isMobile ? 0 : 5, 0, eased);
      const scale = lerp(isMobile ? 0.98 : 0.96, 1, eased);
      const translate = lerp(28, 0, eased);
      inner.style.transform = `translateY(${translate}px) rotateX(${rotation}deg) scale(${scale})`;
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  motionQuery.addEventListener("change", requestUpdate);
  update();
}

function initRouteSwitcher() {
  const tabs = Array.from(document.querySelectorAll("[data-route-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-route-panel]"));
  if (tabs.length === 0 || panels.length === 0) return;

  function activateRoute(route) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.routeTab === route;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.routePanel === route;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateRoute(tab.dataset.routeTab));
    tab.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (direction === 0) return;

      event.preventDefault();
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
      nextTab.focus();
      activateRoute(nextTab.dataset.routeTab);
    });
  });
}

async function loadGithubRepos() {
  if (!reposNode || !starsNode || !totalReposNode) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    const publicRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    starsNode.textContent = totalStars.toLocaleString();
    totalReposNode.textContent = publicRepos.length.toLocaleString();

    reposNode.replaceChildren(
      ...publicRepos.slice(0, 6).map((repo) => {
        const article = document.createElement("article");
        article.className = "repo-card";

        const title = document.createElement("a");
        title.href = repo.html_url;
        title.textContent = repo.name;

        const meta = document.createElement("p");
        meta.textContent = `${repo.stargazers_count.toLocaleString()} stars${repo.language ? ` / ${repo.language}` : ""}`;

        const description = document.createElement("p");
        description.textContent = repo.description || "Public GitHub repository.";

        article.append(title, meta, description);
        return article;
      }),
    );
  } catch (error) {
    reposNode.innerHTML = "";
    const fallback = document.createElement("p");
    fallback.className = "muted";
    fallback.textContent = "GitHub data could not be loaded in this browser session.";
    reposNode.append(fallback);
  }
}

initIntroGate();
initPortalArt();
initFlowArt();
initRouteSwitcher();
loadGithubRepos();
