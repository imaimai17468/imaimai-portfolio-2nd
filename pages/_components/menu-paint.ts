import { gateBySpeed, measureBandStretch, measureFocus } from "./menu-motion";
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
const BAND_STRETCH_ROWS = 0.3;
// Rows per second: below the first the band stretches in full, above the
// second it moves as a plain band.
const STRETCH_SPEED_ROWS = { slow: 1.5, fast: 4 } as const;

// Stretches the band about its centre while the list moves slowly between
// items. Off an item, or when moving fast, it clears the inline style, so the
// stylesheet's own transform (the band opening into a detail) applies untouched.
export function paintBand(band: HTMLElement, frame: MenuFrame, count: number): void {
  const gate = gateBySpeed(frame.mainSpeed, STRETCH_SPEED_ROWS.slow, STRETCH_SPEED_ROWS.fast);
  const stretch = measureBandStretch(frame.main, count, BAND_STRETCH_ROWS) * gate;
  if (stretch < 0.002) {
    clearBandStretch(band);
    return;
  }
  // The stylesheet transitions the band's transform for the detail, which
  // would delay every frame here, so the stretch turns it off while it runs.
  band.style.transition = "none";
  band.style.transform = `scaleY(${1 + 2 * stretch})`;
}

export function clearBandStretch(band: HTMLElement): void {
  band.style.removeProperty("transform");
  band.style.removeProperty("transition");
}

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
