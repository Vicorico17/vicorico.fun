import { test, expect } from '@playwright/test'

for (const width of [1280, 390]) {
  test(`castle unlock reveals a portal without blocking entry at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error' && /shader|webgl/i.test(message.text())) errors.push(message.text()) })
    await page.setViewportSize({ width, height: 850 })
    await page.route('**/cv-game.js*', async route => {
      const response = await route.fetch()
      await route.fulfill({ response, body: await response.text() + '\nwindow.__gateTest = { state, castleObjects, mobs, updateCastles, render, camera, buildingColliders };' })
    })
    await page.goto('/game.html')
    await page.locator('[data-game-start]').click()
    const result = await page.evaluate(() => {
      const { state, castleObjects, mobs, updateCastles, render, camera, buildingColliders } = (window as any).__gateTest
      const item = castleObjects[0]
      state.player.x = item.x
      state.player.z = item.z + 10
      const closed = !item.gateGlow.visible
      const noBars = item.gate.children.every((child: any) => !child.isInstancedMesh)
      const seal = item.gateSeal.name === "castle-door-seal"
      mobs.filter((mob: any) => mob.userData.castleIndex === 0).forEach((mob: any) => { mob.userData.alive = false; mob.visible = false })
      item.nodes.forEach((node: any) => { node.userData.active = false; node.visible = false })
      updateCastles(0.4)
      const halfway = item.gateProgress
      updateCastles(0.5)
      const portal = item.gateGlow
      camera.position.set(item.x + 5, 6, item.z + 13)
      camera.lookAt(item.x, 1.5, item.z + 3)
      render()
      const positions = Array.from(portal.userData.sparks.geometry.attributes.position.array) as number[]
      return { closed, noBars, seal, sealFade: item.gateSeal.userData.veil.material.uniforms.uReveal.value, halfway, open: item.gateProgress, doorHidden: !item.gate.visible,
        visible: portal.visible, strength: portal.userData.veil.material.uniforms.uReveal.value,
        finite: positions.every(Number.isFinite), count: positions.length / 3,
        effectIsNotCollider: !buildingColliders.includes(portal) }
    })
    expect(result.closed && result.noBars && result.seal).toBe(true)
    expect(result.sealFade).toBe(0)
    expect(result.halfway).toBeGreaterThan(0)
    expect(result.halfway).toBeLessThan(1)
    expect(result.open).toBe(1)
    expect(result.doorHidden && result.visible && result.finite && result.effectIsNotCollider).toBe(true)
    expect(result.strength).toBe(1)
    expect(result.count).toBeLessThanOrEqual(36)
    await page.screenshot({ path: `output/gate-portal-${width}.png` })
    expect(errors).toEqual([])
  })
}
