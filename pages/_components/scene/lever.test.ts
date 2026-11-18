import { describe, expect, test } from "vite-plus/test";
import { LEVER_MS, measureLever } from "./lever";

describe("measureLever", () => {
  const flip = { from: 0.4, to: -0.4 };

  test("starts where the lever stood", () => {
    expect(measureLever(flip, 0)).toBeCloseTo(0.4);
  });

  test("swings past the far side a little before it settles, like a snapping toggle", () => {
    const angles = Array.from({ length: LEVER_MS }, (_, ms) => measureLever(flip, ms) ?? -0.4);
    expect(Math.min(...angles)).toBeLessThan(-0.4);
    expect(Math.min(...angles)).toBeGreaterThan(-0.5);
  });

  test("covers most of the swing in the first half, so the switch answers the tap at once", () => {
    expect(measureLever(flip, LEVER_MS / 2) ?? 0).toBeLessThan(-0.3);
  });

  test("ends once its time is up", () => {
    expect(measureLever(flip, LEVER_MS)).toBeNull();
  });
});
