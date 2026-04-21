const githubUser = "Vicorico17";
const reposNode = document.querySelector("[data-github-repos]");
const starsNode = document.querySelector("[data-total-stars]");
const totalReposNode = document.querySelector("[data-total-repos]");

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

loadGithubRepos();
