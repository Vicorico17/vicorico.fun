const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require.resolve('../site.js'), 'utf8');
const init = source.slice(source.indexOf('function initIntroGate()'), source.indexOf('function initFlowArt()'));

function setup(width = 288) {
  function node() {
    const events = {}, attrs = {}, classes = new Set(['scroll-locked']);
    return {
      events, attrs,
      addEventListener(type, fn) { (events[type] ||= []).push(fn); },
      emit(type, props = {}) {
        const event = { type, pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 34, preventDefault() {}, ...props };
        for (const fn of events[type] || []) fn(event);
      },
      classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
      style: { setProperty() {} },
      setAttribute(key, value) { attrs[key] = value; },
    };
  }
  const slider = node(), track = node(), thumb = node(), win = node(), root = node(), body = node();
  let captured = null, scrolls = 0;
  Object.assign(track, {
    clientWidth: width,
    getBoundingClientRect: () => ({ right: width }),
    setPointerCapture: id => { captured = id; },
    hasPointerCapture: id => captured === id,
    releasePointerCapture: id => { captured = null; track.emit('lostpointercapture', { pointerId: id }); },
  });
  thumb.offsetWidth = 56;
  slider.querySelector = s => s === '[data-enter-track]' ? track : thumb;
  slider.getAttribute = () => '#proof';
  Object.assign(win, { history: {}, scrollTo() {}, matchMedia: () => ({ matches: true }), requestAnimationFrame: fn => fn() });
  const target = { scrollIntoView() { scrolls++; } };
  vm.runInNewContext(`${init}\ninitIntroGate();`, {
    window: win,
    document: { documentElement: root, body, querySelector: s => s === '[data-enter-site]' ? slider : target },
  });
  return { slider, track, thumb, win, root, body, scrolls: () => scrolls, captured: () => captured };
}

for (const width of [260, 288, 336]) {
  test(`touch drag completes and unlocks at track width ${width}`, () => {
    const s = setup(width);
    s.track.emit('pointerdown');
    s.win.emit('pointermove', { clientX: 34 + (width - 68) * 0.75, clientY: 45 });
    assert.equal(s.thumb.attrs['aria-valuenow'], '100');
    assert.equal(s.root.classList.contains('scroll-locked'), false);
    assert.equal(s.body.classList.contains('scroll-locked'), false);
    assert.equal(s.captured(), null);
    assert.equal(s.scrolls(), 1);
    s.win.emit('pointerup');
    assert.equal(s.scrolls(), 1);
  });
}

for (const interruption of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur', 'resize']) {
  test(`short drag resets after ${interruption} and can be retried`, () => {
    const s = setup();
    s.track.emit('pointerdown');
    s.win.emit('pointermove', { clientX: 60 });
    (interruption === 'lostpointercapture' ? s.track : s.win).emit(interruption);
    assert.equal(s.thumb.attrs['aria-valuenow'], '0');
    assert.equal(s.slider.classList.contains('is-dragging'), false);
    assert.equal(s.root.classList.contains('scroll-locked'), true);
    s.track.emit('pointerdown');
    s.win.emit('pointerup', { clientX: 240 });
    assert.equal(s.scrolls(), 1);
  });
}

test('a second finger does not cancel the primary drag', () => {
  const s = setup();
  s.track.emit('pointerdown');
  s.track.emit('pointerdown', { pointerId: 2, isPrimary: false });
  s.win.emit('pointerup', { pointerId: 2, isPrimary: false });
  s.win.emit('pointermove', { clientX: 240 });
  assert.equal(s.scrolls(), 1);
});

test('keyboard End still unlocks the site', () => {
  const s = setup();
  s.thumb.emit('keydown', { key: 'End' });
  assert.equal(s.scrolls(), 1);
});
