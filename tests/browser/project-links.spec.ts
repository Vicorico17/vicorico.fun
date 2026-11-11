import { test, expect } from '@playwright/test'

test('clicking project description opens its website and GitHub stays separate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('https://api.github.com/**', route => route.fulfill({ json: [] }))
  await page.route('https://libergent.com/**', route => route.fulfill({ body: '<h1>Project website</h1>' }))
  await page.goto('/')
  await page.locator('.portal-explore').click()
  const card = page.locator('#projects article').filter({ has: page.getByRole('heading', { name: 'libergent', exact: true }) })
  const github = card.locator('.proof-actions a[href*="github.com"]')
  await github.scrollIntoViewIfNeeded()
  await github.click({ trial: true })
  const description = card.locator(':scope > p').first()
  await description.scrollIntoViewIfNeeded()
  const box = await description.boundingBox()
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await expect(page).toHaveURL('https://libergent.com/')
})
