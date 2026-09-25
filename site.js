const githubUser = "Vicorico17";
const latestReposNode = document.querySelector("[data-github-latest]");
const githubCarouselNode = document.querySelector("[data-github-carousel]");
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

  // Deep links from other pages (the Game CV links to #story-* anchors) should
  // land on an open panel, not a collapsed one.
  function expandFromHash() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#story-")) return;
    let targetPanel = null;
    try {
      targetPanel = document.querySelector(hash);
    } catch {
      return;
    }
    if (!targetPanel || !targetPanel.matches("[data-flow-panel]")) return;
    panels.forEach((panel) => setExpanded(panel, false));
    setExpanded(targetPanel, true, true);
  }

  expandFromHash();
  window.addEventListener("hashchange", expandFromHash);
}

function formatGithubDateTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
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

const githubReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let githubCarouselCards = [];
let githubCarouselIndex = 0;
let githubCarouselDirection = 1;
let githubCarouselInView = true;

function githubVisibleCards() {
  if (!latestReposNode || githubCarouselCards.length === 0) return 1;
  const cardWidth = githubCarouselCards[0].getBoundingClientRect().width;
  const gap = Number.parseFloat(window.getComputedStyle(latestReposNode).columnGap) || 0;
  return Math.max(1, Math.min(githubCarouselCards.length, Math.floor((latestReposNode.clientWidth + gap) / (cardWidth + gap) + 0.02)));
}

function updateGithubCarouselState() {
  const visible = githubVisibleCards();
  const maxIndex = Math.max(0, githubCarouselCards.length - visible);
  githubCarouselIndex = Math.min(githubCarouselIndex, maxIndex);
  githubCarouselCards.forEach((card, index) => card.classList.toggle("is-current", index === githubCarouselIndex));
}

function showGithubCarouselCard(index, behavior = "smooth") {
  if (!latestReposNode || githubCarouselCards.length === 0) return;
  const maxIndex = Math.max(0, githubCarouselCards.length - githubVisibleCards());
  githubCarouselIndex = Math.min(maxIndex, Math.max(0, index));
  const first = githubCarouselCards[0];
  const card = githubCarouselCards[githubCarouselIndex];
  latestReposNode.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: githubReducedMotion.matches ? "auto" : behavior });
  updateGithubCarouselState();
}

function setGithubCarouselCards(cards) {
  if (!latestReposNode) return;
  latestReposNode.replaceChildren(...cards);
  githubCarouselCards = cards;
  githubCarouselIndex = 0;
  githubCarouselDirection = 1;
  latestReposNode.scrollLeft = 0;
  window.requestAnimationFrame(updateGithubCarouselState);
}

function initGithubCarousel() {
  if (!latestReposNode || !githubCarouselNode) return;
  githubCarouselCards = [...latestReposNode.querySelectorAll(".github-live-card")];
  window.requestAnimationFrame(updateGithubCarouselState);
  window.addEventListener("resize", () => showGithubCarouselCard(githubCarouselIndex, "auto"));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      githubCarouselInView = entry.isIntersecting;
    }, { threshold: 0.1 }).observe(githubCarouselNode);
  }
  window.setInterval(() => {
    if (githubReducedMotion.matches || document.hidden || !githubCarouselInView) return;
    if (latestReposNode.contains(document.activeElement)) return;
    const maxIndex = Math.max(0, githubCarouselCards.length - githubVisibleCards());
    if (maxIndex === 0) return;
    if (githubCarouselIndex >= maxIndex) githubCarouselDirection = -1;
    if (githubCarouselIndex <= 0) githubCarouselDirection = 1;
    showGithubCarouselCard(githubCarouselIndex + githubCarouselDirection);
  }, 5000);
}

function latestGithubRepos(repos) {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const ordered = [...repos].sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
  const recent = ordered.filter((repo) => new Date(repo.pushed_at || repo.updated_at).getTime() >= thirtyDaysAgo);
  return [...new Map([...recent, ...ordered.slice(0, 6)].map((repo) => [repo.id, repo])).values()].slice(0, 8);
}

function makeGithubCommitCard(repo) {
  const article = document.createElement("article");
  article.className = "github-live-card";
  const label = document.createElement("span");
  label.textContent = "Latest commit";
  const title = document.createElement("h4");
  title.append(githubLink(repo.html_url, repo.name));
  const message = document.createElement("p");
  message.textContent = "Loading latest commit…";
  const footer = document.createElement("footer");
  footer.append(githubLink(`${repo.html_url}/commits`, "View commits"));
  article.append(label, title, message, footer);
  return article;
}

async function getLatestGithubCommit(repo) {
  const key = `vicorico-commit:${repo.full_name}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || "null");
    if (cached && Date.now() - cached.savedAt < 5 * 60 * 1000) return cached.commit;
  } catch { /* Storage may be disabled. */ }

  const url = new URL(`https://api.github.com/repos/${githubUser}/${encodeURIComponent(repo.name)}/commits`);
  url.searchParams.set("per_page", "1");
  if (repo.default_branch) url.searchParams.set("sha", repo.default_branch);
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const [commit] = await response.json();
  if (!commit?.sha || !commit.commit?.message) throw new Error("No commit available");
  try { sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), commit })); } catch { /* Storage may be disabled. */ }
  return commit;
}

async function fillGithubCommitCard(repo, card) {
  const message = card.querySelector("p");
  const footer = card.querySelector("footer");
  try {
    const commit = await getLatestGithubCommit(repo);
    message.textContent = commit.commit.message.split("\n")[0].trim() || "Untitled commit";
    const date = commit.commit.committer?.date || commit.commit.author?.date;
    const link = githubLink(commit.html_url, `Commit ${commit.sha.slice(0, 7)} ↗`);
    const time = document.createElement("time");
    if (date) {
      time.dateTime = date;
      time.textContent = formatGithubDateTime(date);
    }
    footer.replaceChildren(...(date ? [link, time] : [link]));
  } catch {
    message.textContent = "Latest commit unavailable right now.";
  }
}

async function loadGithubActivity() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" },
    );
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repos = (await response.json()).filter((repo) => !repo.fork && !repo.archived);
    const recent = latestGithubRepos(repos);
    if (recent.length === 0) return;
    const cards = recent.map(makeGithubCommitCard);
    setGithubCarouselCards(cards);
    for (let index = 0; index < recent.length; index += 1) {
      await fillGithubCommitCard(recent[index], cards[index]);
    }
  } catch {
    // Keep the linked fallback cards when GitHub is unavailable.
  }
}

initIntroGate();
initPortalArt();
initFlowArt();
initGithubCarousel();
loadGithubActivity();
