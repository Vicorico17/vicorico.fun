const githubUser = "Vicorico17";
const reposNode = document.querySelector("[data-github-repos]");
const starsNode = document.querySelector("[data-total-stars]");
const totalReposNode = document.querySelector("[data-total-repos]");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function fitCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function initPortalField() {
  const canvas = document.querySelector("[data-portal-field]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0 };
  let width = 0;
  let height = 0;
  let animationId = 0;

  function resize() {
    ({ width, height } = fitCanvas(canvas, ctx));
  }

  function draw(time = 0) {
    const t = time * 0.001;
    const spacing = width < 520 ? 18 : 22;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#06050a";
    ctx.fillRect(0, 0, width, height);

    for (let y = -spacing; y < height + spacing; y += spacing) {
      for (let x = -spacing; x < width + spacing; x += spacing) {
        const nx = x / width - 0.5;
        const ny = y / height - 0.5;
        const depth = 1 - clamp(Math.hypot(nx * 1.25, ny), 0, 1);
        const wave = Math.sin(t * 0.8 + nx * 6 + ny * 4) * 2.4;
        const driftX = pointer.x * depth * 10;
        const driftY = pointer.y * depth * 7;
        const accent = Math.round((x + y) / spacing) % 17 === 0;
        const alpha = accent ? 0.28 + depth * 0.22 : 0.12 + depth * 0.22;
        const radius = accent ? 1.55 + depth * 1.1 : 0.9 + depth * 0.8;

        ctx.fillStyle = accent ? `rgba(212, 61, 23, ${alpha})` : `rgba(120, 113, 108, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x + driftX + wave, y + driftY + wave * 0.35, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const glow = ctx.createRadialGradient(width * 0.52, height * 0.44, 0, width * 0.52, height * 0.44, Math.max(width, height) * 0.72);
    glow.addColorStop(0, "rgba(212, 61, 23, 0.1)");
    glow.addColorStop(0.45, "rgba(120, 113, 108, 0.05)");
    glow.addColorStop(1, "rgba(6, 5, 10, 0.92)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    if (!motionQuery.matches) {
      animationId = window.requestAnimationFrame(draw);
    }
  }

  function restart() {
    window.cancelAnimationFrame(animationId);
    resize();
    draw();
  }

  canvas.parentElement?.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  });
  window.addEventListener("resize", restart);
  motionQuery.addEventListener("change", restart);
  restart();
}

function initFlowArt() {
  const panels = Array.from(document.querySelectorAll("[data-flow-panel]"));
  if (panels.length === 0) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  function update() {
    ticking = false;

    panels.forEach((panel, index) => {
      const inner = panel.querySelector("[data-flow-inner]");
      if (!inner) return;

      if (motionQuery.matches || index === 0) {
        inner.style.transform = "none";
        return;
      }

      const rect = panel.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight * 0.8), 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const rotation = (1 - eased) * 24;
      const offset = (1 - eased) * 42;
      inner.style.transform = `rotate(${rotation}deg) translateY(${offset}px)`;
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

initPortalField();
initFlowArt();
loadGithubRepos();
