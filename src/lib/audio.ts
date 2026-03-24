let ctx: AudioContext | null = null;

async function getCtx(): Promise<AudioContext | null> {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

// Call this inside a user gesture (tap handler) to unlock iOS audio.
// Waits for onstatechange to confirm the context is truly running.
export function unlockAudio(): Promise<void> {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const c = ctx;

  // Play silent buffer synchronously within the gesture (required by iOS)
  const buf = c.createBuffer(1, 1, 22050);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(c.destination);
  src.start(0);

  if (c.state === 'running') return Promise.resolve();

  // Wait for the context to confirm it's running via onstatechange
  return new Promise<void>((resolve) => {
    const onStateChange = () => {
      if (c.state === 'running') {
        c.removeEventListener('statechange', onStateChange);
        resolve();
      }
    };
    c.addEventListener('statechange', onStateChange);
    c.resume().catch(() => resolve()); // fallback if resume() rejects
    // Also resolve after timeout in case statechange never fires
    setTimeout(resolve, 1000);
  });
}

// Resume if page comes back from background
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && ctx?.state === 'suspended') ctx.resume();
});

async function playTone(frequency: number, durationSec: number, volume = 0.35, type: OscillatorType = 'sine') {
  const c = await getCtx();
  if (!c) return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, c.currentTime);

  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + durationSec);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + durationSec);
}

function chime(rootHz: number, vol = 0.35) {
  playTone(rootHz, 0.7, vol);
  setTimeout(() => playTone(rootHz * 1.5, 0.5, vol * 0.6), 80);
}

export const AudioCues = {
  inhale()   { chime(528, 0.3); },
  hold()     { playTone(396, 0.4, 0.22); },
  exhale()   { chime(330, 0.3); setTimeout(() => playTone(264, 0.5, 0.18), 100); },
  hold2()    { playTone(370, 0.35, 0.18); },
  complete() {
    playTone(440, 0.4, 0.3);
    setTimeout(() => playTone(550, 0.4, 0.3), 200);
    setTimeout(() => playTone(660, 0.8, 0.35), 400);
  },
};
