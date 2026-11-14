import { ArrowLeft, ExternalLink, VolumeOff } from "lucide-react";
import {
  Fragment,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TransitionEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { MENU, type SubItem } from "./menu-content";
import {
  findLeadExit,
  findRowExit,
  findSubExit,
  measureHeroMove,
  measureLabelMove,
  pickTapSound,
  projectRestingCenter,
  type Exit,
  type MenuAxis,
} from "./menu-motion";
import { collectRowElements, paintRow } from "./menu-paint";
import { createMenuScroller, type MenuScroller } from "./menu-scroller";
import "./menu.css";

type DetailSub = SubItem & { readonly action: Extract<SubItem["action"], { kind: "detail" }> };

const SOUND_VOLUME = 0.6;
const HERO_SCALE = 1.25;
const SELECTED_ICON_SCALE = 1.2;
// The hero icon's way back takes 150ms of delay and 550ms of travel, and the
// detail text has faded by 250ms, so these clear the scroll once both are done.
const HERO_RETURN_TRANSITION = "transform 550ms var(--ease-in-out) 150ms";
const HERO_RETURN_MS = 700;
const DETAIL_FADE_OUT_MS = 250;

function countItems(axis: MenuAxis, mainIndex: number): number {
  return axis === "main" ? MENU.length : (MENU[mainIndex]?.subs.length ?? 0);
}

// Japanese wraps between any two characters, so a label that cannot fit on
// one line breaks only where its pieces meet.
function renderLabel({ label, labelPieces }: SubItem): ReactNode {
  if (!labelPieces) return label;
  return labelPieces.map((piece, index) => (
    <Fragment key={piece}>
      {index > 0 && <wbr />}
      {piece}
    </Fragment>
  ));
}

// The box the text itself takes up, which inside a centred label is narrower
// than the label.
function readTextRect(element: HTMLElement): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(element);
  return range.getBoundingClientRect();
}

function placeStyle(index: number, exit: Exit | null = null): CSSProperties {
  return exit ? { "--i": index, "--k": exit.distance } : { "--i": index };
}

function exitStyle(exit: Exit): CSSProperties {
  return { "--k": exit.distance };
}

