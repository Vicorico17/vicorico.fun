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

function initAxiomField() {
  const canvas = document.querySelector("[data-axiom-field]");
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
    const horizon = height * 0.42 + pointer.y * 24;
    const centerX = width * 0.5 + pointer.x * 36;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    const sky = ctx.createRadialGradient(centerX, horizon, 0, centerX, horizon, Math.max(width, height) * 0.78);
    sky.addColorStop(0, "rgba(79, 70, 229, 0.24)");
    sky.addColorStop(0.5, "rgba(49, 46, 129, 0.08)");
    sky.addColorStop(1, "rgba(5, 5, 5, 0)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    for (let i = -16; i <= 16; i += 1) {
      const bottomX = centerX + (i / 16) * width * 1.25;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(centerX + i * 2, horizon);
      ctx.lineTo(bottomX + pointer.x * 18, height);
      ctx.stroke();
    }

    for (let i = 0; i < 34; i += 1) {
      const progress = (i / 34 + (t * 0.035) % 0.06) % 1;
      const eased = progress * progress;
      const y = horizon + eased * (height - horizon);
      const alpha = 0.22 * (1 - progress);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

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

function initNorthgridField() {
  const canvas = document.querySelector("[data-northgrid-field]");
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
    const spacing = 24;

    ctx.clearRect(0, 0, width, height);
    for (let y = -spacing; y < height + spacing; y += spacing) {
      for (let x = -spacing; x < width + spacing; x += spacing) {
        const nx = x / width - 0.5;
        const ny = y / height - 0.5;
        const depth = 1 - clamp(Math.hypot(nx, ny * 1.4), 0, 1);
        const pulse = Math.sin(t * 0.7 + nx * 8 + ny * 5) * 0.04;
        const alpha = 0.08 + depth * 0.18 + pulse;
        ctx.fillStyle = `rgba(23, 20, 39, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x + pointer.x * depth * 8, y + pointer.y * depth * 8, 1.1 + depth, 0, Math.PI * 2);
        ctx.fill();
      }
    }

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

function initSmokeField() {
  const canvas = document.querySelector("[data-smoke-field]");
  if (!canvas) return;

  const gl = canvas.getContext("webgl2", { alpha: false, antialias: true });
  if (!gl) return;

  const vertexSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);
  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);
  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  col=mix(col,u_color,dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}`;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationId = 0;
  let width = 0;
  let height = 0;

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  const resolution = gl.getUniformLocation(program, "resolution");
  const timeUniform = gl.getUniformLocation(program, "time");
  const colorUniform = gl.getUniformLocation(program, "u_color");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function draw(now = 0) {
    gl.clearColor(0.03, 0.03, 0.03, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(timeUniform, now * 0.001);
    gl.uniform3fv(colorUniform, new Float32Array([0.83, 0.24, 0.09]));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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

initPortalField();
initAxiomField();
initNorthgridField();
initSmokeField();
initFlowArt();
loadGithubRepos();
