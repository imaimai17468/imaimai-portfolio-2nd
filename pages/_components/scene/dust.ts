// Specks of dust hanging in the morning light above the table. They drift a
// few px on slow, out-of-step loops, so the air seems to move without anything
// travelling across the screen.
export interface Mote {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly size: number;
  readonly phase: number;
  readonly speed: number;
}

export interface DustBox {
  readonly centerX: number;
  readonly centerZ: number;
  readonly radius: number;
  readonly height: number;
}

const DRIFT_PX = 18;
const RISE_PX = 10;

export function createMotes(random: () => number, count: number, box: DustBox): Mote[] {
  return Array.from({ length: count }, () => ({
    x: box.centerX + (random() * 2 - 1) * box.radius,
    z: box.centerZ + (random() * 2 - 1) * box.radius,
    y: box.height * (0.08 + random() * 0.92),
    size: 2 + random() * 3,
    phase: random() * 2 * Math.PI,
    speed: 0.6 + random() * 0.8,
  }));
}

// Where a mote is `elapsedMs` after the scene started: a loop of about 12 to
// 25 seconds per mote, sideways more than up and down.
export function measureMote(mote: Mote, elapsedMs: number): { x: number; y: number; z: number } {
  const t = (elapsedMs / 1000) * mote.speed * 0.35;
  return {
    x: mote.x + DRIFT_PX * (Math.sin(t + mote.phase) - Math.sin(mote.phase)),
    y: mote.y + RISE_PX * (Math.sin(t * 1.3 + mote.phase * 2) - Math.sin(mote.phase * 2)),
    z: mote.z + DRIFT_PX * (Math.cos(t * 0.8 + mote.phase) - Math.cos(mote.phase)),
  };
}
