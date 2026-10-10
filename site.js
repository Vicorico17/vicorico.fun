const githubUser = "Vicorico17";
const latestReposNode = document.querySelector("[data-github-latest]");
const githubCarouselNode = document.querySelector("[data-github-carousel]");
const portalArtNode = document.querySelector("[data-portal-art]");
const projectArchiveNode = document.querySelector("#projects .proof-grid");
const projectPushDates = new Map();

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
  const slider = document.querySelector("[data-enter-site]");
  if (!slider) return;

  const track = slider.querySelector("[data-enter-track]");
  const thumb = slider.querySelector("[data-enter-thumb]");
  if (!track || !thumb) return;

  const targetSelector = slider.getAttribute("data-target");
  const targetSection = targetSelector ? document.querySelector(targetSelector) : document.querySelector("#about");
  if (!targetSection) return;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;

  let position = 0;
  let pointerId = null;
  let dragStartX = 0;
  let dragDistance = 0;
  let dragAvailable = 0;
  let entered = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function maxTravel() {
    return Math.max(0, track.clientWidth - thumb.offsetWidth - 12);
  }

  function setPosition(nextPosition) {
    position = Math.max(0, Math.min(maxTravel(), nextPosition));
    const progress = maxTravel() ? Math.round((position / maxTravel()) * 100) : 0;
    slider.style.setProperty("--slide-x", `${position}px`);
    slider.style.setProperty("--slide-label-opacity", String(1 - progress / 100));
    thumb.setAttribute("aria-valuenow", String(progress));
    thumb.setAttribute("aria-valuetext", progress === 100 ? "Explore" : `${progress}% toward explore`);
  }

  function enterSite() {
    if (entered) return;
    entered = true;
    pointerId = null;
    slider.classList.remove("is-dragging");
    setPosition(maxTravel());
    slider.classList.add("is-complete");
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        targetSection.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
      });
    });
  }

  function resetDrag() {
    pointerId = null;
    slider.classList.remove("is-dragging");
    if (!entered) setPosition(0);
  }

  track.addEventListener("pointerdown", (event) => {
    if (entered || pointerId !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
    const trackRect = track.getBoundingClientRect();
    event.preventDefault();
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDistance = 0;
    dragAvailable = Math.max(1, trackRect.right - event.clientX - 12);
    slider.classList.add("is-dragging");
    setPosition(0);
    try { track.setPointerCapture(pointerId); } catch { /* Window listeners still track the drag. */ }
  });

  function updateDrag(event) {
    if (event.pointerId !== pointerId || entered) return;
    event.preventDefault();
    dragDistance = Math.max(0, event.clientX - dragStartX);
    setPosition((dragDistance / dragAvailable) * maxTravel());
    if (dragDistance >= 36 && maxTravel() && position / maxTravel() >= 0.7) enterSite();
  }

  function finishSlide(event) {
    if (event.pointerId !== pointerId) return;
    if (event.type === "pointerup") updateDrag(event);
    if (!entered) resetDrag();
  }

  window.addEventListener("pointermove", updateDrag, { passive: false });
  window.addEventListener("pointerup", finishSlide);
  window.addEventListener("pointercancel", finishSlide);
  window.addEventListener("blur", resetDrag);
  thumb.addEventListener("keydown", (event) => {
    if (entered) return;
    const step = maxTravel() / 10;
    if (event.key === "ArrowRight") setPosition(position + step);
    else if (event.key === "ArrowLeft") setPosition(position - step);
    else if (event.key === "Home") setPosition(0);
    else if (event.key === "End") setPosition(maxTravel());
    else return;
    event.preventDefault();
    if (position >= maxTravel()) enterSite();
  });

  window.addEventListener("resize", () => {
    if (pointerId !== null) resetDrag();
    if (entered) setPosition(maxTravel());
    else setPosition(0);
  });
}

