import { describe, expect, test } from "vite-plus/test";
import { MENU } from "../menu-content";
import { modelUrlOf, readTokenColor, readTokenNumber } from "./tokens";

describe("readTokenColor", () => {
  test("reads a hex token with surrounding spaces", () => {
    expect(readTokenColor(() => " #f2f2f0 ", "--piece-white")).toBe(0xf2f2f0);
  });

  test("returns null for an empty value", () => {
    expect(readTokenColor(() => "", "--x")).toBeNull();
  });

  test("returns null for a value that is not a six-digit hex", () => {
    expect(readTokenColor(() => "red", "--x")).toBeNull();
  });
});

describe("modelUrlOf", () => {
  test("names a main item's model", () => {
    expect(modelUrlOf("career", null)).toBe("/models/career.glb");
  });

  test("names a sub item's model", () => {
    expect(modelUrlOf("career", "kosen")).toBe("/models/career--kosen.glb");
  });

  test("every menu item has a model file", () => {
    const urls = MENU.flatMap((item) => [modelUrlOf(item.id, null), ...item.subs.map((sub) => modelUrlOf(item.id, sub.id))]);
    const files = new Set(Object.keys(import.meta.glob("/public/models/*.glb")).map((path) => path.replace(/^\/public/, "")));
    const missing = urls.filter((url) => !files.has(url));
    expect(missing).toEqual([]);
  });
});

describe("readTokenNumber", () => {
  test("reads a plain number the stylesheet declares", () => {
    expect(readTokenNumber(() => " 0.45", "--scene-shadow-strength")).toBe(0.45);
  });

  test("gives null for a missing or non-numeric value, so the caller keeps its default", () => {
    expect(readTokenNumber(() => "", "--scene-shadow-strength")).toBeNull();
    expect(readTokenNumber(() => "12px", "--scene-shadow-strength")).toBeNull();
  });
});
