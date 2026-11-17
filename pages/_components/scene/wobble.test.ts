import { describe, expect, test } from "vite-plus/test";
import { createWobble, measureWobble, WOBBLE_MS } from "./wobble";

describe("createWobble", () => {
  test("draws the direction and the strength from the random source", () => {
    const values = [0.25, 0];
    const wobble = createWobble(() => values.shift() ?? 0);
    expect(wobble.direction).toBeCloseTo(Math.PI / 2);
    expect(wobble.amplitude).toBeCloseTo((6 * Math.PI) / 180);
  });

  test("keeps the strongest tilt under 10 degrees", () => {
    expect(createWobble(() => 0.999).amplitude).toBeLessThan((10 * Math.PI) / 180);
  });
});

describe("measureWobble", () => {
  const wobble = { direction: 0, amplitude: 0.1 };

  test("starts upright", () => {
    const tilt = measureWobble(wobble, 0);
    expect(tilt?.x).toBeCloseTo(0);
    expect(tilt?.z).toBeCloseTo(0);
  });

  test("tilts about the axis across its direction", () => {
    const tilt = measureWobble({ direction: 0, amplitude: 0.1 }, 40);
    expect(tilt?.x).toBeCloseTo(0);
    expect(Math.abs(tilt?.z ?? 0)).toBeGreaterThan(0.01);
  });

  test("settles: a later swing is smaller than an earlier one", () => {
    const early = Math.abs(measureWobble(wobble, 60)?.z ?? 0);
    const late = Math.abs(measureWobble(wobble, 60 + 1000 / 4.5)?.z ?? 0);
    expect(late).toBeLessThan(early);
  });

  test("ends once its time is up", () => {
    expect(measureWobble(wobble, WOBBLE_MS)).toBeNull();
  });
});
