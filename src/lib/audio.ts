// Generate a sine wave WAV as an HTMLAudioElement.
// Uses HTMLAudioElement instead of Web Audio API — far more reliable on iOS.
function makeWAV(freqs: number[], duration: number, volume = 0.5): HTMLAudioElement {
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

  const audio = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
  audio.preload = 'auto';
  return audio;
}

// Pre-generate all tones at module load (no user gesture needed just to create them)
const tones = {
  inhale:    makeWAV([528, 792], 0.6, 0.6),
  hold:      makeWAV([396], 0.5, 0.45),
  exhale:    makeWAV([330, 264], 0.7, 0.6),
  hold2:     makeWAV([370], 0.5, 0.4),
  complete1: makeWAV([440], 0.4, 0.6),
  complete2: makeWAV([550], 0.4, 0.6),
  complete3: makeWAV([660], 0.7, 0.65),
};

function play(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Call once inside a user gesture (tap) to unlock HTMLAudioElement playback on iOS.
// Playing one element inside a gesture unlocks the audio session for all elements on the page.
export function unlockAudio(): Promise<void> {
  const a = tones.inhale;
  const origVol = a.volume;
  a.volume = 0;
  return a.play()
    .then(() => { a.pause(); a.currentTime = 0; a.volume = origVol; })
    .catch(() => { a.volume = origVol; });
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
