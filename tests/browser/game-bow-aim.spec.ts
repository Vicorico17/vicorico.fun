import { test, expect } from '@playwright/test'

for (const touch of [false, true]) {
  test.describe(touch ? 'touch aiming' : 'desktop aiming', () => {
    test.use({ hasTouch: touch, viewport: { width: touch ? 390 : 1280, height: 850 } })
    test('arrows leave the bow along its facing direction, including rearward turns', async ({ page }) => {
      await page.route('**/cv-game.js*', async route => {
        const response = await route.fetch()
        await route.fulfill({ response, body: await response.text() + '\nwindow.__aim = { THREE, state, player, projectiles, attack, updatePlayer, updateMovement, keys, targetMobs, damageMob, effects, updateEffects, clearTransientObjects, render };' })
      })
      await page.goto('/game.html')
      await page.waitForFunction(() => Boolean((window as any).__aim))
      await page.locator('[data-game-start]').click()
      const walking = await page.evaluate((touch) => {
        const { THREE, state, player, keys, updateMovement, updatePlayer } = (window as any).__aim
        return [['w', 0, -1], ['s', 0, 1], ['a', -1, 0], ['d', 1, 0]].map(([key, x, z]) => {
          state.attackTimer = 0
          state.player.x = 0
          state.player.z = 0
          if (touch) Object.assign(state.joystick, { active: true, magnitude: 1, x, y: z })
          else keys.add(key)
          updateMovement(0.05)
          updatePlayer(1)
          keys.clear()
          state.joystick.active = false
          player.updateWorldMatrix(true, true)
          return new THREE.Vector3(0, 0, -1).transformDirection(player.matrixWorld).dot(new THREE.Vector3(x, 0, z))
        })
      }, touch)
      walking.forEach(alignment => expect(alignment).toBeGreaterThan(0.999))
      const shots = await page.evaluate(() => {
        const { THREE, state, player, projectiles, attack, updatePlayer } = (window as any).__aim
        state.weapon = 'bow'
        return [0, Math.PI, -Math.PI / 2, Math.PI / 2, Math.PI - 0.01, -Math.PI + 0.01].map((angle, i) => {
          state.player.rotation = angle
          player.rotation.y = angle // Start facing backwards relative to the requested shot.
          state.attackCooldown = 0
          state.ammo.bow = 12
          state.perks.arrowCount = i % 2 ? 3 : 1
          const before = projectiles.length
          attack()
          const created = projectiles.slice(before)
          const arrow = created[Math.floor(created.length / 2)]
          const velocity = new THREE.Vector3(arrow.userData.vx, 0, arrow.userData.vz).normalize()
          const bow = player.userData.bowPivot
          const facing = new THREE.Vector3(0, 0, -1).transformDirection(bow.matrixWorld)
          const launch = bow.localToWorld(new THREE.Vector3(0.04, 0, -1.08))
          const alignment = facing.dot(velocity)
          const launchError = launch.distanceTo(arrow.position)
          // Movement may turn immediately, but the firing pose must finish facing the shot.
          state.player.rotation = angle + Math.PI
          state.attackTimer = 0.2
          updatePlayer(0.1)
          player.updateWorldMatrix(true, true)
          const heldFacing = new THREE.Vector3(0, 0, -1).transformDirection(bow.matrixWorld)
          return { alignment, launchError, heldAlignment: heldFacing.dot(velocity), count: created.length, expected: state.perks.arrowCount }
        })
      })
      const electricity = await page.evaluate(() => {
        const { targetMobs, damageMob, effects, updateEffects, clearTransientObjects } = (window as any).__aim
        const mob = targetMobs()[0]
        mob.userData.hp = 100
        damageMob(mob, 1, 0, { source: 'arc' })
        const aura = effects.find((e: any) => e.target === mob)
        let disposed = false
        aura.mesh.geometry.addEventListener('dispose', () => { disposed = true })
        mob.position.x += 1
        updateEffects(0.1)
        const follows = aura.mesh.position.distanceTo(mob.position) < 0.001
        damageMob(mob, 1, 0, { source: 'arc' })
        const count = effects.filter((e: any) => e.target === mob).length
        updateEffects(1)
        const expired = !effects.includes(aura) && disposed
        damageMob(mob, 1, 0, { source: 'arc' })
        const next = effects.find((e: any) => e.target === mob)
        let resetDisposed = false
        next.mesh.geometry.addEventListener('dispose', () => { resetDisposed = true })
        clearTransientObjects()
        return { follows, count, expired, resetDisposed }
      })
      expect(electricity).toEqual({ follows: true, count: 1, expired: true, resetDisposed: true })
      await page.evaluate(() => {
        const { state, player, targetMobs, attack, effects, updateEffects, render } = (window as any).__aim
        state.player.x = 0
        state.player.z = 0
        state.player.rotation = Math.PI
        player.rotation.y = 0
        const targets = targetMobs()
        targets.slice(0, 2).forEach((mob: any, index: number) => {
          mob.position.set(index * 2.5, 0, -4)
          mob.userData.hp = 100
        })
        state.weapon = 'arc'
        state.perks.chainTargets = 1
        state.ammo.arc = 4
        state.attackCooldown = 0
        attack()
        updateEffects(0.06)
        // Hold the effect briefly for a review screenshot.
        effects.filter((e: any) => e.kind === 'electric').forEach((e: any) => { e.maxAge = 3 })
        render()
      })
      await page.screenshot({ path: `output/game-electric-${touch ? 'touch' : 'desktop'}.png` })
      for (const shot of shots) {
        expect(shot.alignment).toBeGreaterThan(0.999)
        expect(shot.heldAlignment).toBeGreaterThan(0.999)
        expect(shot.launchError).toBeLessThan(0.001)
        expect(shot.count).toBe(shot.expected)
      }
    })
  })
}