export default function MenuScreen() {
  const [mainIndex, setMainIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailSub, setDetailSub] = useState<DetailSub | null>(null);
  const [heroSubIndex, setHeroSubIndex] = useState(0);
  const [isHeroLanded, setIsHeroLanded] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const heroItemRef = useRef<HTMLElement | null>(null);
  const closeTimers = useRef<number[]>([]);
  const scrollerRef = useRef<MenuScroller | null>(null);
  const tapCount = useRef(0);

  const subs = MENU[mainIndex]?.subs ?? [];
  const anchorSubIndex = isDetailOpen ? heroSubIndex : subIndex;

  function cue(sound: PianoSound) {
    if (isSoundOn) piano.play(sound, SOUND_VOLUME);
  }

  const onStepped = useEffectEvent((axis: MenuAxis, index: number) => {
    if (axis === "main") {
      setMainIndex(index);
      setSubIndex(0);
    } else {
      setSubIndex(index);
    }
    cue("select");
  });

  useEffect(() => {
    const stage = stageRef.current;
    const rowsElement = stage?.querySelector<HTMLElement>(".menu-rows");
    if (!stage || !rowsElement) return;
    const readSize = (name: string) => Number.parseFloat(getComputedStyle(stage).getPropertyValue(name)) || 1;
    let sizes = { row: readSize("--row"), sub: readSize("--sub-width") };
    function handleResize() {
      sizes = { row: readSize("--row"), sub: readSize("--sub-width") };
    }
    window.addEventListener("resize", handleResize);
    const rows = collectRowElements(stage);
    const scroller = createMenuScroller(stage, {
      countOf: countItems,
      sizeOf: (axis) => (axis === "main" ? sizes.row : sizes.sub),
      onStep: (axis, index) => onStepped(axis, index),
      paint(frame) {
        rowsElement.style.transform = `translate3d(0, ${-frame.main * sizes.row}px, 0)`;
        for (const row of rows) paintRow(row, frame, sizes.sub);
      },
    });
    scrollerRef.current = scroller;
    return () => {
      window.removeEventListener("resize", handleResize);
      scroller.destroy();
      scrollerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // iOS Safari applies :active only where a touchstart listener exists.
    function noop() {}
    stage.addEventListener("touchstart", noop, { passive: true });
    return () => stage.removeEventListener("touchstart", noop);
  }, []);

  useEffect(() => {
    scrollerRef.current?.repaint();
  }, [mainIndex]);

  useEffect(() => {
    function unlockAudio() {
      piano.unlock();
    }
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchend", unlockAudio);
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchend", unlockAudio);
    };
  }, []);

  function goTo(axis: MenuAxis, index: number) {
    scrollerRef.current?.goTo(axis, index);
  }

  function handleStageClick(event: MouseEvent<HTMLElement>) {
    if (isDetailOpen) return;
    if (event.target instanceof Element && event.target.closest("button, a")) return;
    cue(pickTapSound(tapCount.current));
    tapCount.current += 1;
  }

  function openDetail(sub: DetailSub, index: number) {
    const stage = stageRef.current;
    const detail = detailRef.current;
    const subElement = stage?.querySelector<HTMLElement>(`[data-row="${mainIndex}"] [data-sub="${index}"]`);
    const icon = subElement?.querySelector<HTMLElement>(".menu-sub-icon");
    const label = subElement?.querySelector<HTMLElement>(".menu-sub-label");
    if (!stage || !detail || !subElement || !icon || !label) return;
    const frame = scrollerRef.current?.readFrame();
    if (!frame) return;
    const readSize = (name: string) => Number.parseFloat(getComputedStyle(stage).getPropertyValue(name)) || 0;
    const motion = {
      shift: frame.subOwner === mainIndex ? frame.sub : 0,
      subIndex: index,
      subWidth: readSize("--sub-width"),
      main: frame.main,
      mainIndex,
      rowHeight: readSize("--row"),
    };
    const rect = icon.getBoundingClientRect();
    const center = projectRestingCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, motion);
    // The heading's left edge follows the detail's padding, which grows past the
    // notch in landscape, so the icon lands where the text starts.
    const textLeft = Number.parseFloat(getComputedStyle(detail).paddingLeft);
    const { dx, dy } = measureHeroMove(center, icon.offsetWidth * SELECTED_ICON_SCALE * HERO_SCALE, {
      x: textLeft,
      y: readSize("--hero-top"),
    });
    subElement.style.setProperty("--hero-dx", `${dx}px`);
    subElement.style.setProperty("--hero-dy", `${dy}px`);
    // The heading takes this item's label before it is measured, while the
    // detail is still hidden and scrolled to the top.
    flushSync(() => setDetailSub(sub));
    heroItemRef.current?.removeAttribute("data-hero-typeset");
    subElement.setAttribute("data-hero-typeset", "");
    detail.scrollTop = 0;
    const heading = detail.querySelector("h2");
    if (heading) {
      const labelRect = label.getBoundingClientRect();
      const labelText = readTextRect(label);
      const headingText = readTextRect(heading);
      const restingBox = projectRestingCenter({ x: labelRect.left, y: labelRect.top }, motion);
      const restingText = projectRestingCenter({ x: labelText.left, y: labelText.top }, motion);
      const scale = Number.parseFloat(getComputedStyle(heading).fontSize) / Number.parseFloat(getComputedStyle(label).fontSize);
      const move = measureLabelMove(
        { ...restingText, width: labelText.width },
        restingBox,
        { x: headingText.left, y: headingText.top },
        scale,
      );
      subElement.style.setProperty("--label-origin", `${move.originX}px ${move.originY}px`);
      subElement.style.setProperty("--label-dx", `${move.dx}px`);
      subElement.style.setProperty("--label-dy", `${move.dy}px`);
      subElement.style.setProperty("--label-scale", String(scale));
    }
    for (const timer of closeTimers.current) window.clearTimeout(timer);
    closeTimers.current = [];
    heroItemRef.current?.style.removeProperty("transform");
    heroItemRef.current?.style.removeProperty("transition");
    subElement.style.removeProperty("transform");
    subElement.style.removeProperty("transition");
    heroItemRef.current = subElement;
    const band = stage.querySelector<HTMLElement>(".menu-band");
    stage.style.setProperty("--band-scale", String((stage.clientHeight / (band?.offsetHeight ?? 1)) * 1.05));
    // Without motion the icon jumps to the heading, so no transition end arrives
    // to report the landing.
    const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flushSync(() => {
      setHeroSubIndex(index);
      setIsDetailOpen(true);
      setIsHeroLanded(isMotionReduced);
    });
    scrollerRef.current?.setInputEnabled(false);
    backButtonRef.current?.focus({ preventScroll: true });
    cue("transition_up");
  }

  // Once the flying icon reaches the heading, the copy inside the detail takes
  // its place and scrolls with the text, so the panel scrolls only from then on.
  function handleTransitionEnd(event: TransitionEvent<HTMLElement>) {
    if (!isDetailOpen || event.propertyName !== "translate") return;
    if (event.target !== heroItemRef.current?.querySelector(".menu-sub-icon")) return;
    setIsHeroLanded(true);
  }

  function returnHeroFromScroll() {
    const hero = heroItemRef.current;
    const detail = detailRef.current;
    if (!hero || !detail) return;
    // The flying icon takes over from the copy where the scroll has carried it.
    // Measuring commits that start before the transition is set; a bare read of
    // offsetWidth would be dropped by the React Compiler as an unused value.
    hero.style.transform = `translate3d(0, ${-detail.scrollTop}px, 0)`;
    hero.getBoundingClientRect();
    hero.style.transition = HERO_RETURN_TRANSITION;
    hero.style.transform = "translate3d(0, 0, 0)";
    closeTimers.current = [
      window.setTimeout(() => {
        detail.scrollTop = 0;
      }, DETAIL_FADE_OUT_MS),
      window.setTimeout(() => {
        hero.style.removeProperty("transition");
        hero.style.removeProperty("transform");
        hero.removeAttribute("data-hero-typeset");
      }, HERO_RETURN_MS),
    ];
  }

  function closeDetail() {
    returnHeroFromScroll();
    flushSync(() => {
      setIsDetailOpen(false);
      setIsHeroLanded(false);
    });
    scrollerRef.current?.setInputEnabled(true);
    stageRef.current?.querySelector<HTMLElement>(`[data-row="${mainIndex}"] [data-sub="${subIndex}"]`)?.focus({
      preventScroll: true,
    });
    cue("transition_down");
  }

  function activateSub(sub: SubItem, index: number) {
    goTo("sub", index);
    switch (sub.action.kind) {
      case "soundSwitch":
        if (isSoundOn) {
          cue("toggle_off");
          setIsSoundOn(false);
        } else {
          setIsSoundOn(true);
          piano.play("toggle_on", SOUND_VOLUME);
        }
        return;
      case "link":
        cue("button");
        return;
      case "detail":
        openDetail({ ...sub, action: sub.action }, index);
        return;
    }
  }

  // Enter on a focused button clicks that button, so focus follows the arrow
  // keys onto the item they select; otherwise Enter opens the item left behind.
  function moveFocusWithSelection(axis: MenuAxis, index: number) {
    const active = document.activeElement;
    const stage = stageRef.current;
    if (!stage || !(active instanceof HTMLElement) || !stage.contains(active)) return;
    const selector =
      axis === "main" ? `[data-row="${index}"] .menu-main-item` : `[data-row="${mainIndex}"] [data-sub="${index}"]`;
    stage.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
  }

  const onKeyPressed = useEffectEvent((event: KeyboardEvent) => {
    if (isDetailOpen) {
      if (event.key === "Escape") closeDetail();
      return;
    }
    const moves: Record<string, readonly [MenuAxis, number]> = {
      ArrowDown: ["main", mainIndex + 1],
      ArrowUp: ["main", mainIndex - 1],
      ArrowRight: ["sub", subIndex + 1],
      ArrowLeft: ["sub", subIndex - 1],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      goTo(...move);
      moveFocusWithSelection(...move);
      return;
    }
    const sub = subs[subIndex];
    // Enter on the page, or on the selected row's own main item, opens the sub
    // item that row has selected; on a sub item the button's own click does it.
    const isOnSelectedMain =
      event.target instanceof Element && event.target.closest('.menu-main-item[aria-current="true"]') !== null;
    const isOnPage = event.target === document.body || isOnSelectedMain;
    if (event.key === "Enter" && sub && sub.action.kind !== "link" && isOnPage) {
      event.preventDefault();
      activateSub(sub, subIndex);
    }
  });

  useEffect(() => {
    function listen(event: KeyboardEvent) {
      onKeyPressed(event);
    }
    window.addEventListener("keydown", listen);
    return () => window.removeEventListener("keydown", listen);
  }, []);

  function renderSub(sub: SubItem, index: number, isCurrentRow: boolean) {
    const exit = isCurrentRow ? findSubExit(index, anchorSubIndex) : null;
    const shared = {
      className: "menu-sub-item",
      style: placeStyle(index, exit),
      "data-sub": index,
      "data-exit": exit?.direction,
      "data-hero": (isCurrentRow && index === anchorSubIndex) || undefined,
      "data-current": (isCurrentRow && index === subIndex) || undefined,
      onFocus: () => goTo("sub", index),
      onClick: () => activateSub(sub, index),
    };
    switch (sub.action.kind) {
      case "soundSwitch":
        return (
          <button key={sub.id} type="button" role="switch" aria-checked={isSoundOn} aria-label="サウンド" {...shared}>
            <span className="menu-switch" aria-hidden="true">
              <span className="menu-switch-thumb" />
            </span>
            <span className="menu-sub-label">{isSoundOn ? "オン" : "オフ"}</span>
          </button>
        );
      case "link":
        return (
          <a key={sub.id} href={sub.action.href} target="_blank" rel="noreferrer" {...shared}>
            <span className="menu-sub-icon">
              <sub.icon aria-hidden="true" />
            </span>
            <span className="menu-sub-label">{renderLabel(sub)}</span>
          </a>
        );
      case "detail":
        return (
          <button key={sub.id} type="button" {...shared}>
            <span className="menu-sub-icon">
              <sub.icon aria-hidden="true" />
            </span>
            <span className="menu-sub-label">{renderLabel(sub)}</span>
          </button>
        );
    }
  }

  const leadExit = findLeadExit(anchorSubIndex);
  const frogExit = findRowExit(-1, mainIndex) ?? { direction: "up", distance: 1 };

  return (
    <main
      className="menu"
      ref={stageRef}
      onClick={handleStageClick}
      onTransitionEnd={handleTransitionEnd}
      data-detail={isDetailOpen ? "open" : undefined}
      data-hero-landed={isHeroLanded || undefined}
    >
      <div className="menu-band" aria-hidden="true" />

      <nav className="menu-rows" aria-label="メインメニュー" inert={isDetailOpen}>
        <img
          className="menu-mark"
          src="/frog.svg"
          alt="helloと挨拶しているいまいまいのカエルのイラスト"
          width={70}
          height={48}
          data-exit="up"
          style={exitStyle(frogExit)}
          draggable={false}
        />
        {MENU.map((item, index) => {
          const isSelected = index === mainIndex;
          const rowExit = findRowExit(index, mainIndex);
          const Icon = item.id === "sound" && !isSoundOn ? VolumeOff : item.icon;
          return (
            <div
              key={item.id}
              className="menu-row"
              style={placeStyle(index, rowExit)}
              data-row={index}
              data-exit={rowExit?.direction}
              data-selected={isSelected || undefined}
            >
              <span
                className="menu-main-title"
                aria-hidden="true"
                data-exit={isSelected ? leadExit.direction : undefined}
                style={isSelected ? exitStyle(leadExit) : undefined}
              >
                {item.label}
              </span>
              <button
                type="button"
                className="menu-main-item"
                aria-current={isSelected ? "true" : undefined}
                data-exit={isSelected ? leadExit.direction : undefined}
                style={isSelected ? exitStyle(leadExit) : undefined}
                onClick={() => goTo("main", index)}
                onFocus={() => goTo("main", index)}
              >
                <span className="menu-main-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="menu-main-label">{item.label}</span>
              </button>
              <div className="menu-sub" role="group" aria-label={`${item.label}のサブメニュー`} inert={!isSelected}>
                {item.subs.map((sub, position) => renderSub(sub, position, isSelected))}
              </div>
            </div>
          );
        })}
      </nav>

      <section
        ref={detailRef}
        className="menu-detail"
        aria-labelledby="menu-detail-title"
        aria-hidden={!isDetailOpen}
        inert={!isDetailOpen}
      >
        {detailSub && (
          <span className="menu-detail-icon" aria-hidden="true">
            <detailSub.icon />
          </span>
        )}
        <h2 id="menu-detail-title">
          {detailSub?.label}
        </h2>
        <div className="menu-detail-body" style={{ "--n": 1 }}>
          {detailSub?.action.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {detailSub?.action.sections?.map((section) => (
            <section key={section.heading} className="menu-detail-section">
              <h3>{section.heading}</h3>
              <ul>
                {section.entries.map((entry) => (
                  <li key={entry.label}>
                    {entry.href ? (
                      <a href={entry.href} target="_blank" rel="noreferrer">
                        {entry.label}
                      </a>
                    ) : (
                      entry.label
                    )}
                    {entry.meta && <span className="menu-detail-meta">{entry.meta}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="menu-detail-actions" style={{ "--n": 2 }}>
          <button type="button" className="menu-detail-back" ref={backButtonRef} onClick={closeDetail} aria-label="戻る">
            <ArrowLeft aria-hidden="true" />
          </button>
          {detailSub?.action.href && (
            <a className="menu-detail-link" href={detailSub.action.href} target="_blank" rel="noreferrer">
              開く
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