function initFlowArt() {
  const panels = Array.from(document.querySelectorAll("[data-flow-panel]"));
  if (panels.length === 0) return;

  function setExpanded(panel, expanded, shouldScroll = false) {
    const toggle = panel.querySelector("[data-flow-toggle]");
    const inner = panel.querySelector("[data-flow-inner]");
    if (!toggle || !inner) return;

    if (expanded) panel.parentElement.prepend(panel);
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

function closestGithubCarouselIndex() {
  if (!latestReposNode || githubCarouselCards.length === 0) return 0;
  const maxIndex = Math.max(0, githubCarouselCards.length - githubVisibleCards());
  const firstLeft = githubCarouselCards[0].offsetLeft;
  let closest = 0;
  for (let index = 1; index <= maxIndex; index += 1) {
    const currentDistance = Math.abs(githubCarouselCards[index].offsetLeft - firstLeft - latestReposNode.scrollLeft);
    const closestDistance = Math.abs(githubCarouselCards[closest].offsetLeft - firstLeft - latestReposNode.scrollLeft);
    if (currentDistance < closestDistance) closest = index;
  }
  return closest;
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
  githubCarouselNode?.dispatchEvent(new Event("github-carousel-reset"));
  latestReposNode.replaceChildren(...cards);
  githubCarouselCards = cards;
  githubCarouselIndex = 0;
  latestReposNode.scrollLeft = 0;
  window.requestAnimationFrame(updateGithubCarouselState);
}

function initGithubCarousel() {
  if (!latestReposNode || !githubCarouselNode) return;
  githubCarouselCards = [...latestReposNode.querySelectorAll(".github-live-card")];
  const historyPanel = githubCarouselNode.querySelector("[data-github-history]");
  const historyTitle = historyPanel?.querySelector("[data-github-history-title]");
  const historyList = historyPanel?.querySelector("[data-github-history-list]");
  const historyEmpty = historyPanel?.querySelector("[data-github-history-empty]");
  let activeHistoryCard = null;
  let historyPinned = false;
  let drag = null;
  let suppressClick = false;
  let lastInteraction = 0;
  let scrollFrame = 0;

  function renderHistory(card) {
    if (!historyPanel || !card) return;
    const project = card.querySelector("h4")?.textContent?.trim() || "Project";
    historyTitle.textContent = `${project} · recent commits`;
    const commits = card.commitHistory || [];
    const items = commits.map((commit) => {
      const item = document.createElement("li");
      const meta = document.createElement("div");
      const link = githubLink(commit.html_url, commit.sha.slice(0, 7));
      const date = commit.commit.committer?.date || commit.commit.author?.date;
      meta.append(link);
      if (date) {
        const time = document.createElement("time");
        time.dateTime = date;
        time.textContent = formatGithubDateTime(date);
        meta.append(time);
      }
      const message = document.createElement("p");
      message.textContent = commit.commit.message;
      item.append(meta, message);
      return item;
    });
    historyList.replaceChildren(...items);
    historyList.hidden = items.length === 0;
    historyEmpty.hidden = items.length > 0;
    historyEmpty.textContent = card.dataset.historyStatus === "loading"
      ? "Loading recent commit messages…"
      : "Recent commit messages are unavailable right now. Open the project on GitHub to browse them.";
  }

  function showHistory(card) {
    if (!historyPanel || !card) return;
    if (activeHistoryCard !== card) historyPinned = false;
    activeHistoryCard = card;
    historyPanel.hidden = false;
    githubCarouselNode.classList.add("is-history-open");
    latestReposNode.querySelectorAll(".github-commit-preview").forEach((preview) => {
      preview.setAttribute("aria-expanded", String(preview.closest(".github-live-card") === card));
    });
    renderHistory(card);
  }

  function closeHistory() {
    if (!historyPanel) return;
    historyPanel.hidden = true;
    githubCarouselNode.classList.remove("is-history-open");
    latestReposNode.querySelectorAll(".github-commit-preview").forEach((preview) => {
      preview.setAttribute("aria-expanded", "false");
    });
    activeHistoryCard = null;
    historyPinned = false;
  }

  latestReposNode.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse" || drag) return;
    const commit = event.target.closest(".github-commit-preview, .github-live-card footer a");
    const card = commit?.closest(".github-live-card");
    if (card?.querySelector(".github-commit-preview") && card !== activeHistoryCard) {
      lastInteraction = Date.now();
      showHistory(card);
    }
  });
  latestReposNode.addEventListener("focusin", (event) => {
    const commit = event.target.closest(".github-commit-preview, .github-live-card footer a");
    const card = commit?.closest(".github-live-card");
    if (card?.querySelector(".github-commit-preview")) {
      lastInteraction = Date.now();
      showHistory(card);
    }
  });
  latestReposNode.addEventListener("click", (event) => {
    const preview = event.target.closest(".github-commit-preview");
    if (!preview) return;
    const card = preview.closest(".github-live-card");
    if (activeHistoryCard === card && historyPinned) {
      closeHistory();
    } else {
      showHistory(card);
      historyPinned = true;
      historyPanel?.scrollIntoView({ behavior: githubReducedMotion.matches ? "auto" : "smooth", block: "nearest" });
    }
  });
  latestReposNode.addEventListener("github-history-update", (event) => {
    if (event.target === activeHistoryCard) renderHistory(activeHistoryCard);
  });
  githubCarouselNode.addEventListener("github-carousel-reset", closeHistory);
  githubCarouselNode.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !historyPinned && !githubCarouselNode.contains(document.activeElement)) closeHistory();
  });
  historyPanel?.querySelector("[data-github-history-close]")?.addEventListener("click", closeHistory);

  latestReposNode.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") lastInteraction = Date.now();
    if (event.pointerType !== "mouse" || event.button !== 0 || githubReducedMotion.matches) return;
    if (githubCarouselCards.length <= githubVisibleCards()) return;
    drag = { pointerId: event.pointerId, startX: event.clientX, startScroll: latestReposNode.scrollLeft, moved: false };
  });

  window.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      latestReposNode.classList.add("is-dragging");
    }
    event.preventDefault();
    latestReposNode.scrollLeft = drag.startScroll - distance;
  });

  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    const targetIndex = moved ? closestGithubCarouselIndex() : githubCarouselIndex;
    drag = null;
    latestReposNode.classList.remove("is-dragging");
    if (!moved) return;
    lastInteraction = Date.now();
    showGithubCarouselCard(targetIndex);
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
  }

  window.addEventListener("pointerup", finishDrag);
  window.addEventListener("pointercancel", finishDrag);
  latestReposNode.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  latestReposNode.addEventListener("dragstart", (event) => event.preventDefault());
  latestReposNode.addEventListener("wheel", () => { lastInteraction = Date.now(); }, { passive: true });
  latestReposNode.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      githubCarouselIndex = closestGithubCarouselIndex();
      updateGithubCarouselState();
    });
  });
  githubCarouselNode.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && historyPanel && !historyPanel.hidden) {
      closeHistory();
      return;
    }
    if (event.target !== githubCarouselNode || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    lastInteraction = Date.now();
    showGithubCarouselCard(githubCarouselIndex + (event.key === "ArrowRight" ? 1 : -1));
  });
  window.requestAnimationFrame(updateGithubCarouselState);
  window.addEventListener("resize", () => showGithubCarouselCard(githubCarouselIndex, "auto"));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      githubCarouselInView = entry.isIntersecting;
    }, { threshold: 0.1 }).observe(githubCarouselNode);
  }
  window.setInterval(() => {
    if (githubReducedMotion.matches || document.hidden || !githubCarouselInView) return;
    if (drag || Date.now() - lastInteraction < 6500) return;
    if (historyPanel && !historyPanel.hidden && (historyPanel.matches(":hover") || historyPanel.contains(document.activeElement))) return;
    const maxIndex = Math.max(0, githubCarouselCards.length - githubVisibleCards());
    if (maxIndex === 0) return;
    if (historyPanel && !historyPanel.hidden) closeHistory();
    showGithubCarouselCard(githubCarouselIndex >= maxIndex ? 0 : githubCarouselIndex + 1);
  }, 4000);
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
  article.dataset.historyStatus = "loading";
  const title = document.createElement("h4");
  title.append(githubLink(repo.html_url, repo.name));
  const message = document.createElement("button");
  message.type = "button";
  message.className = "github-commit-preview";
  message.textContent = "Loading project updates…";
  message.setAttribute("aria-label", `Show recent commits from ${repo.name}`);
  message.setAttribute("aria-controls", "github-history-panel");
  message.setAttribute("aria-expanded", "false");
  const footer = document.createElement("footer");
  footer.append(githubLink(`${repo.html_url}/commits`, "View commits"));
  article.append(title, message, footer);
  return article;
}

