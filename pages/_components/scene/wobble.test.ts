import { describe, expect, test } from "vite-plus/test";
import { createWobble, HOPS, measureRimOffset, measureWobble, WOBBLE_MS } from "./wobble";

describe("createWobble", () => {
  test("draws the direction and the strength from the random source", () => {
    const values = [0.25, 0];
    const wobble = createWobble(() => values.shift() ?? 0);
    expect(wobble.direction).toBeCloseTo(Math.PI / 2);
    expect(wobble.amplitude).toBeCloseTo((8 * Math.PI) / 180);
  });

  test("keeps the strongest tip under 12 degrees", () => {
    expect(createWobble(() => 0.999).amplitude).toBeLessThan((12 * Math.PI) / 180);
  });
});

describe("measureWobble", () => {
  const wobble = { direction: 0, amplitude: 0.1 };
  const firstEnd = HOPS[0]?.ms ?? 0;
  const secondEnd = firstEnd + (HOPS[1]?.ms ?? 0);

  test("starts upright", () => {
    expect(measureWobble(wobble, 0)).toBeCloseTo(0);
  });

  test("tips to one side only, like a piece rocking on the rim of its base", () => {
    for (let t = 0; t < WOBBLE_MS; t += 7) expect(measureWobble(wobble, t) ?? 0).toBeGreaterThanOrEqual(0);
  });

  test("lands upright between hops", () => {
    expect(measureWobble(wobble, firstEnd)).toBeCloseTo(0, 5);
    expect(measureWobble(wobble, secondEnd)).toBeCloseTo(0, 5);
  });

  test("each hop is shorter and lower than the one before, so the knocks come faster as it settles", () => {
    expect(HOPS.map((hop) => hop.ms)).toEqual([...HOPS.map((hop) => hop.ms)].sort((a, b) => b - a));
    const first = measureWobble(wobble, firstEnd / 2) ?? 0;
    const second = measureWobble(wobble, firstEnd + (HOPS[1]?.ms ?? 0) / 2) ?? 0;
    expect(first).toBeCloseTo(0.1);
    expect(second).toBeLessThan(first * 0.5);
  });

  test("ends once its time is up", () => {
    expect(measureWobble(wobble, WOBBLE_MS)).toBeNull();
  });
});

describe("measureRimOffset", () => {
  test("does not move an upright piece", () => {
    const offset = measureRimOffset(0, 0, 10);
    expect(offset.x).toBeCloseTo(0);
    expect(offset.y).toBeCloseTo(0);
    expect(offset.z).toBeCloseTo(0);
  });

  test("lifts the base centre and moves it toward the lean, so the rim stays on the table", () => {
    const offset = measureRimOffset(0.1, 0, 10);
    expect(offset.y).toBeCloseTo(10 * Math.sin(0.1));
    expect(offset.x).toBeCloseTo(10 * (1 - Math.cos(0.1)));
    expect(offset.z).toBeCloseTo(0);
  });
});
