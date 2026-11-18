// The sound switch's lever swings across when the sound is turned on or off,
// rather than jumping, and snaps a little past the far side before it settles,
// the way a toggle switch clicks over.
export interface LeverSwing {
  readonly from: number;
  readonly to: number;
}

export const LEVER_MS = 220;
// How far past the far side the swing goes, as the back-easing constant: 1.2
// carries it about 5% of the swing past.
const OVERSHOOT = 1.2;

// The lever's angle `elapsedMs` after the swing started, or null once it has
// settled on `to`.
export function measureLever(swing: LeverSwing, elapsedMs: number): number | null {
  if (elapsedMs >= LEVER_MS) return null;
  const rest = Math.max(elapsedMs, 0) / LEVER_MS - 1;
  const eased = 1 + (OVERSHOOT + 1) * rest ** 3 + OVERSHOOT * rest ** 2;
  return swing.from + (swing.to - swing.from) * eased;
}
