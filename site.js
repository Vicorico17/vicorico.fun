const githubUser = "Vicorico17";
const latestReposNode = document.querySelector("[data-github-latest]");
const historyNode = document.querySelector("[data-github-history]");
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
  if (!enterButton) return;

  const targetSelector = enterButton.getAttribute("href");
  const targetSection = targetSelector ? document.querySelector(targetSelector) : document.querySelector("#about");
  if (!targetSection) return;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);

  enterButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");

    window.requestAnimationFrame(() => {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initFlowArt() {
  const panels = Array.from(document.querySelectorAll("[data-flow-panel]"));
  if (panels.length === 0) return;

  function setExpanded(panel, expanded, shouldScroll = false) {
    const toggle = panel.querySelector("[data-flow-toggle]");
    const inner = panel.querySelector("[data-flow-inner]");
    if (!toggle || !inner) return;

    panel.classList.toggle("is-expanded", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    inner.setAttribute("aria-hidden", String(!expanded));
    inner.style.transform = "none";

    if (expanded && shouldScroll) {
      window.requestAnimationFrame(() => {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  panels.forEach((panel, index) => {
    const toggle = panel.querySelector("[data-flow-toggle]");
    const inner = panel.querySelector("[data-flow-inner]");
    if (!toggle || !inner) return;

    if (!inner.id) {
      inner.id = `flow-detail-${index + 1}`;
    }

    toggle.setAttribute("aria-controls", inner.id);
    inner.setAttribute("aria-hidden", "true");

    const close = document.createElement("button");
    close.className = "flow-close";
    close.type = "button";
    close.textContent = "Close details";
    close.addEventListener("click", () => setExpanded(panel, false, true));
    inner.prepend(close);

    toggle.addEventListener("click", () => {
      const willExpand = !panel.classList.contains("is-expanded");
      panels.forEach((otherPanel) => setExpanded(otherPanel, false));
      setExpanded(panel, willExpand, true);
    });
  });

  document.querySelectorAll('a[href^="#story-"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetPanel = document.querySelector(anchor.getAttribute("href"));
      if (!targetPanel || !targetPanel.matches("[data-flow-panel]")) return;

      event.preventDefault();
      panels.forEach((panel) => setExpanded(panel, false));
      setExpanded(targetPanel, true, true);
    });
  });
}

function formatGithubDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function githubLink(href, label) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function githubFallback(node, message) {
  if (!node) return;
  const fallback = document.createElement("p");
  fallback.className = "muted";
  fallback.textContent = message;
  node.replaceChildren(fallback);
}

function renderLatestRepos(repos) {
  if (!latestReposNode) return;

  latestReposNode.replaceChildren(
    ...repos.slice(0, 6).map((repo) => {
      const article = document.createElement("article");
      article.className = "github-live-card";

      const meta = document.createElement("span");
      meta.textContent = `Active / ${repo.language || "Project"}`;

      const title = document.createElement("h4");
      title.append(githubLink(repo.html_url, repo.name));

      const description = document.createElement("p");
      description.textContent = repo.description || "Public GitHub repository in active development.";

      const footer = document.createElement("footer");
      const updated = document.createElement("time");
      updated.dateTime = repo.pushed_at || repo.updated_at;
      updated.textContent = `Updated ${formatGithubDate(repo.pushed_at || repo.updated_at)}`;
      footer.append(updated);

      if (repo.homepage) {
        footer.append(githubLink(repo.homepage, "Open build"));
      }

      footer.append(githubLink(repo.html_url, "GitHub"));
      article.append(meta, title, description, footer);
      return article;
    }),
  );
}

function renderCommitHistory(events) {
  if (!historyNode) return;

  const commits = events
    .filter((event) => event.type === "PushEvent" && event.repo?.name?.startsWith(`${githubUser}/`))
    .flatMap((event) => (event.payload?.commits || []).map((commit) => ({
      ...commit,
      createdAt: event.created_at,
      repo: event.repo.name,
    })))
    .slice(0, 8);

  if (commits.length === 0) {
    githubFallback(historyNode, "No recent public commits are available yet.");
    return;
  }

  historyNode.replaceChildren(
    ...commits.map((commit) => {
      const article = document.createElement("article");
      const time = document.createElement("time");
      time.dateTime = commit.createdAt;
      time.textContent = formatGithubDate(commit.createdAt);

      const content = document.createElement("div");
      const title = document.createElement("h4");
      title.append(githubLink(`https://github.com/${commit.repo}/commit/${commit.sha}`, `${commit.repo.split("/")[1]} · ${commit.sha.slice(0, 7)}`));

      const message = document.createElement("p");
      message.textContent = commit.message.split("\n")[0];
      content.append(title, message);
      article.append(time, content);
      return article;
    }),
  );
}

async function loadGithubActivity() {
  const headers = { Accept: "application/vnd.github+json" };
  const reposRequest = fetch(
    `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=100`,
    { headers, cache: "no-store" },
  );
  const eventsRequest = fetch(
    `https://api.github.com/users/${githubUser}/events/public?per_page=100`,
    { headers, cache: "no-store" },
  );

  try {
    const response = await reposRequest;
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repos = await response.json();
    const publicRepos = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
    renderLatestRepos(publicRepos);
  } catch (error) {
    githubFallback(latestReposNode, "The latest GitHub projects could not be loaded in this browser session.");
  }

  try {
    const response = await eventsRequest;
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    renderCommitHistory(await response.json());
  } catch (error) {
    githubFallback(historyNode, "The recent commit history could not be loaded in this browser session.");
  }
}

initIntroGate();
initPortalArt();
initFlowArt();
loadGithubActivity();
