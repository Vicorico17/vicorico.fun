const githubUser = "Vicorico17";
const reposNode = document.querySelector("[data-github-repos]");
const starsNode = document.querySelector("[data-total-stars]");
const totalReposNode = document.querySelector("[data-total-repos]");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function initPaperShaderBackground() {
  const canvas = document.querySelector("[data-paper-shader-bg]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let animationId = 0;

  const blobs = [
    { color: "rgba(255, 255, 255, 0.34)", radius: 0.46, x: 0.52, y: 0.2, sx: 0.09, sy: 0.07, speed: 0.16 },
    { color: "rgba(255, 87, 34, 0.45)", radius: 0.36, x: 0.16, y: 0.52, sx: 0.08, sy: 0.06, speed: 0.22 },
    { color: "rgba(80, 80, 80, 0.72)", radius: 0.54, x: 0.84, y: 0.42, sx: 0.06, sy: 0.08, speed: 0.18 },
    { color: "rgba(255, 255, 255, 0.18)", radius: 0.34, x: 0.42, y: 0.82, sx: 0.08, sy: 0.04, speed: 0.2 },
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time = 0) {
    const t = time * 0.001;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020202";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";
    blobs.forEach((blob, index) => {
      const x = (blob.x + Math.sin(t * blob.speed + index * 1.7) * blob.sx) * width;
      const y = (blob.y + Math.cos(t * blob.speed * 1.3 + index) * blob.sy) * height;
      const radius = Math.max(width, height) * blob.radius;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(0.48, blob.color.replace("0.", "0.1"));
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

    ctx.globalCompositeOperation = "source-over";
    const centerX = width * 0.52;
    const centerY = height * 0.48;
    const orbitBase = Math.min(width, height) * 0.14;

    for (let ring = 0; ring < 5; ring += 1) {
      const radius = orbitBase + ring * Math.min(width, height) * 0.075;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.035 + ring * 0.012})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      for (let dot = 0; dot < 9; dot += 1) {
        const angle = t * (0.18 + ring * 0.035) + dot * ((Math.PI * 2) / 9) + ring * 0.6;
        const dotX = centerX + Math.cos(angle) * radius;
        const dotY = centerY + Math.sin(angle) * radius;
        ctx.fillStyle = dot % 3 === 0 ? "rgba(255, 87, 34, 0.42)" : "rgba(255, 255, 255, 0.16)";
        ctx.beginPath();
        ctx.arc(dotX, dotY, dot % 3 === 0 ? 2.1 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const vignette = ctx.createRadialGradient(width / 2, height * 0.35, 0, width / 2, height * 0.35, Math.max(width, height) * 0.8);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.72)");
    ctx.fillStyle = vignette;
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

initPaperShaderBackground();
initFlowArt();
loadGithubRepos();
