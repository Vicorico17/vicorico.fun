const test = require('node:test');
const assert = require('node:assert/strict');

test('preview availability is stable, sparse, nonoverlapping, and respects Bucharest time through DST', async () => {
  const { generatePreviewSlots, dateKey } = await import('../booking-schedule.mjs');
  for (const now of [new Date('2026-11-02T00:00:00Z'), new Date('2027-03-01T00:00:00Z')]) {
    const slots = generatePreviewSlots(now);
    assert.deepEqual(slots, generatePreviewSlots(now));
    assert.equal(slots.length, 24);
    const days = new Map();
    const weeks = new Map();
    for (const slot of slots) {
      assert.ok(Date.parse(slot.start) > now.getTime());
      assert.equal(Date.parse(slot.end) - Date.parse(slot.start), 3600000);
      const key = dateKey(new Date(slot.start));
      const date = new Date(`${key}T12:00:00Z`);
      assert.ok(date.getUTCDay() >= 1 && date.getUTCDay() <= 5);
      days.set(key, (days.get(key) || 0) + 1);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
      weeks.set(date.toISOString(), (weeks.get(date.toISOString()) || 0) + 1);
      const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', hour: '2-digit', hourCycle: 'h23' }).format(new Date(slot.start)));
      assert.ok(hour >= 9 && hour <= 17);
    }
    assert.ok([...weeks.values()].every(n => n === 3));
    assert.ok([...days.values()].every(n => n <= 2));
    assert.equal([...days.values()].filter(n => n === 2).length, 1);
    slots.slice(1).forEach((slot, i) => assert.ok(Date.parse(slot.start) >= Date.parse(slots[i].end)));
  }
});
