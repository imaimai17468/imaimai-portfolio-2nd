import { MENU } from "../menu-content";
import { measureRowShift } from "../menu-paint";
import type { MenuFrame } from "../menu-scroller";
import type { SlotOrigin } from "./placement";
import { modelUrlOf } from "./tokens";

// The switch draws its own track instead of an icon, so it marks the slot.
const MARK_SELECTOR = ".menu-sub-icon, .menu-switch";

// A piece stands a little above the bottom centre of the 2D mark it replaces,
// so it rises out of the place the icon took and clears the label below.
function readBase(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.bottom - rect.height * 0.15 };
}

// Reads where each icon sits now and undoes the paint that moved it, so the
// result holds for any later frame (see measureSlotCenter).
export function readSlotOrigins(
  stage: HTMLElement,
  frame: MenuFrame,
  layout: { readonly row: number; readonly subWidth: number },
): SlotOrigin[] {
  return [...stage.querySelectorAll<HTMLElement>("[data-row]")].flatMap((rowElement) => {
    const row = Number(rowElement.dataset.row);
    const item = MENU[row];
    if (!item) return [];
    const undo = (point: { x: number; y: number }) => ({
      x: point.x + measureRowShift(row, frame) * layout.subWidth,
      y: point.y + frame.main * layout.row,
    });
    const slots: SlotOrigin[] = [];
    const mainIcon = rowElement.querySelector(".menu-main-icon");
    if (mainIcon) slots.push({ id: `main-${row}`, modelUrl: modelUrlOf(item.id, null), row, sub: null, ...undo(readBase(mainIcon)) });
    for (const subElement of rowElement.querySelectorAll<HTMLElement>("[data-sub]")) {
      const sub = Number(subElement.dataset.sub);
      const subItem = item.subs[sub];
      const mark = subElement.querySelector(MARK_SELECTOR);
      if (!subItem || !mark) continue;
      slots.push({ id: `sub-${row}-${sub}`, modelUrl: modelUrlOf(item.id, subItem.id), row, sub, ...undo(readBase(mark)) });
    }
    return slots;
  });
}

export function listModelUrls(): string[] {
  return MENU.flatMap((item) => [modelUrlOf(item.id, null), ...item.subs.map((sub) => modelUrlOf(item.id, sub.id))]);
}
