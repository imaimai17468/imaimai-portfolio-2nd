import { describe, expect, test } from "vite-plus/test";
import { DROP_MS, INTRO_DELAY_MS, measureDrop, STAGGER_MS } from "./intro";

describe("measureDrop", () => {
  test("holds every piece out of sight while the board tilts into place", () => {
    expect(measureDrop(0, INTRO_DELAY_MS - 1, false)).toEqual({ lift: 1, opacity: 0, hasLanded: false });
  });

  test("lets each piece fall after the one before it", () => {
    const at = INTRO_DELAY_MS + STAGGER_MS / 2;
    expect(measureDrop(0, at, false).opacity).toBeGreaterThan(0);
    expect(measureDrop(1, at, false).opacity).toBe(0);
  });

  test("falls faster as it nears the table, like something let go of", () => {
    const quarter = measureDrop(0, INTRO_DELAY_MS + DROP_MS / 4, false).lift;
    const threeQuarters = measureDrop(0, INTRO_DELAY_MS + (DROP_MS * 3) / 4, false).lift;
    expect(1 - quarter).toBeLessThan(quarter - threeQuarters);
  });

  test("stands on the table, fully shown, once its fall is over", () => {
    expect(measureDrop(2, INTRO_DELAY_MS + 2 * STAGGER_MS + DROP_MS, false)).toEqual({ lift: 0, opacity: 1, hasLanded: true });
  });

  test("with reduced motion, fades in where it stands instead of falling", () => {
    const drop = measureDrop(0, INTRO_DELAY_MS + DROP_MS / 4, true);
    expect(drop.lift).toBe(0);
    expect(drop.opacity).toBeGreaterThan(0);
    expect(drop.opacity).toBeLessThan(1);
  });
});
