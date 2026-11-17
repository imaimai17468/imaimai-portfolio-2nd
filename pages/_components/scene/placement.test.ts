import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, test } from "vite-plus/test";
import type { MenuFrame } from "../menu-scroller";
import { measureEmphasis, measureSlotCenter, placeBoardCamera, projectToTable, toNdc, toTablePoint, type SlotOrigin } from "./placement";

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

describe("toTablePoint", () => {
  const board = { perspective: 1000, tilt: 0, twist: 0, originX: 500, originY: 300 };

  test("puts the board's transform origin at the table's origin", () => {
    expect(toTablePoint({ x: 500, y: 300 }, board)).toEqual({ x: 0, z: 0 });
  });

  test("maps right on the board to +x and down on the board to +z", () => {
    expect(toTablePoint({ x: 600, y: 350 }, board)).toEqual({ x: 100, z: 50 });
  });

  test("turns a point clockwise by the board's twist, as CSS rotateZ does", () => {
    const point = toTablePoint({ x: 600, y: 300 }, { ...board, twist: Math.PI / 2 });
    expect(point.x).toBeCloseTo(0);
    expect(point.z).toBeCloseTo(100);
  });
});

describe("placeBoardCamera", () => {
  test("a flat board puts the camera straight above the origin at the perspective distance", () => {
    const camera = new PerspectiveCamera();
    placeBoardCamera(camera, { perspective: 1000, tilt: 0, twist: 0, originX: 0, originY: 0 }, 800);
    expect(camera.position.x).toBeCloseTo(0);
    expect(camera.position.y).toBeCloseTo(1000);
    expect(camera.position.z).toBeCloseTo(0);
    expect(camera.fov).toBeCloseTo((2 * Math.atan(400 / 1000) * 180) / Math.PI);
  });

  test("a board leaning back puts the camera in front of it, so the table's origin stays at the screen centre", () => {
    const camera = new PerspectiveCamera(30, 1.5, 1, 10000);
    const board = { perspective: 1000, tilt: Math.PI / 4, twist: 0, originX: 0, originY: 0 };
    placeBoardCamera(camera, board, 800);
    expect(camera.position.z).toBeGreaterThan(0);
    const point = projectToTable({ x: 0, y: 0 }, camera);
    expect(point?.length()).toBeLessThan(1e-6);
  });

  test("a point below the origin on a leaning board shows below the screen centre", () => {
    const camera = new PerspectiveCamera(30, 1.5, 1, 10000);
    placeBoardCamera(camera, { perspective: 1000, tilt: Math.PI / 4, twist: 0, originX: 0, originY: 0 }, 800);
    camera.updateMatrixWorld();
    const projected = new Vector3(0, 0, 100).project(camera);
    expect(projected.y).toBeLessThan(0);
    expect(projected.x).toBeCloseTo(0);
  });
});