async function getLatestGithubCommits(repo) {
  const key = `vicorico-commits:${repo.full_name}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || "null");
    if (Array.isArray(cached?.commits) && Date.now() - cached.savedAt < 5 * 60 * 1000) return cached.commits;
  } catch { /* Storage may be disabled. */ }

  const url = new URL(`https://api.github.com/repos/${githubUser}/${encodeURIComponent(repo.name)}/commits`);
  url.searchParams.set("per_page", "5");
  if (repo.default_branch) url.searchParams.set("sha", repo.default_branch);
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const commits = await response.json();
  if (!Array.isArray(commits) || !commits[0]?.sha || !commits[0]?.commit?.message) throw new Error("No commits available");
  try { sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), commits })); } catch { /* Storage may be disabled. */ }
  return commits;
}

async function fillGithubCommitCard(repo, card) {
  const message = card.querySelector(".github-commit-preview");
  const footer = card.querySelector("footer");
  try {
    const commits = await getLatestGithubCommits(repo);
    const commit = commits[0];
    card.commitHistory = commits;
    card.dataset.historyStatus = "ready";
    message.textContent = commit.commit.message.split("\n")[0].trim() || "Untitled commit";
    const date = commit.commit.committer?.date || commit.commit.author?.date;
    const link = githubLink(commit.html_url, `Commit ${commit.sha.slice(0, 7)} ↗`);
    const time = document.createElement("time");
    if (date) {
      time.dateTime = date;
      time.textContent = formatGithubDateTime(date);
    }
    footer.replaceChildren(link, ...(date ? [time] : []));
  } catch {
    card.dataset.historyStatus = "unavailable";
    message.textContent = "Project updates unavailable right now.";
  }
  card.dispatchEvent(new Event("github-history-update", { bubbles: true }));
}

