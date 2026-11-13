import type { PianoSound } from "../../src/lib/piano/sprite";

const MAIN_STEP_SOUNDS = ["tap_01", "tap_02", "tap_03", "tap_04", "tap_05"] as const satisfies readonly PianoSound[];
const SUB_STEP_SOUNDS = [
  "swipe_01",
  "swipe_02",
  "swipe_03",
  "swipe_04",
  "swipe_05",
] as const satisfies readonly PianoSound[];

export type MenuAxis = "main" | "sub";

export function findIndexAt(offset: number, step: number, count: number): number {
  if (step <= 0 || count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(offset / step)));
}

export function pickStepSound(axis: MenuAxis, index: number): PianoSound {
  const sounds = axis === "main" ? MAIN_STEP_SOUNDS : SUB_STEP_SOUNDS;
  return sounds[index % sounds.length] ?? sounds[0];
}

export function isPushingPastEdge(offset: number, maxOffset: number, delta: number): boolean {
  return (delta < 0 && offset <= 0) || (delta > 0 && offset >= maxOffset - 1);
}
