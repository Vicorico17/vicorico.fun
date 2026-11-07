import { test, expect } from '@playwright/test'

test.use({ timezoneId: 'Europe/Bucharest' })
for (const route of ['/booking-preview.html', '/']) {
for (const width of [1280, 390]) {
  test(`booking preview works without sending or saving details on ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = [], writes: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('request', r => { if (r.method() !== 'GET') writes.push(r.url()) })
    await page.goto(route)
    if (route === '/') {
      await page.locator('.portal-explore').click()
      await page.locator('[data-booking-widget]').scrollIntoViewIfNeeded()
    }
    await expect(page.getByRole('heading', { name: 'Get some time with me.' })).toBeVisible()
    const dates = page.locator('#calendar button.available')
    if (await dates.count() === 0) await page.getByRole('button', { name: 'Next month' }).click()
    await dates.first().click()
    await page.locator('#slots button').first().click()
    const before = await page.locator('#selected-time').textContent()
    await page.locator('#timezone').selectOption('America/New_York')
    await expect(page.locator('#selected-time')).not.toHaveText(before!)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.locator('#dialog-slot')).toContainText('America/New_York')
    await page.getByLabel('Your name', { exact: true }).fill('Preview Visitor')
    await page.getByLabel('Email address', { exact: true }).fill('preview@example.com')
    await page.getByRole('button', { name: 'Preview confirmation' }).click()
    await expect(page.locator('#confirmation')).toContainText('No slot was reserved')
    await page.getByRole('button', { name: 'Back to the calendar' }).click()
    await expect(page.locator('#booking-dialog')).not.toBeVisible()
    await page.locator('[data-booking-widget]').screenshot({ path: `output/booking-${route === '/' ? 'homepage' : 'preview'}-${width}.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await page.evaluate(() => Object.values(localStorage).join(''))).not.toContain('preview@example.com')
    expect(writes).toEqual([])
    expect(errors).toEqual([])
  })
}

}

for (const timezoneId of ['America/New_York', 'Asia/Tokyo', 'Pacific/Auckland']) {
  test.describe(`visitor timezone ${timezoneId}`, () => {
    test.use({ timezoneId })
    test('detects local time and preserves the selected hour when changed manually', async ({ page }) => {
      await page.goto('/booking-preview.html')
      await expect(page.locator('#timezone')).toHaveValue(timezoneId)
      await expect(page.locator('#timezone option:checked')).toContainText('your timezone')
      if (await page.locator('#calendar button.available').count() === 0) await page.getByRole('button', { name: 'Next month' }).click()
      await page.locator('#calendar button.available').first().click()
      await page.locator('#slots button').first().click()
      const localTime = await page.locator('#selected-time').textContent()
      await page.locator('#timezone').selectOption('UTC')
      await expect(page.locator('#selected-time')).not.toHaveText(localTime!)
      await page.locator('#timezone').selectOption(timezoneId)
      await expect(page.locator('#selected-time')).toHaveText(localTime!)
      await page.getByRole('button', { name: 'Continue' }).click()
      await expect(page.locator('#dialog-slot')).toContainText(timezoneId)
    })
  })
}
