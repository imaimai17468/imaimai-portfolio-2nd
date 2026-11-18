// A piece that a sub step brings onto the band rattles like a chess piece set
// down a little crooked: it tips onto the rim of its base, drops back flat
// with a knock, and hops a few times lower each time. The direction and the
// strength are drawn at random, so no two arrivals look the same.
export interface Wobble {
  // The direction the piece tips toward, in radians on the table: 0 is +x and
  // a quarter turn is +z.
  readonly direction: number;
  readonly amplitude: number;
}

// Each hop is shorter and lower than the last, so the knocks come faster as
// the piece settles, the rhythm of something set down on a table. A row of
// equal hops reads as a shiver instead.
export const HOPS: readonly { readonly ms: number; readonly height: number }[] = [
  { ms: 110, height: 1 },
  { ms: 65, height: 0.32 },
  { ms: 40, height: 0.1 },
];
export const WOBBLE_MS = HOPS.reduce((sum, hop) => sum + hop.ms, 0);
const MIN_DEGREES = 8;
const MAX_DEGREES = 12;

export function createWobble(random: () => number): Wobble {
  const direction = random() * 2 * Math.PI;
  const degrees = MIN_DEGREES + random() * (MAX_DEGREES - MIN_DEGREES);
  return { direction, amplitude: (degrees * Math.PI) / 180 };
}

// How far the piece is tipped `elapsedMs` after it arrives, or null once it
// has settled. The angle never goes past upright, and it reaches upright with
// its full speed, which reads as the base knocking on the table.
export function measureWobble(wobble: Wobble, elapsedMs: number): number | null {
  let start = 0;
  for (const hop of HOPS) {
    if (elapsedMs < start + hop.ms) return wobble.amplitude * hop.height * Math.sin((Math.PI * (elapsedMs - start)) / hop.ms);
    start += hop.ms;
  }
  return null;
}

// Where the base centre moves when the piece tips by `angle` about the rim on
// the `direction` side, `radius` away: the rim stays on the table, so the
// centre rises and slides toward the lean.
export function measureRimOffset(angle: number, direction: number, radius: number): { x: number; y: number; z: number } {
  const slide = radius * (1 - Math.cos(angle));
  return { x: slide * Math.cos(direction), y: radius * Math.sin(angle), z: slide * Math.sin(direction) };
}
