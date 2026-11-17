import { Plane, Raycaster, Vector2, Vector3, type Camera } from "three";
import { measureFocus } from "../menu-motion";
import { measureRowShift } from "../menu-paint";
import type { MenuFrame } from "../menu-scroller";

// Where a piece's 2D icon sits on screen, in CSS px, while the menu rests at
// its first item and the row is not shifted. `sub` is null for a main item.
export interface SlotOrigin {
  readonly id: string;
  readonly modelUrl: string;
  readonly row: number;
  readonly sub: number | null;
  readonly x: number;
  readonly y: number;
}

export interface ScreenPoint {
  readonly x: number;
  readonly y: number;
}

const TABLE = new Plane(new Vector3(0, 1, 0), 0);

// The same movement `paintRow` gives the DOM: every row moves up by the main
// position, and a row moves left by its own sub shift, main item included.
export function measureSlotCenter(
  origin: SlotOrigin,
  frame: MenuFrame,
  layout: { readonly row: number; readonly subWidth: number },
): ScreenPoint {
  return {
    x: origin.x - measureRowShift(origin.row, frame) * layout.subWidth,
    y: origin.y - frame.main * layout.row,
  };
}

// A main piece is always shown and is focused as its row nears the band. A sub
// piece shows only while its row is near the band, as the DOM's sub group does.
export function measureEmphasis(origin: SlotOrigin, frame: MenuFrame): { visibility: number; focus: number } {
  const rowFocus = measureFocus(origin.row - frame.main);
  if (origin.sub === null) return { visibility: 1, focus: rowFocus };
  return { visibility: rowFocus, focus: measureFocus(origin.sub - measureRowShift(origin.row, frame)) };
}

export function toNdc(point: ScreenPoint, viewport: { readonly width: number; readonly height: number }): ScreenPoint {
  return { x: (point.x / viewport.width) * 2 - 1, y: 1 - (point.y / viewport.height) * 2 };
}

// The point on the tabletop (y = 0) that the camera sees at `ndc`, or null when
// that ray never meets the table in front of the camera.
export function projectToTable(ndc: ScreenPoint, camera: Camera): Vector3 | null {
  camera.updateMatrixWorld();
  const raycaster = new Raycaster();
  raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), camera);
  return raycaster.ray.intersectPlane(TABLE, new Vector3());
}
