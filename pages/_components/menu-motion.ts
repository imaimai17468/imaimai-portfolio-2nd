import type { PianoSound } from "../../src/lib/piano/sprite";

const TAP_SOUNDS = ["tap_01", "tap_02", "tap_03", "tap_04", "tap_05"] as const satisfies readonly PianoSound[];

export type MenuAxis = "main" | "sub";

export interface SpringState {
  readonly position: number;
  readonly velocity: number;
}

export function pickTapSound(count: number): PianoSound {
  return TAP_SOUNDS[count % TAP_SOUNDS.length] ?? TAP_SOUNDS[0];
}

export function clampIndex(position: number, count: number): number {
  return Math.min(Math.max(count - 1, 0), Math.max(0, Math.round(position)));
}

// Past either end the position moves a fraction of the drag, so the list
// stretches instead of stopping dead.
export function applyRubberBand(position: number, count: number): number {
  const max = Math.max(count - 1, 0);
  if (position < 0) return -(1 - 1 / (1 - position * 0.55)) / 0.55;
  if (position > max) return max + (1 - 1 / (1 + (position - max) * 0.55)) / 0.55;
  return position;
}

// Where a release lands: the position the current velocity would carry it to
// over a short glide, rounded to an item.
export function projectTarget(position: number, velocity: number, count: number): number {
  return clampIndex(position + velocity * 0.18, count);
}

// One step of a critically damped spring, which reaches the target from any
// starting velocity without overshooting it.
export function stepSpring(state: SpringState, target: number, dt: number, period: number): SpringState {
  const stiffness = (2 * Math.PI / period) ** 2;
  const damping = 2 * Math.sqrt(stiffness);
  const acceleration = -stiffness * (state.position - target) - damping * state.velocity;
  const velocity = state.velocity + acceleration * dt;
  return { position: state.position + velocity * dt, velocity };
}

export function isSettled(state: SpringState, target: number): boolean {
  return Math.abs(state.position - target) < 0.001 && Math.abs(state.velocity) < 0.01;
}

export function measureFocus(distance: number): number {
  return Math.max(0, 1 - Math.abs(distance));
}
