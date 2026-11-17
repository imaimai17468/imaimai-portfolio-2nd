import type { MenuFrame } from "../menu-scroller";

// Tracks the sub row on the band so a piece rattles as a sub slide lands on
// it, rather than when the selection passes the halfway point.
export interface ArrivalState {
  readonly owner: number;
  // True once the sub position has left an item, so the next landing counts.
  readonly isArmed: boolean;
  // The sub position at the previous paint, to tell landing from sweeping past.
  readonly previous: number;
}

// Further than SLIDING from an item, the row is sliding. Closer than LANDING
// and moving less than SLOW per paint, it is settling onto the item, and the
// rattle starts so it meets the landing rather than following the spring's
// long tail. A row sweeping over an item on its way elsewhere moves faster.
const SLIDING = 0.3;
const LANDING = 0.12;
const SLOW = 0.04;

export function detectArrival(state: ArrivalState, frame: MenuFrame): { state: ArrivalState; arrivedSub: number | null } {
  if (frame.subOwner !== state.owner) {
    return { state: { owner: frame.subOwner, isArmed: false, previous: frame.sub }, arrivedSub: null };
  }
  const nearest = Math.round(frame.sub);
  const distance = Math.abs(frame.sub - nearest);
  const speed = Math.abs(frame.sub - state.previous);
  const next = { ...state, previous: frame.sub };
  if (distance > SLIDING) return { state: { ...next, isArmed: true }, arrivedSub: null };
  if (state.isArmed && distance < LANDING && speed < SLOW) return { state: { ...next, isArmed: false }, arrivedSub: nearest };
  return { state: next, arrivedSub: null };
}
