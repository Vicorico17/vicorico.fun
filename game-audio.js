// Small Web Audio soundtrack and cues. Audio starts only after a player gesture.
export function createGameAudio() {
  let muted = false;
  try { muted = localStorage.getItem("vics-quest-muted") === "true"; } catch { /* Storage may be disabled. */ }

  let context;
  let master;
  let musicBus;
  let effectsBus;
  let timer;
  let playing = false;
  let step = 0;
  let nextStepTime = 0;
  const lastCue = new Map();

  function ready() {
    if (context) return true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    try {
      context = new AudioContext();
      master = context.createGain();
      musicBus = context.createGain();
      effectsBus = context.createGain();
      master.gain.value = muted ? 0 : 0.8;
      musicBus.gain.value = 0.16;
      effectsBus.gain.value = 0.34;
      musicBus.connect(master);
      effectsBus.connect(master);
      master.connect(context.destination);
      return true;
    } catch {
      context = undefined;
      return false;
    }
  }

  function tone(bus, at, frequency, duration, volume, type = "sine", endFrequency = frequency) {
    if (!context) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), at + duration);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), at + Math.min(0.012, duration / 4));
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope);
    envelope.connect(bus);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
  }

  const note = (midi) => 440 * 2 ** ((midi - 69) / 12);
  // Eight seconds at 120 BPM. The sparse melody leaves room for combat cues.
  const melody = [64, null, 67, null, 71, null, 67, null, 69, null, 67, null, 64, null, 62, null,
    64, null, 67, null, 72, null, 71, null, 69, null, 67, null, 64, null, 59, null];
  const bass = [40, 43, 45, 43];

  function scheduleMusic() {
    if (!context || muted || !playing || document.hidden || context.state !== "running") return;
    while (nextStepTime < context.currentTime + 0.25) {
      const index = step % melody.length;
      if (index % 8 === 0) tone(musicBus, nextStepTime, note(bass[Math.floor(index / 8)]), 0.6, 0.23, "triangle");
      if (melody[index] !== null) tone(musicBus, nextStepTime, note(melody[index]), 0.2, 0.12, "sine");
      if (index % 4 === 0) tone(musicBus, nextStepTime, 95, 0.08, 0.15, "sine", 45);
      step += 1;
      nextStepTime += 0.25;
    }
  }

  function syncMusic() {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
    if (!context || muted || !playing || document.hidden) return;
    nextStepTime = context.currentTime + 0.04;
    step = 0;
    scheduleMusic();
    timer = window.setInterval(scheduleMusic, 100);
  }

  function activate() {
    if (muted || !ready()) return Promise.resolve(false);
    return context.resume().then(() => { syncMusic(); return true; }).catch(() => false);
  }

  function setPlaying(value) {
    playing = value;
    syncMusic();
  }

  function setMuted(value) {
    muted = value;
    try { localStorage.setItem("vics-quest-muted", String(muted)); } catch { /* Storage may be disabled. */ }
    if (context) master.gain.setTargetAtTime(muted ? 0 : 0.8, context.currentTime, 0.025);
    if (muted) syncMusic();
    else void activate();
  }

  function cue(name) {
    if (muted || !context || context.state !== "running") return;
    const now = context.currentTime;
    const limit = name === "hurt" ? 0.4 : name === "hit" ? 0.16 : 0.04;
    if (now - (lastCue.get(name) ?? -Infinity) < limit) return;
    lastCue.set(name, now);
    const play = (frequency, duration, volume, type, end = frequency, delay = 0) =>
      tone(effectsBus, now + delay, frequency, duration, volume, type, end);
    switch (name) {
      case "start": play(330, 0.13, 0.22, "triangle", 440); play(550, 0.22, 0.2, "sine", 660, 0.1); break;
      case "sword": play(340, 0.11, 0.2, "sawtooth", 110); break;
      case "bow": play(520, 0.12, 0.2, "triangle", 220); break;
      case "arc": play(420, 0.19, 0.17, "sawtooth", 920); play(840, 0.18, 0.11, "sine", 480, 0.04); break;
      case "dash": play(220, 0.2, 0.21, "triangle", 650); break;
      case "hit": play(180, 0.07, 0.15, "square", 85); break;
      case "kill": play(260, 0.13, 0.16, "triangle", 490); break;
      case "hurt": play(230, 0.24, 0.23, "sawtooth", 90); break;
      case "fall": play(300, 0.36, 0.25, "triangle", 65); break;
      case "pickup": play(520, 0.1, 0.19, "sine", 780); play(780, 0.18, 0.17, "sine", 1040, 0.08); break;
      case "gate": play(260, 0.28, 0.2, "triangle", 520); play(390, 0.27, 0.15, "sine", 780, 0.13); break;
      case "upgrade": play(392, 0.14, 0.19, "sine", 440); play(523, 0.14, 0.19, "sine", 587, 0.1); play(659, 0.26, 0.2, "sine", 784, 0.2); break;
      case "boss": play(110, 0.48, 0.26, "sawtooth", 73); play(165, 0.48, 0.18, "triangle", 110, 0.12); break;
      case "win": [392, 494, 587, 784].forEach((frequency, index) => play(frequency, 0.65, 0.18, "sine", frequency, index * 0.12)); break;
      default: break;
    }
  }

  return { activate, setPlaying, setMuted, cue, get muted() { return muted; } };
}
