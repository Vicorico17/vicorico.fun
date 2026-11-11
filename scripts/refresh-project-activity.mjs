import { readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

// A deploy refreshes the snapshot once; visitors never spend their GitHub quota
// on a separate commit-count request for every project.
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const archive = html.split('<section id="projects"')[1].split('<section id="game-cv"')[0]
const repos = [...new Set([...archive.matchAll(/href="https:\/\/github\.com\/([^"/]+\/[^"/]+)"/g)].map(match => match[1].toLowerCase()))]
async function getCommits(repo) {
  if (process.argv.includes('--github-cli')) {
    let stdout
    try {
      ({ stdout } = await promisify(execFile)('gh', ['api', `repos/${repo}/commits?per_page=1`, '--include'], { timeout: 10000 }))
    } catch (error) {
      if (/^HTTP\/\S+ 409\b/.test(error.stdout || '')) return new Response('[]', { status: 409 })
      throw error
    }
    const boundary = stdout.match(/\r?\n\r?\n/)
    if (!boundary) throw Error('Invalid CLI response')
    const head = stdout.slice(0, boundary.index)
    const body = stdout.slice(boundary.index + boundary[0].length)
    const status = Number(head.match(/^HTTP\/\S+ (\d+)/)?.[1])
    const link = head.split(/\r?\n/).find(line => /^link:/i.test(line))?.slice(5).trim()
    return new Response(body, { status, headers: link ? { link } : {} })
  }
  return fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'vicorico-portfolio' },
    signal: AbortSignal.timeout(8000),
  })
}
const source = new URL('../assets/project-activity.json', import.meta.url)
let previous = { projects: {} }
try { previous = JSON.parse(await readFile(source, 'utf8')) } catch { /* First refresh. */ }
const projects = {}
let refreshed = 0, unavailable = 0, rateLimited = false
const queue = [...repos]
async function worker() {
  while (queue.length) {
    const repo = queue.shift()
    const cached = previous.projects?.[repo]
    if (cached) projects[repo] = cached
    if (rateLimited || (cached && Date.now() - cached.savedAt < 6 * 60 * 60 * 1000)) continue
    try {
      const response = await getCommits(repo)
      if (response.status === 403 || response.status === 429) rateLimited = true
      if (!response.ok && response.status !== 409) throw Error(`HTTP ${response.status}`)
      const commits = response.status === 409 ? [] : await response.json()
      if (!Array.isArray(commits)) throw Error('Invalid commits')
      const links = response.headers.get('link')
      const last = links?.split(',').find(link => /rel="last"/.test(link))
      const url = last?.match(/<([^>]+)>/)?.[1]
      if (links && !url) throw Error('Missing last page')
      const count = url ? Number(new URL(url).searchParams.get('page')) : commits.length
      if (!Number.isInteger(count) || count < 0) throw Error('Invalid count')
      projects[repo] = { count, latestDate: commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date || null, savedAt: Date.now() }
      refreshed++
    } catch { unavailable++ }
  }
}
await Promise.all([worker(), worker(), worker()])
const destination = process.argv.includes('--write-source') ? source : new URL('../dist/assets/project-activity.json', import.meta.url)
await writeFile(destination, JSON.stringify({ projects }, null, 2) + '\n')
console.log(`Project activity: ${refreshed} refreshed; ${Object.keys(projects).length}/${repos.length} available; ${unavailable} failed (saved values retained).`)
