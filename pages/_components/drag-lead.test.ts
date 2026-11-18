import { describe, expect, test } from "vite-plus/test";
import { DRIFT_PX, measureCross, pickLead } from "./drag-lead";

describe("pickLead", () => {
  test("a drag that starts sideways leads with the sub row", () => {
    expect(pickLead(10, 6)).toBe("sub");
  });

  test("a drag that starts upright leads with the main column", () => {
    expect(pickLead(3, -9)).toBe("main");
  });
});

describe("measureCross", () => {
  test("drift across a sideways swipe moves nothing", () => {
    expect(measureCross(DRIFT_PX - 1)).toBe(0);
    expect(measureCross(-(DRIFT_PX - 1))).toBe(0);
  });

  test("past the drift allowance the cross axis follows from where the allowance ends", () => {
    expect(measureCross(DRIFT_PX + 10)).toBe(10);
    expect(measureCross(-(DRIFT_PX + 10))).toBe(-10);
  });
});
