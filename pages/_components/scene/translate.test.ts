import { describe, expect, test } from "vite-plus/test";
import { readTranslate } from "./translate";

describe("readTranslate", () => {
  test("reads none as no offset", () => {
    expect(readTranslate("none")).toEqual({ x: 0, y: 0 });
  });

  test("reads a single length as a horizontal offset", () => {
    expect(readTranslate("12px")).toEqual({ x: 12, y: 0 });
  });

  test("reads two lengths as x and y", () => {
    expect(readTranslate("12px -40px")).toEqual({ x: 12, y: -40 });
  });

  test("ignores the z length", () => {
    expect(readTranslate("12px -40px 0px")).toEqual({ x: 12, y: -40 });
  });
});
