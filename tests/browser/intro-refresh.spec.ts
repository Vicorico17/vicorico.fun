import { test, expect } from '@playwright/test'

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`refresh returns to the intro at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.route('https://**/*', route => route.abort())
    await page.goto('/?intro-test=1')
    await page.locator('.portal-explore').click()
    await expect(page).toHaveURL(/#proof$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)

    await page.reload()
    await expect(page).toHaveURL('/?intro-test=1')
    await expect(page.locator('html')).toHaveClass(/explore-pending/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(page.locator('.portal-explore')).toBeInViewport()

    // Explore still unlocks the page after a refresh.
    await page.locator('.portal-explore').click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
    await page.evaluate(() => history.replaceState(null, '', location.pathname + location.search))
    await page.reload()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(page.locator('.portal-explore')).toBeInViewport()
  })
}