async function loadGithubActivity() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" },
    );
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const allRepos = await response.json();
    sortProjectArchiveByPushDate(allRepos);
    const repos = allRepos.filter((repo) => !repo.fork && !repo.archived);
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

function sortProjectArchiveByPushDate(repos) {
  if (!projectArchiveNode) return;
  repos.forEach((repo) => {
    if (repo.pushed_at) projectPushDates.set(repo.full_name.toLowerCase(), repo.pushed_at);
  });
  const cards = [...projectArchiveNode.querySelectorAll("article")];
  cards.sort((a, b) => {
    const aDate = Date.parse(projectPushDates.get(a.dataset.githubRepo) || a.dataset.latestCommit || "") || 0;
    const bDate = Date.parse(projectPushDates.get(b.dataset.githubRepo) || b.dataset.latestCommit || "") || 0;
    return bDate - aDate || Number(a.dataset.archiveOrder) - Number(b.dataset.archiveOrder);
  });
  cards.forEach((card) => {
    const repo = card.dataset.githubRepo;
    const pushedAt = projectPushDates.get(repo);
    const latest = card.querySelector(".proof-last-commit");
    if (pushedAt && latest) {
      latest.dateTime = pushedAt;
      latest.textContent = `Latest update · ${formatGithubDateTime(pushedAt)}`;
    }
    projectArchiveNode.append(card);
  });
}

function readCachedProjectCommitInfo(repo) {
  try {
    const cached = JSON.parse(localStorage.getItem(`vicorico-project-commits:${repo}`) || "null");
    if (Number.isInteger(cached?.count) && Date.now() - cached.savedAt < 6 * 60 * 60 * 1000) {
      return cached;
    }
  } catch { /* Storage may be disabled. */ }
  return null;
}

async function getGithubProjectCommitInfo(repo) {
  const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok && response.status !== 409) throw new Error(`GitHub API returned ${response.status}`);

  const links = response.headers.get("Link");
  const lastPage = links?.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  if (links && !lastPage) throw new Error("GitHub did not provide the last page");
  const commits = response.status === 409 ? [] : await response.json(); // 409 means an empty repository.
  const count = lastPage ? Number(lastPage[1]) : commits.length;
  if (!Number.isInteger(count)) throw new Error("Invalid commit count");
  const commit = commits[0];
  const info = {
    count,
    latestDate: commit?.commit?.committer?.date || commit?.commit?.author?.date || null,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(`vicorico-project-commits:${repo}`, JSON.stringify(info));
  } catch { /* Storage may be disabled. */ }
  return info;
}

