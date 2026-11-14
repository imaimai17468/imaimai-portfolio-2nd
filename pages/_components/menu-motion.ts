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

// Inside the list a dragged position is pulled toward the nearest item: near
// an item it moves less than the finger, between items more, so the list
// clicks from one item to the next. An exponent of 1 leaves it unchanged.
export function applyDetent(position: number, exponent: number): number {
  const nearest = Math.round(position);
  const offset = position - nearest;
  return nearest + Math.sign(offset) * 0.5 * (Math.abs(offset) * 2) ** exponent;
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

export type ExitDirection = "up" | "down" | "left" | "right";

export interface Exit {
  readonly direction: ExitDirection;
  readonly distance: number;
}

const FARTHEST_EXIT = 3;

// Everything on screen leaves away from the opened item: rows above go up,
// rows below go down, and in its own row what lies left goes left and what
// lies right goes right. The distance orders the exits, farthest first.
export function findRowExit(row: number, selectedRow: number): Exit | null {
  if (row === selectedRow) return null;
  return {
    direction: row < selectedRow ? "up" : "down",
    distance: Math.min(Math.abs(row - selectedRow) + 1, FARTHEST_EXIT),
  };
}

export function findSubExit(sub: number, selectedSub: number): Exit | null {
  if (sub === selectedSub) return null;
  return { direction: sub < selectedSub ? "left" : "right", distance: Math.min(Math.abs(sub - selectedSub), FARTHEST_EXIT) };
}

export function findLeadExit(selectedSub: number): Exit {
  return { direction: "left", distance: Math.min(selectedSub + 1, FARTHEST_EXIT) };
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Rect extends Point {
  readonly width: number;
}

// The translation that moves an element whose centre will rest at `center`,
// and whose final size is `size`, so its top-left corner lands on the target.
// Scaling happens about the centre, so only the centre and the final size count.
export function measureHeroMove(center: Point, size: number, target: Point) {
  return { dx: target.x + size / 2 - center.x, dy: target.y + size / 2 - center.y };
}

// How the label becomes the heading: it first grows in place about the middle
// of its text's top edge, so it stays centred under the icon and clear of it,
// and the translation then carries the grown text's top-left corner onto the
// heading's. `text` is where the label's text will rest and `box` where the
// label's own box will, both in viewport coordinates.
export function measureLabelMove(text: Rect, box: Point, heading: Point, scale: number) {
  const middle = text.x + text.width / 2;
  return {
    originX: middle - box.x,
    originY: text.y - box.y,
    dx: heading.x - (middle - (text.width * scale) / 2),
    dy: heading.y - text.y,
  };
}

// Where an element's centre will be once the menu stops moving: the rows are
// translated by the main position and the selected row by its shift, so the
// distance left to travel on each axis is added to where it is now.
export function projectRestingCenter(
  current: Point,
  motion: { readonly shift: number; readonly subIndex: number; readonly subWidth: number; readonly main: number; readonly mainIndex: number; readonly rowHeight: number },
): Point {
  return {
    x: current.x + (motion.shift - motion.subIndex) * motion.subWidth,
    y: current.y + (motion.main - motion.mainIndex) * motion.rowHeight,
  };
}
