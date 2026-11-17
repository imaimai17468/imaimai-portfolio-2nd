// A piece that a sub step brings onto the band rocks on its base a few times
// and settles, in a direction and with a strength drawn at random, so no two
// arrivals look the same.
export interface Wobble {
  // The direction the piece first leans toward, in radians on the table.
  readonly direction: number;
  readonly amplitude: number;
}

export const WOBBLE_MS = 650;
const FREQUENCY_HZ = 4.5;
const DECAY_MS = 180;
const MIN_DEGREES = 6;
const MAX_DEGREES = 10;

export function createWobble(random: () => number): Wobble {
  const direction = random() * 2 * Math.PI;
  const degrees = MIN_DEGREES + random() * (MAX_DEGREES - MIN_DEGREES);
  return { direction, amplitude: (degrees * Math.PI) / 180 };
}

// The tilt about the table's x and z axes `elapsedMs` after the arrival, or
// null once the wobble is over. Leaning toward `direction` turns the piece
// about the axis across it.
export function measureWobble(wobble: Wobble, elapsedMs: number): { x: number; z: number } | null {
  if (elapsedMs >= WOBBLE_MS) return null;
  const swing = wobble.amplitude * Math.exp(-elapsedMs / DECAY_MS) * Math.sin((2 * Math.PI * FREQUENCY_HZ * elapsedMs) / 1000);
  return { x: swing * Math.sin(wobble.direction), z: -swing * Math.cos(wobble.direction) };
}
