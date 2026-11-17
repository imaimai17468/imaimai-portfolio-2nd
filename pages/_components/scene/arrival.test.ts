import { describe, expect, test } from "vite-plus/test";
import type { MenuFrame } from "../menu-scroller";
import { detectArrival, type ArrivalState } from "./arrival";

function frame(sub: number, subOwner = 2): MenuFrame {
  return { main: subOwner, sub, subOwner, leftover: null };
}

function armed(previous: number): ArrivalState {
  return { owner: 2, isArmed: true, previous };
}

describe("detectArrival", () => {
  test("a row that comes onto the band with its first item does not count as an arrival", () => {
    const result = detectArrival({ owner: 1, isArmed: false, previous: 0 }, frame(0));
    expect(result.arrivedSub).toBeNull();
    expect(result.state).toEqual({ owner: 2, isArmed: false, previous: 0 });
  });

  test("sliding away from an item arms the next arrival", () => {
    expect(detectArrival({ owner: 2, isArmed: false, previous: 0.35 }, frame(0.4)).state.isArmed).toBe(true);
  });

  test("passing an item mid-slide is not an arrival", () => {
    expect(detectArrival(armed(1.1), frame(1.2)).arrivedSub).toBeNull();
  });

  test("sweeping fast over an item on the way to another is not an arrival", () => {
    expect(detectArrival(armed(0.85), frame(0.97)).arrivedSub).toBeNull();
  });

  test("slowing down onto an item counts before it stops, so the rattle meets the landing", () => {
    expect(detectArrival(armed(1.88), frame(1.9)).arrivedSub).toBe(2);
  });

  test("an arrival counts once", () => {
    const first = detectArrival(armed(1.9995), frame(2.0004));
    expect(first.arrivedSub).toBe(2);
    expect(detectArrival(first.state, frame(2)).arrivedSub).toBeNull();
  });
});
