import type { MenuAxis } from "./menu-motion";

// A finger swiping sideways drifts up or down a little on the way, and the
// main column followed that drift until it changed the selected item. A drag
// now leads with the axis it started along, and the other axis moves only
// once the finger has gone DRIFT_PX across it, so a circling drag still moves
// both. A start up to about 55° from level counts as sideways, because a
// thumb swiping across a phone arcs.
export const DRIFT_PX = 32;
const SIDEWAYS_SLOPE = 1.4;

export function pickLead(dx: number, dy: number): MenuAxis {
  return Math.abs(dy) <= Math.abs(dx) * SIDEWAYS_SLOPE ? "sub" : "main";
}

// How far the axis the drag does not lead with has moved, given how far the
// finger has gone along it since the drag started.
export function measureCross(travel: number): number {
  if (Math.abs(travel) <= DRIFT_PX) return 0;
  return travel - Math.sign(travel) * DRIFT_PX;
}
