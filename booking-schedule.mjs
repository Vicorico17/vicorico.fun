// Sample availability only. No external calendar is connected to this preview.
export const OWNER_ZONE = 'Europe/Bucharest';
export function dateKey(date, zone = OWNER_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type).value).join('-');
}
function randomFrom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
// Convert a Bucharest wall time to an instant, including daylight-saving offsets.
function ownerInstant(day, hour, minute) {
  const desired = Date.parse(`${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
  let instant = desired;
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: OWNER_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(instant));
    const get = key => parts.find(p => p.type === key).value;
    const actual = Date.parse(`${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:00Z`);
    instant += desired - actual;
  }
  return new Date(instant).toISOString();
}
export function generatePreviewSlots(now = new Date()) {
  const today = new Date(`${dateKey(now)}T12:00:00Z`);
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - (today.getUTCDay() + 6) % 7);
  const slots = [];
  for (let week = 0; week < 8; week++) {
    const start = new Date(monday);
    start.setUTCDate(start.getUTCDate() + week * 7);
    const serial = Math.floor(start.getTime() / 604800000);
    const random = randomFrom(serial * 7919 + 173);
    const days = [0, 1, 2, 3, 4];
    for (let i = days.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [days[i], days[j]] = [days[j], days[i]];
    }
    // Three hours a week. A double-slot day occurs in only one week out of eight.
    const selectedDays = serial % 8 === 0 ? [days[0], days[0], days[1]] : days.slice(0, 3);
    const starts = [];
    selectedDays.forEach((offset, i) => {
      const day = new Date(start);
      day.setUTCDate(day.getUTCDate() + offset);
      let halfHour = 18 + Math.floor(random() * 17); // 09:00 through 17:00.
      if (i === 1 && selectedDays[0] === offset && Math.abs(halfHour - starts[0]) < 4) halfHour = starts[0] <= 26 ? starts[0] + 4 : starts[0] - 4;
      starts.push(halfHour);
      const startTime = ownerInstant(day.toISOString().slice(0, 10), Math.floor(halfHour / 2), halfHour % 2 * 30);
      if (Date.parse(startTime) > now.getTime()) slots.push({ start: startTime, end: new Date(Date.parse(startTime) + 3600000).toISOString() });
    });
  }
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}
