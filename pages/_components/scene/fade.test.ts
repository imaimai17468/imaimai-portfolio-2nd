import { describe, expect, test } from "vite-plus/test";
import { measureFade } from "./fade";

describe("measureFade", () => {
  const fade = { from: 1, to: 0, durationMs: 250 };

  test("starts at its first value", () => {
    expect(measureFade(fade, 0)).toBe(1);
  });

  test("ends at its last value and stays there", () => {
    expect(measureFade(fade, 250)).toBe(0);
    expect(measureFade(fade, 400)).toBe(0);
  });

  test("eases out: past halfway at half the time", () => {
    expect(measureFade({ from: 0, to: 1, durationMs: 250 }, 125)).toBeGreaterThan(0.75);
  });
});