function initProjectCommitCounts() {
  if (!projectArchiveNode) return;
  const pending = [];
  let active = 0;
  let completed = 0;
  let total = 0;
  const entries = [];

  function runPending() {
    while (active < 3 && pending.length) {
      const task = pending.shift();
      active += 1;
      getGithubProjectCommitInfo(task.repo)
        .then((info) => { task.entry.info = info; })
        .catch(() => {
          task.badge.textContent = "Commit count unavailable";
          task.entry.latest.textContent = "Latest commit unavailable";
        })
        .finally(() => {
          completed += 1;
          active -= 1;
          if (completed === total) sortArchive();
          runPending();
        });
    }
  }

  function sortArchive() {
    entries.sort((a, b) => {
      const aDate = Date.parse(projectPushDates.get(a.repo?.toLowerCase()) || a.info?.latestDate || "") || 0;
      const bDate = Date.parse(projectPushDates.get(b.repo?.toLowerCase()) || b.info?.latestDate || "") || 0;
      return bDate - aDate || a.index - b.index;
    });
    entries.forEach(({ card, info, badge, latest }) => {
      if (info) {
        badge.textContent = `${info.count.toLocaleString()} ${info.count === 1 ? "commit" : "commits"}`;
        latest.textContent = info.latestDate ? `Latest commit · ${formatGithubDateTime(info.latestDate)}` : "No commits yet";
        if (info.latestDate) latest.dateTime = info.latestDate;
      }
      const pushedAt = projectPushDates.get(card.dataset.githubRepo);
      if (pushedAt) {
        latest.textContent = `Latest update · ${formatGithubDateTime(pushedAt)}`;
        latest.dateTime = pushedAt;
      }
      projectArchiveNode.append(card);
    });
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        pending.push(...[...projectArchiveNode.querySelectorAll("article")]
          .map((card) => card.commitCountTask)
          .filter(Boolean));
      });
      runPending();
    }, { rootMargin: "400px 0px" })
    : null;

  projectArchiveNode.querySelectorAll("article").forEach((card, index) => {
    card.dataset.archiveOrder = String(index);
    const status = card.querySelector(":scope > span");
    if (!status) return;
    const github = [...card.querySelectorAll(".proof-actions a")]
      .find((link) => /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(link.href));
    const meta = document.createElement("div");
    meta.className = "proof-meta";
    const badge = document.createElement(github ? "a" : "span");
    badge.className = "proof-commit-count";
    const latest = document.createElement("time");
    latest.className = "proof-last-commit";
    latest.textContent = github ? "Loading latest commit…" : "Independent project";
    meta.append(badge, latest);
    if (!github) {
      badge.textContent = "Commits not public";
      status.after(meta);
      entries.push({ card, index, info: null, badge, latest });
      return;
    }

    const repo = new URL(github.href).pathname.slice(1).replace(/\/$/, "");
    card.dataset.githubRepo = repo.toLowerCase();
    const pushedAt = projectPushDates.get(card.dataset.githubRepo);
    if (pushedAt) {
      latest.textContent = `Latest update · ${formatGithubDateTime(pushedAt)}`;
      latest.dateTime = pushedAt;
    }
    badge.href = `${github.href.replace(/\/$/, "")}/commits`;
    badge.target = "_blank";
    badge.rel = "noopener noreferrer";
    const cached = readCachedProjectCommitInfo(repo);
    badge.textContent = cached ? `${cached.count.toLocaleString()} ${cached.count === 1 ? "commit" : "commits"}` : "Loading commits…";
    if (cached) {
      latest.textContent = cached.latestDate ? `Latest commit · ${formatGithubDateTime(cached.latestDate)}` : "No commits yet";
      if (cached.latestDate) latest.dateTime = cached.latestDate;
    }
    status.after(meta);
    const entry = { card, index, repo, info: cached, badge, latest };
    entries.push(entry);
    if (!cached) {
      entry.task = { repo, badge, entry };
      card.commitCountTask = entry.task;
      if (!observer) pending.push(entry.task);
    }
  });
  total = entries.filter((entry) => entry.task).length;
  if (!total) sortArchive();
  if (observer && total) observer.observe(projectArchiveNode);
  else runPending();
}

function initThemePicker() {
  const picker = document.querySelector("[data-theme-picker]");
  if (!picker) return;
  const themes = new Set(["signal", "paper", "grove"]);
  let saved = "signal";
  try {
    const preference = localStorage.getItem("vicorico-site-theme");
    if (themes.has(preference)) saved = preference;
  } catch { /* Storage may be disabled. */ }
  document.body.dataset.theme = saved;
  picker.value = saved;
  picker.addEventListener("change", () => {
    const theme = themes.has(picker.value) ? picker.value : "signal";
    document.body.dataset.theme = theme;
    try { localStorage.setItem("vicorico-site-theme", theme); } catch { /* Storage may be disabled. */ }
  });
}

function initTitleThemes() {
  const title = document.querySelector("[data-title-themes]");
  if (!title) return;
  const trigger = title.querySelector(".text-flip-trigger");

  const themes = [
    "signal", "paper", "grove", "arcade", "lava", "ice",
    "chrome", "neon", "gold", "hologram", "candy", "noir",
    "sunset", "ocean", "matrix", "rose", "electric", "emerald",
    "orbit", "prism", "vinyl", "sakura",
  ];
  let index = -1;

  function nextTheme() {
    index = (index + 1) % themes.length;
    title.dataset.titleTheme = themes[index];
  }

  function start(event) {
    if (event.pointerType !== "mouse") return;
    nextTheme();
  }

  title.addEventListener("pointerenter", start);
  trigger.addEventListener("click", nextTheme);
}

initIntroGate();
initThemePicker();
initTitleThemes();
initPortalArt();
initFlowArt();
initGithubCarousel();
initProjectCommitCounts();
loadGithubActivity();
