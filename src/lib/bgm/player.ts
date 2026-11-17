export interface BgmPlayer {
  start(): void;
  stop(): void;
}

export interface AudibleRange {
  readonly start: number;
  readonly end: number;
}

type FetchAudio = (url: string) => Promise<Response>;

const SILENCE_THRESHOLD = 1e-4;
const FADE_IN_SECONDS = 1;
const FADE_OUT_SECONDS = 0.3;

// An AAC file carries silent priming and padding samples, and a browser may
// keep them when it decodes the file, which leaves a gap at every repeat. The
// loop runs between the first and the last sample louder than the threshold.
export function findAudibleRange(samples: Float32Array, sampleRate: number): AudibleRange {
  let first = 0;
  while (first < samples.length && Math.abs(samples[first] ?? 0) < SILENCE_THRESHOLD) first += 1;
  let last = samples.length - 1;
  while (last > first && Math.abs(samples[last] ?? 0) < SILENCE_THRESHOLD) last -= 1;
  if (first >= last) return { start: 0, end: samples.length / sampleRate };
  return { start: first / sampleRate, end: (last + 1) / sampleRate };
}

// start() must run inside a user gesture, because a browser keeps an
// AudioContext created or resumed outside one suspended.
export function createBgmPlayer(fetchAudio: FetchAudio, url: string, volume: number): BgmPlayer {
  let context: AudioContext | undefined;
  let decoded: Promise<AudioBuffer> | undefined;
  let playing: { source?: AudioBufferSourceNode; gain?: GainNode; isStopped: boolean } | undefined;

  return {
    // A browser that did not count an earlier event as a user gesture leaves
    // the context suspended while the loop is already scheduled, so every
    // call resumes it before checking whether the loop is playing.
    start() {
      context ??= new AudioContext();
      const audioContext = context;
      if (audioContext.state === "suspended") void audioContext.resume();
      if (playing) return;
      decoded ??= fetchAudio(url)
        .then((response) => response.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data));

      const current: { source?: AudioBufferSourceNode; gain?: GainNode; isStopped: boolean } = { isStopped: false };
      playing = current;
      decoded
        .then((buffer) => {
          if (current.isStopped) return;
          const range = findAudibleRange(buffer.getChannelData(0), buffer.sampleRate);
          const gain = audioContext.createGain();
          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + FADE_IN_SECONDS);
          gain.connect(audioContext.destination);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.loopStart = range.start;
          source.loopEnd = range.end;
          source.connect(gain);
          source.start(0, range.start);
          current.source = source;
          current.gain = gain;
        })
        .catch(() => {
          decoded = undefined;
          if (playing === current) playing = undefined;
        });
    },
    stop() {
      const current = playing;
      if (!current || !context) return;
      playing = undefined;
      current.isStopped = true;
      const { source, gain } = current;
      if (!source || !gain) return;
      const now = context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS);
      source.stop(now + FADE_OUT_SECONDS);
    },
  };
}

export const bgm = createBgmPlayer((url) => fetch(url), "/bgm.m4a", 0.35);
