import { measureFocus } from "./menu-motion";
import type { MenuFrame } from "./menu-scroller";

export interface RowElements {
  readonly index: number;
  readonly title: HTMLElement | null;
  readonly mainItem: HTMLElement | null;
  readonly mainIcon: HTMLElement | null;
  readonly subGroup: HTMLElement | null;
  readonly subs: readonly { readonly index: number; readonly item: HTMLElement; readonly icon: HTMLElement | null }[];
}

const DIMMED_OPACITY = 0.45;
const FOCUSED_SCALE_GAIN = 0.2;

export function collectRowElements(stage: HTMLElement): readonly RowElements[] {
  return [...stage.querySelectorAll<HTMLElement>("[data-row]")].map((row) => ({
    index: Number(row.dataset.row),
    title: row.querySelector<HTMLElement>(".menu-main-title"),
    mainItem: row.querySelector<HTMLElement>(".menu-main-item"),
    mainIcon: row.querySelector<HTMLElement>(".menu-main-icon"),
    subGroup: row.querySelector<HTMLElement>(".menu-sub"),
    subs: [...row.querySelectorAll<HTMLElement>("[data-sub]")].map((item) => ({
      index: Number(item.dataset.sub),
      item,
      icon: item.querySelector<HTMLElement>(".menu-sub-icon"),
    })),
  }));
}

export function measureRowShift(index: number, frame: MenuFrame): number {
  const ownShift = index === frame.subOwner ? frame.sub : 0;
  const leftoverShift = index === frame.leftover?.owner ? frame.leftover.shift : 0;
  return ownShift + leftoverShift;
}

// Writes each frame straight onto the elements that move, so a frame
// restyles those elements alone rather than every descendant of a parent
// whose custom property changed.
export function paintRow(row: RowElements, frame: MenuFrame, subWidth: number): void {
  const focus = measureFocus(row.index - frame.main);
  const shift = measureRowShift(row.index, frame);
  const shiftTransform = `translate3d(${-shift * subWidth}px, 0, 0)`;
  if (row.title) row.title.style.opacity = String(Math.max(0, focus * 2 - 1));
  if (row.mainItem) {
    row.mainItem.style.opacity = String(DIMMED_OPACITY + (1 - DIMMED_OPACITY) * focus);
    row.mainItem.style.transform = shiftTransform;
  }
  if (row.mainIcon) row.mainIcon.style.transform = `scale(${1 + FOCUSED_SCALE_GAIN * focus})`;
  if (row.subGroup) {
    row.subGroup.style.opacity = String(focus);
    row.subGroup.style.transform = shiftTransform;
  }
  for (const sub of row.subs) {
    const subFocus = measureFocus(sub.index - shift);
    sub.item.style.opacity = String(DIMMED_OPACITY + (1 - DIMMED_OPACITY) * subFocus);
    if (sub.icon) sub.icon.style.transform = `scale(${1 + FOCUSED_SCALE_GAIN * subFocus})`;
  }
}
