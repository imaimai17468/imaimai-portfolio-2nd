import { describe, expect, test } from "vite-plus/test";
import { chooseQualityLevel } from "./quality";

function samples(...runs: (readonly [count: number, ms: number])[]): number[] {
  return runs.flatMap(([count, ms]) => Array.from({ length: count }, () => ms));
}

describe("chooseQualityLevel", () => {
  test("keeps the level until 30 frames have been measured", () => {
    expect(chooseQualityLevel(samples([29, 40]), 0)).toBe(0);
  });

  test("steps down when the median frame takes longer than 20 ms", () => {
    expect(chooseQualityLevel(samples([30, 25]), 0)).toBe(1);
  });

  test("stays at the lowest level", () => {
    expect(chooseQualityLevel(samples([30, 25]), 2)).toBe(2);
  });

  test("keeps the level when frames are fast", () => {
    expect(chooseQualityLevel(samples([30, 16]), 0)).toBe(0);
  });

  test("keeps the level when the median is exactly 20 ms", () => {
    expect(chooseQualityLevel(samples([15, 10], [15, 30]), 0)).toBe(0);
  });

  test("steps down when most frames are slow", () => {
    expect(chooseQualityLevel(samples([14, 10], [16, 30]), 0)).toBe(1);
  });
});
