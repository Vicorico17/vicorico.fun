import { test, expect } from '@playwright/test'

test('ammo costs and refills are deterministic and shown in the HUD', async ({ page }) => {
  await page.route('**/cv-game.js*', async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: await response.text() + '\nwindow.__ammo = { state, attack, updateAmmo, updateAmmoUi, projectiles };' })
  })
  await page.goto('/game.html')
  await page.locator('[data-game-start]').click()
  const result = await page.evaluate(() => {
    const { state, attack, updateAmmo, updateAmmoUi, projectiles } = (window as any).__ammo
    const fire = () => { state.attackCooldown = 0; attack() }
    state.weapon = 'bow'
    state.perks.arrowCount = 3
    for (let i = 0; i < 12; i++) fire()
    const bowEmpty = state.ammo.bow === 0 && projectiles.length === 36
    const reloadLabel = document.querySelector('[data-game-ammo-status]')!.textContent
    fire()
    const emptyBlocked = state.ammo.bow === 0 && projectiles.length === 36
    state.weapon = 'sword'
    updateAmmo(0.8)
    const noEarlyReload = state.ammo.bow === 0
    updateAmmo(0.81)
    const fullReload = state.ammo.bow === 12
    state.weapon = 'arc'
    fire()
    updateAmmo(1)
    fire()
    const castRestartsTimer = state.ammo.arc === 2 && state.ammo.arcRecharge === 2.4
    fire(); fire(); fire()
    const arcEmpty = state.ammo.arc === 0
    updateAmmoUi(true)
    const rechargeLabel = document.querySelector('[data-game-ammo-status]')!.textContent
    state.weapon = 'sword'
    updateAmmo(2.3)
    const noEarlyCharge = state.ammo.arc === 0
    updateAmmo(0.11)
    const oneCharge = state.ammo.arc === 1
    for (let i = 0; i < 5; i++) updateAmmo(2.4)
    const capped = state.ammo.arc === 4 && state.ammo.arcRecharge === 0
    return { bowEmpty, emptyBlocked, noEarlyReload, fullReload, castRestartsTimer, arcEmpty, noEarlyCharge, oneCharge, capped, reloadLabel, rechargeLabel }
  })
  expect(result).toEqual({ bowEmpty: true, emptyBlocked: true, noEarlyReload: true, fullReload: true, castRestartsTimer: true, arcEmpty: true, noEarlyCharge: true, oneCharge: true, capped: true, reloadLabel: 'Reloading · 1.6s', rechargeLabel: '+1 charge in 2.4s' })
  await expect(page.locator('#intro-title')).toHaveText('Reconnect the system.')
  await expect(page.locator('[data-game-intro]')).not.toContainText('playable CV')
  await expect(page.locator('[data-game-intro]')).not.toContainText('Graph Engineer')
})
