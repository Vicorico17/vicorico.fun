import { dateKey, generatePreviewSlots } from './booking-schedule.mjs';
import { bookingTemplate } from './booking-widget-template.js';
const root = document.querySelector('[data-booking-widget]');
root.innerHTML = bookingTemplate;
const $ = selector => root.querySelector(selector);
const slots = generatePreviewSlots();
// Use the visitor's device timezone without requesting location or an IP lookup.
let zone = 'UTC';
try {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (detected) {
    new Intl.DateTimeFormat('en-GB', { timeZone: detected }).format();
    zone = detected;
  }
} catch { /* UTC is a safe fallback when timezone detection is unavailable. */ }
const timezoneSelect = $('#timezone');
let localOption = [...timezoneSelect.options].find(option => option.value === zone);
if (!localOption) {
  localOption = new Option(zone.replaceAll('_', ' '), zone);
  timezoneSelect.prepend(localOption);
}
localOption.textContent += ' (your timezone)';
timezoneSelect.value = zone;
let selectedDay = null;
let selectedSlot = null;
let shownMonth = dateKey(new Date(), zone).slice(0, 7);
const format = (date, options) => new Intl.DateTimeFormat('en-GB', { timeZone: zone, ...options }).format(new Date(date));
const monthNumber = key => Number(key.slice(0, 4)) * 12 + Number(key.slice(5, 7)) - 1;
const monthKey = value => `${Math.floor(value / 12)}-${String(value % 12 + 1).padStart(2, '0')}`;
const timeLabel = slot => `${format(slot.start, { hour: '2-digit', minute: '2-digit' })}–${format(slot.end, { hour: '2-digit', minute: '2-digit' })}`;
const currentSlots = () => slots.filter(slot => Date.parse(slot.start) > Date.now());
function render() {
  const month = new Date(`${shownMonth}-01T12:00:00Z`);
  $('#month-label').textContent = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(month);
  const min = dateKey(new Date(), zone).slice(0, 7);
  const max = dateKey(new Date(slots.at(-1)?.start || Date.now()), zone).slice(0, 7);
  $('#previous-month').disabled = shownMonth <= min;
  $('#next-month').disabled = shownMonth >= max;
  const grid = $('#calendar');
  grid.replaceChildren();
  const first = (month.getUTCDay() + 6) % 7;
  for (let i = 0; i < first; i++) { const blank = document.createElement('span'); blank.setAttribute('aria-hidden', 'true'); grid.append(blank); }
  const days = new Date(month.getUTCFullYear(), month.getUTCMonth() + 1, 0).getDate();
  for (let day = 1; day <= days; day++) {
    const key = `${shownMonth}-${String(day).padStart(2, '0')}`;
    const available = currentSlots().some(slot => dateKey(new Date(slot.start), zone) === key);
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = day; button.disabled = !available;
    button.className = available ? 'available' : '';
    button.setAttribute('aria-pressed', String(selectedDay === key));
    const label = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${key}T12:00:00Z`));
    button.setAttribute('aria-label', `${label}${available ? ', times available' : ', unavailable'}`);
    button.addEventListener('click', () => { selectedDay = key; selectedSlot = null; render(); grid.querySelector('[aria-pressed="true"]')?.focus(); });
    grid.append(button);
  }
  $('#slots').replaceChildren();
  const daySlots = currentSlots().filter(slot => dateKey(new Date(slot.start), zone) === selectedDay);
  $('.slot-panel').hidden = !daySlots.length;
  $('#day-label').textContent = daySlots.length ? format(daySlots[0].start, { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  $('#slot-note').textContent = selectedDay ? `${daySlots.length === 1 ? 'One available hour' : 'Two available hours'} on this day.` : '';
  for (const slot of daySlots) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = timeLabel(slot);
    button.setAttribute('aria-pressed', String(slot === selectedSlot));
    button.addEventListener('click', () => { selectedSlot = slot; render(); $('#slots [aria-pressed="true"]')?.focus(); });
    $('#slots').append(button);
  }
  $('#selection').hidden = !selectedSlot;
  if (selectedSlot) $('#selected-time').textContent = `${format(selectedSlot.start, { day: 'numeric', month: 'short' })} · ${timeLabel(selectedSlot)}`;
}
$('#previous-month').addEventListener('click', () => { shownMonth = monthKey(monthNumber(shownMonth) - 1); selectedDay = null; selectedSlot = null; render(); });
$('#next-month').addEventListener('click', () => { shownMonth = monthKey(monthNumber(shownMonth) + 1); selectedDay = null; selectedSlot = null; render(); });
$('#timezone').addEventListener('change', event => {
  zone = event.target.value;
  if (selectedSlot) { selectedDay = dateKey(new Date(selectedSlot.start), zone); shownMonth = selectedDay.slice(0, 7); }
  else { selectedDay = null; shownMonth = dateKey(new Date(), zone).slice(0, 7); }
  render();
});
const dialog = $('#booking-dialog');
function closeDialog() { dialog.close(); $('#booking-form').reset(); }
$('.close').addEventListener('click', closeDialog);
$('#back-calendar').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => $('#booking-form').reset());
$('#continue').addEventListener('click', () => {
  if (!selectedSlot || Date.parse(selectedSlot.start) <= Date.now()) { selectedSlot = null; selectedDay = null; render(); return; }
  $('#booking-form').hidden = false; $('#confirmation').hidden = true;
  $('#dialog-slot').textContent = `${format(selectedSlot.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${timeLabel(selectedSlot)} (${zone})`;
  dialog.showModal(); $('#name').focus();
});
$('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedSlot || Date.parse(selectedSlot.start) <= Date.now()) { closeDialog(); selectedSlot = null; selectedDay = null; render(); return; }
  $('#confirmation-copy').textContent = `${$('#name').value.trim()}, your selected hour is ${$('#dialog-slot').textContent}.`;
  $('#booking-form').hidden = true; $('#confirmation').hidden = false; $('#back-calendar').focus();
});
render();
