import audioUrl from "snd-lib/assets/sounds/sprite/02/audioSprite.m4a?url";
import { findSegment, type PianoSound } from "./sprite";

export interface PianoVoice {
  stop(): void;
}

export interface PianoPlayer {
  play(sound: PianoSound, volume?: number): PianoVoice;
}

type FetchAudio = (url: string) => Promise<Response>;

// Browsers start an AudioContext suspended unless a user gesture creates it,
// so the context is created on the first play() rather than at import.
export function createPianoPlayer(fetchAudio: FetchAudio): PianoPlayer {
  let context: AudioContext | undefined;
  let decoded: Promise<AudioBuffer> | undefined;

  return {
    play(sound, volume = 1) {
      context ??= new AudioContext();
      const audioContext = context;
      decoded ??= fetchAudio(audioUrl)
        .then((response) => response.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data));

      const { offset, duration, loop } = findSegment(sound);
      let isStopped = false;
      let source: AudioBufferSourceNode | undefined;

      decoded
        .then((buffer) => {
          if (isStopped) return;
          const gain = audioContext.createGain();
          gain.gain.value = volume;
          gain.connect(audioContext.destination);
          source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(gain);
          if (loop) {
            source.loop = true;
            source.loopStart = offset;
            source.loopEnd = offset + duration;
            source.start(0, offset);
          } else {
            source.start(0, offset, duration);
          }
        })
        .catch(() => {
          decoded = undefined;
        });

      return {
        stop() {
          isStopped = true;
          source?.stop();
        },
      };
    },
  };
}

export const piano = createPianoPlayer((url) => fetch(url));
