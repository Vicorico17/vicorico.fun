import { test, expect } from '@playwright/test'

for (const width of [1280, 390]) {
  test(`scenery and player weapons render at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 850 })
    // Inspect scene objects without exposing test controls in the shipped game.
    await page.route('**/cv-game.js*', async route => {
      const response = await route.fetch()
      await route.fulfill({ response, body: await response.text() + '\nwindow.__appearance = { player, state, decorativeAlpacas, mobs, buildingColliders, updatePlayer, render, camera, attack };' })
    })
    await page.goto('/game.html')
    await page.waitForFunction(() => Boolean((window as any).__appearance))
    await page.locator('[data-game-start]').click()
    const result = await page.evaluate(() => {
      const { player, state, decorativeAlpacas, mobs, updatePlayer, attack } = (window as any).__appearance
      const weapons = ['sword', 'bow', 'arc'].map(weapon => {
        state.weapon = weapon
        state.attackCooldown = 0
        const ammoBefore = state.ammo[weapon]
        attack()
        if (state.attackTimer <= 0) throw Error('Attack did not start')
        if (weapon !== 'sword' && state.ammo[weapon] !== ammoBefore - 1) throw Error('Weapon did not fire')
        for (const progress of [0, 0.1, 0.2, 0.4]) {
          state.attackTimer = progress
          updatePlayer(0.016)
          if (!player.userData.rightArm.quaternion.toArray().every(Number.isFinite)) throw Error('Invalid arm pose')
        }
        return ['weaponPivot', 'bowPivot', 'arcPivot'].map(key => player.userData[key].visible)
      })
      state.weapon = 'sword'
      state.attackTimer = 0
      updatePlayer(0.016)
      return { count: decorativeAlpacas.length, sceneryOnly: decorativeAlpacas.every((a: any) => !mobs.includes(a)), weapons }
    })
    expect(result).toEqual({ count: 17, sceneryOnly: true, weapons: [[true, false, false], [false, true, false], [false, false, true]] })
    await page.keyboard.down('w')
    await page.waitForTimeout(350)
    await page.keyboard.up('w')
    await page.screenshot({ path: `output/game-appearance-${width}.png` })
    expect(errors).toEqual([])
  })
}
