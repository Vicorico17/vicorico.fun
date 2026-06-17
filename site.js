const githubUser = "Vicorico17";
const reposNode = document.querySelector("[data-github-repos]");
const starsNode = document.querySelector("[data-total-stars]");
const totalReposNode = document.querySelector("[data-total-repos]");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
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
      const rotation = lerp(20, 0, eased);
      const scale = lerp(isMobile ? 0.72 : 1.05, isMobile ? 0.92 : 1, eased);
      inner.style.transform = `rotateX(${rotation}deg) scale(${scale})`;
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

initIntroGate();
initFlowArt();
loadGithubRepos();
