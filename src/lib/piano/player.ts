import audioUrl from "snd-lib/assets/sounds/sprite/02/audioSprite.m4a?url";
import { findSegment, type PianoSound } from "./sprite";

export interface PianoVoice {
  stop(): void;
}

export interface PianoPlayer {
  play(sound: PianoSound, volume?: number): PianoVoice;
  unlock(): void;
}

type FetchAudio = (url: string) => Promise<Response>;

// Browsers keep an AudioContext suspended until a user gesture resumes it, and
// a scroll is not such a gesture, so unlock() runs from a tap or a key press.
export function createPianoPlayer(fetchAudio: FetchAudio): PianoPlayer {
  let context: AudioContext | undefined;
  let decoded: Promise<AudioBuffer> | undefined;

  function getContext(): AudioContext {
    context ??= new AudioContext();
    return context;
  }

  return {
    unlock() {
      const audioContext = getContext();
      if (audioContext.state === "suspended") void audioContext.resume();
    },
    play(sound, volume = 1) {
      const audioContext = getContext();
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
