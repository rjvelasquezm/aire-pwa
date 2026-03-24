// Generate WAV samples into a data URI
function makeDataURI(freqs: number[], duration: number, volume = 0.5): string {
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

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.min(t / 0.02, 1) * Math.min((duration - t) / 0.1, 1);
    let s = 0;
    for (const f of freqs) s += Math.sin(2 * Math.PI * f * t);
    view.setInt16(44 + i * 2, Math.round((s / freqs.length) * env * volume * 32767), true);
  }

  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
}

function makeAudio(freqs: number[], duration: number, volume = 0.5): HTMLAudioElement {
  const a = new Audio(makeDataURI(freqs, duration, volume));
  a.preload = 'auto';
  return a;
}

// Pre-generate tones
const tones = {
  inhale:    makeAudio([528, 792], 0.6, 0.6),
  hold:      makeAudio([396], 0.5, 0.45),
  exhale:    makeAudio([330, 264], 0.7, 0.6),
  hold2:     makeAudio([370], 0.5, 0.4),
  complete1: makeAudio([440], 0.4, 0.6),
  complete2: makeAudio([550], 0.4, 0.6),
  complete3: makeAudio([660], 0.7, 0.65),
};

// Silent looping audio — keeps iOS audio session in "playback" mode,
// which bypasses the hardware mute/silent switch. Must be started inside a user gesture.
const silentLoop = (() => {
  const a = new Audio(makeDataURI([], 0.1, 0));
  a.loop = true;
  a.volume = 0;
  return a;
})();

// Call once inside a user gesture (tap). Starts the silent loop which switches
// the iOS audio session to "playback" category — audio plays even in silent mode.
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
    setTimeout(() => play(tones.complete2), 250);
    setTimeout(() => play(tones.complete3), 500);
  },
};
