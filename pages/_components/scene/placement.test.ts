import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, test } from "vite-plus/test";
import type { MenuFrame } from "../menu-scroller";
import { measureEmphasis, measureSlotCenter, projectToTable, toNdc, type SlotOrigin } from "./placement";

const frame: MenuFrame = { main: 3, sub: 1, subOwner: 3, leftover: null };
const layout = { row: 80, subWidth: 120 };

function origin(row: number, sub: number | null): SlotOrigin {
  return { id: `${row}-${sub}`, modelUrl: "/models/x.glb", row, sub, x: 40, y: 400 };
}

describe("measureSlotCenter", () => {
  test("moves a slot up by the main position and left by its row's shift", () => {
    expect(measureSlotCenter(origin(3, null), frame, layout)).toEqual({ x: -80, y: 160 });
  });

  test("leaves a row that does not own the sub shift where it is horizontally", () => {
    expect(measureSlotCenter(origin(1, null), frame, layout)).toEqual({ x: 40, y: 160 });
  });
});

describe("measureEmphasis", () => {
  test("a main piece two rows from the selection is visible and unfocused", () => {
    expect(measureEmphasis(origin(1, null), frame)).toEqual({ visibility: 1, focus: 0 });
  });

  test("the selected sub piece in the selected row is visible and focused", () => {
    expect(measureEmphasis(origin(3, 1), frame)).toEqual({ visibility: 1, focus: 1 });
  });

  test("a sub piece in a row away from the selection is hidden", () => {
    expect(measureEmphasis(origin(1, 0), frame).visibility).toBe(0);
  });
});

describe("toNdc", () => {
  test("maps the top-left corner to (-1, 1)", () => {
    expect(toNdc({ x: 0, y: 0 }, { width: 200, height: 100 })).toEqual({ x: -1, y: 1 });
  });
});

describe("projectToTable", () => {
  test("projects the screen centre of a camera looking straight down onto the point below it", () => {
    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 10, 0);
    // Looking straight down, the default up (+y) is parallel to the view, so
    // the camera's roll would be undefined without an explicit up.
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    const point = projectToTable({ x: 0, y: 0 }, camera);
    expect(point?.distanceTo(new Vector3(0, 0, 0))).toBeLessThan(1e-6);
  });

  test("returns null when the ray points away from the table", () => {
    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 20, 10);
    expect(projectToTable({ x: 0, y: 0 }, camera)).toBeNull();
  });
});
