import { describe, expect, test } from "vite-plus/test";
import { createMotes, measureMote } from "./dust";

const box = { centerX: 0, centerZ: 0, radius: 500, height: 300 };

describe("createMotes", () => {
  test("places the asked number of motes inside the box above the table", () => {
    let seed = 0;
    const motes = createMotes(() => (seed = (seed + 0.37) % 1), 40, box);
    expect(motes).toHaveLength(40);
    for (const mote of motes) {
      expect(Math.abs(mote.x)).toBeLessThanOrEqual(500);
      expect(Math.abs(mote.z)).toBeLessThanOrEqual(500);
      expect(mote.y).toBeGreaterThan(0);
      expect(mote.y).toBeLessThanOrEqual(300);
    }
  });
});

describe("measureMote", () => {
  const mote = { x: 10, y: 100, z: -20, size: 2, phase: 0, speed: 1 };

  test("starts where it was placed", () => {
    expect(measureMote(mote, 0)).toEqual({ x: 10, y: 100, z: -20 });
  });

  test("drifts only a little, so the motes hang in the light", () => {
    for (let t = 0; t < 20000; t += 997) {
      const at = measureMote(mote, t);
      expect(Math.hypot(at.x - 10, at.y - 100, at.z + 20)).toBeLessThan(40);
    }
  });
});
