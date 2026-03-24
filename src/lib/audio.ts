// Generates a soft bell/bowl tone as a WAV data URI.
// Uses cosine attack (smooth 0→1) and exponential decay for a warm, airy sound.
function makeTone(freq: number, duration: number, volume = 0.4): string {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buf = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buf);
  const ws = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };

  ws(0, 'RIFF'); view.setUint32(4, 36 + numSamples * 2, true);
  ws(8, 'WAVE'); ws(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  ws(36, 'data'); view.setUint32(40, numSamples * 2, true);

  const attackTime = 0.08; // 80ms smooth cosine attack — no click

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Smooth cosine ramp up, then long exponential decay (bowl-like)
    const env = t < attackTime
      ? (1 - Math.cos(Math.PI * t / attackTime)) / 2
      : Math.exp(-3.5 * (t - attackTime) / (duration - attackTime));

    // Fundamental + gentle harmonics for warmth (like a singing bowl)
    const sample = (
      Math.sin(2 * Math.PI * freq * t) * 0.78 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.16 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.06
    ) * env * volume;

    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }

  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
}

function makeAudio(freq: number, duration: number, volume = 0.4): HTMLAudioElement {
  const a = new Audio(makeTone(freq, duration, volume));
  a.preload = 'auto';
  return a;
}

// Pentatonic-ish notes — sound natural and harmonious together
// Inhale: A4 (440) bright/open  Hold: G4 (392) stable
// Exhale: E4 (330) releasing    Hold2: D4 (294) grounded/quiet
const tones = {
  inhale:    makeAudio(440, 1.4, 0.42), // A4 — bright, welcoming
  hold:      makeAudio(392, 1.0, 0.32), // G4 — steady
  exhale:    makeAudio(330, 1.6, 0.40), // E4 — releasing, descending feel
  hold2:     makeAudio(294, 0.9, 0.26), // D4 — quiet, grounded
  complete1: makeAudio(523, 0.8, 0.38), // C5
  complete2: makeAudio(659, 0.8, 0.38), // E5
  complete3: makeAudio(784, 1.4, 0.42), // G5 — resolved, peaceful
};

// Silent looping audio — keeps iOS audio session in "playback" mode
// so tones play even when the hardware mute switch is on.
const silentLoop = (() => {
  const a = new Audio(makeTone(440, 0.5, 0.001));
  a.loop = true;
  a.volume = 0.001;
  return a;
})();

// Call once inside a user gesture. Starts the silent loop which promotes
// the iOS audio session to "playback" category (bypasses mute switch).
export function unlockAudio(): Promise<void> {
  return silentLoop.play().catch(() => {});
}

function play(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export const AudioCues = {
  inhale()   { play(tones.inhale); },
  hold()     { play(tones.hold); },
  exhale()   { play(tones.exhale); },
  hold2()    { play(tones.hold2); },
  complete() {
    play(tones.complete1);
    setTimeout(() => play(tones.complete2), 300);
    setTimeout(() => play(tones.complete3), 600);
  },
};
