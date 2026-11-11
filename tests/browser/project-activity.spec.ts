import { test, expect } from '@playwright/test'

for (const scenario of ['snapshot', 'cached', 'no-data']) {
  test(`project counts tolerate GitHub rate limits with ${scenario}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('https://api.github.com/**', route => route.fulfill({ status: 403, json: { message: 'API rate limit exceeded' } }))
    let snapshotRequests = 0
    await page.route('**/assets/project-activity.json', route => {
      snapshotRequests++
      return scenario === 'snapshot'
        ? route.fulfill({ json: { projects: { 'vicorico17/libergent': { count: 368, latestDate: '2026-11-10T22:38:03Z', savedAt: 1794389077325 } } } })
        : route.fulfill({ status: 503, body: 'Unavailable' })
    })
    if (scenario === 'cached') {
      await page.addInitScript(() => localStorage.setItem('vicorico-project-commits:Vicorico17/libergent', JSON.stringify({ count: 360, latestDate: '2026-10-01T12:00:00Z', savedAt: 1790856000000 })))
    }
    await page.goto('/')
    await page.locator('.portal-explore').click()
    const card = page.locator('#projects article').filter({ has: page.getByRole('heading', { name: 'libergent', exact: true }) })
    await card.scrollIntoViewIfNeeded()
    const count = card.locator('.proof-commit-count')
    await expect(count).toHaveText(scenario === 'snapshot' ? '368 commits' : scenario === 'cached' ? '360 commits' : 'View commits')
    await expect(count).toHaveAttribute('href', 'https://github.com/Vicorico17/libergent/commits')
    await expect(page.locator('#projects')).not.toContainText('Commit count unavailable')
    await expect(page.locator('#projects')).not.toContainText('Latest commit unavailable')
    await expect.poll(() => snapshotRequests).toBe(1)
    await expect(page.locator('#projects .proof-commit-count').filter({ hasText: 'Loading' })).toHaveCount(0)
  })
}
