// Tiny Web Audio synth: every sound is generated, no audio files.

let ctx: AudioContext | null = null;
let muted = (() => {
  try {
    return localStorage.getItem('bng-muted') === '1';
  } catch {
    return false;
  }
})();

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem('bng-muted', value ? '1' : '0');
  } catch {
    /* storage blocked */
  }
}

function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18, slideTo?: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise(start: number, dur: number, vol = 0.2, filterFreq = 3000) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const buffer = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = a.createBufferSource();
  src.buffer = buffer;
  const filter = a.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const gain = a.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t);
}

// Major pentatonic, so random notes always sound nice together.
const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

export const sfx = {
  /** Soft xylophone blip for chips and toggles. */
  tap() {
    tone(PENTA[Math.floor(Math.random() * PENTA.length)], 0, 0.25, 'triangle', 0.14);
  },
  /** Squeaky toy for favourites. */
  squeak() {
    tone(900, 0, 0.12, 'square', 0.05, 1600);
    tone(1500, 0.1, 0.14, 'square', 0.04, 900);
  },
  /** Rattle shake while names are shuffled. */
  rattle() {
    for (let i = 0; i < 6; i++) noise(i * 0.07, 0.05, 0.25, 4000 + Math.random() * 2000);
  },
  /** Ascending music-box run when results land. */
  chime() {
    [0, 2, 4, 5, 7].forEach((n, i) => tone(PENTA[n], i * 0.08, 0.6, 'sine', 0.12));
  },
  /** Balloon or bubble pop. */
  pop() {
    noise(0, 0.08, 0.5, 1200);
    tone(400, 0, 0.08, 'sine', 0.2, 80);
  },
  /** Descending "boing" for a no swipe. */
  boing() {
    tone(300, 0, 0.35, 'sine', 0.18, 120);
  },
  /** Happy two-note ding for a yes swipe or a match. */
  yes() {
    tone(783.99, 0, 0.2, 'triangle', 0.14);
    tone(1046.5, 0.1, 0.35, 'triangle', 0.14);
  },
  /** Scratchy paper sound for the scratch card. */
  scratch() {
    noise(0, 0.05, 0.08, 6000);
  },
  /** Crack of an egg shell. */
  crack() {
    noise(0, 0.12, 0.6, 2500);
    tone(180, 0, 0.1, 'square', 0.05, 60);
  },
  /** Drum roll that builds tension. */
  drumroll(seconds = 1.6) {
    const hits = Math.floor(seconds / 0.045);
    for (let i = 0; i < hits; i++) noise(i * 0.045, 0.04, 0.08 + (i / hits) * 0.25, 900);
  },
  /** Big fanfare for the reveal. */
  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, i * 0.12, 0.5, 'sawtooth', 0.07));
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => tone(f, 0.55, 1.2, 'triangle', 0.1));
    noise(0.55, 0.4, 0.3, 5000);
  },
  /** Lullaby snippet (Twinkle Twinkle) for the logo. */
  lullaby() {
    const C = 523.25, G = 783.99, A = 880;
    [C, C, G, G, A, A, G].forEach((f, i) => tone(f, i * 0.28, i === 6 ? 0.6 : 0.3, 'sine', 0.13));
  },
};

/** Read a name aloud with the browser's speech engine. */
export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}
