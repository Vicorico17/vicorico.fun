import { test, expect } from '@playwright/test'

for (const width of [1280, 390]) {
  test(`forward sword, autozap and victory at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 850 })
    await page.route('**/cv-game.js*', async route => {
      const response = await route.fetch()
      await route.fulfill({ response, body: await response.text() + '\nwindow.__combat = { state, player, attack, targetMobs, updatePlayer, effects, clearTransientObjects, syncCompanions, updateCompanions, castles, openEnding, swordSlash };' })
    })
    await page.goto('/game.html')
    await page.locator('[data-game-start]').click()
    const combat = await page.evaluate(() => {
      const { state, player, attack, targetMobs, updatePlayer, clearTransientObjects, syncCompanions, updateCompanions, effects, swordSlash } = (window as any).__combat
      const mobs = targetMobs()
      state.weapon = 'sword'
      state.player.x = 0
      state.player.z = 0
      state.perks.critChance = 0
      const hits = [0, Math.PI / 2, Math.PI, -Math.PI / 2].map(angle => {
        state.player.rotation = angle
        const forward = [Math.sin(angle), Math.cos(angle)]
        const side = [Math.cos(angle), -Math.sin(angle)]
        const positions = [[forward[0] * 1.8, forward[1] * 1.8], [-forward[0], -forward[1]], [side[0] * 1.5, side[1] * 1.5], [forward[0] * 4, forward[1] * 4]]
        mobs.forEach((mob: any, index: number) => { mob.userData.hp = 100; mob.position.set(...[positions[index][0], 0, positions[index][1]]) })
        state.attackCooldown = 0
        attack()
        return mobs.map((mob: any) => mob.userData.hp < 100)
      })
      state.attackTimer = 0.35
      updatePlayer(0.016)
      const before = player.userData.weaponPivot.quaternion.clone()
      state.attackTimer = 0.15
      updatePlayer(0.016)
      const animated = before.angleTo(player.userData.weaponPivot.quaternion) > 0.2
      const partialArc = swordSlash.geometry.parameters.thetaLength < Math.PI
      clearTransientObjects()
      mobs.forEach((mob: any, index: number) => { mob.userData.hp = 100; mob.position.set(index ? 20 : 0, 0, index ? -30 : -3) })
      state.perks.companions = 1
      syncCompanions()
      updateCompanions(1)
      const autozap = effects.some((e: any) => e.kind === 'electric' && !e.target) && effects.some((e: any) => e.target === mobs[0]) && !effects.some((e: any) => e.kind === 'beam')
      return { hits, animated, partialArc, autozap }
    })
    expect(combat.hits).toEqual(Array(4).fill([true, false, false, false]))
    expect(combat.animated).toBe(true)
    expect(combat.partialArc).toBe(true)
    expect(combat.autozap).toBe(true)
    const selected = await page.evaluate(() => {
      const { state, castles, openEnding } = (window as any).__combat
      state.collected = castles.map((castle: any, index: number) => ({ castleId: castle.id, artifactId: castle.artifacts[index % 3].id }))
      state.abilities.dash = true
      state.abilities.arc = true
      state.boss.stage = 'defeated'
      state.completed = true
      const before = JSON.stringify({ collected: state.collected, perks: state.perks, abilities: state.abilities })
      openEnding()
      if (before !== JSON.stringify({ collected: state.collected, perks: state.perks, abilities: state.abilities })) throw Error('Victory changed the chosen build')
      return castles.map((castle: any, index: number) => castle.artifacts[index % 3].upgrade.name)
    })
    await expect(page.locator('#ending-title')).toHaveText('Victory!')
    await expect(page.locator('[data-ending-artifacts] > li')).toHaveCount(7)
    for (const name of selected) await expect(page.locator('[data-ending-artifacts]')).toContainText(name)
    await expect(page.locator('[data-ending-stats]')).toContainText('7/7')
    const panel = page.locator('[data-game-ending]')
    await expect(panel).toBeVisible()
    const box = await panel.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    await page.screenshot({ path: `output/game-victory-${width}.png` })
    await panel.getByRole('button', { name: 'Play again' }).click()
    await expect(page.locator('[data-game-intro]')).toBeVisible()
    expect(errors).toEqual([])
  })
}
