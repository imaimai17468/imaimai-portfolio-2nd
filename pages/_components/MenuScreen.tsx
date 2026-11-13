import { ArrowLeft, ExternalLink, VolumeOff } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { MENU, type SubItem } from "./menu-content";
import {
  findLeadExit,
  findRowExit,
  findSubExit,
  measureFocus,
  measureHeroMove,
  pickTapSound,
  type Exit,
  type MenuAxis,
} from "./menu-motion";
import { createMenuScroller, type MenuScroller } from "./menu-scroller";
import "./menu.css";

type DetailSub = SubItem & { readonly action: Extract<SubItem["action"], { kind: "detail" }> };

const SOUND_VOLUME = 0.6;
const HERO_SCALE = 1.25;
const HERO_LEFT_PX = 24;
const HERO_TOP_PX = 72;

function countItems(axis: MenuAxis, mainIndex: number): number {
  return axis === "main" ? MENU.length : (MENU[mainIndex]?.subs.length ?? 0);
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
  const stageRef = useRef<HTMLElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<MenuScroller | null>(null);
  const tapCount = useRef(0);

  const subs = MENU[mainIndex]?.subs ?? [];

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
    if (!stage) return;
    const readSize = (name: string) => Number.parseFloat(getComputedStyle(stage).getPropertyValue(name)) || 1;
    const scroller = createMenuScroller(stage, {
      countOf: countItems,
      sizeOf: (axis) => readSize(axis === "main" ? "--row" : "--sub-width"),
      onStep: (axis, index) => onStepped(axis, index),
      paint({ main: mainPosition, sub: subPosition, subOwner, leftover }) {
        stage.style.setProperty("--main-pos", String(mainPosition));
        for (const row of stage.querySelectorAll<HTMLElement>("[data-row]")) {
          const index = Number(row.dataset.row);
          const shift = (index === subOwner ? subPosition : 0) + (index === leftover?.owner ? leftover.shift : 0);
          row.style.setProperty("--focus", String(measureFocus(index - mainPosition)));
          row.style.setProperty("--shift", String(shift));
          for (const item of row.querySelectorAll<HTMLElement>("[data-sub]")) {
            item.style.setProperty("--focus", String(measureFocus(Number(item.dataset.sub) - shift)));
          }
        }
      },
    });
    scrollerRef.current = scroller;
    return () => {
      scroller.destroy();
      scrollerRef.current = null;
    };
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
    const subElement = stage?.querySelector<HTMLElement>(`[data-row="${mainIndex}"] [data-sub="${index}"]`);
    const icon = subElement?.querySelector<HTMLElement>(".menu-sub-icon");
    if (!stage || !subElement || !icon) return;
    const { dx, dy } = measureHeroMove(icon.getBoundingClientRect(), HERO_SCALE, HERO_LEFT_PX, HERO_TOP_PX);
    subElement.style.setProperty("--hero-dx", `${dx}px`);
    subElement.style.setProperty("--hero-dy", `${dy}px`);
    const band = stage.querySelector<HTMLElement>(".menu-band");
    stage.style.setProperty("--band-scale", String((stage.clientHeight / (band?.offsetHeight ?? 1)) * 1.05));
    flushSync(() => {
      setDetailSub(sub);
      setIsDetailOpen(true);
    });
    scrollerRef.current?.setInputEnabled(false);
    backButtonRef.current?.focus({ preventScroll: true });
    cue("transition_up");
  }

  function closeDetail() {
    flushSync(() => setIsDetailOpen(false));
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
      return;
    }
    const sub = subs[subIndex];
    if (event.key === "Enter" && sub && sub.action.kind !== "link" && event.target === document.body) {
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
    const exit = isCurrentRow ? findSubExit(index, subIndex) : null;
    const shared = {
      className: "menu-sub-item",
      style: placeStyle(index, exit),
      "data-sub": index,
      "data-exit": exit?.direction,
      "data-hero": (isCurrentRow && index === subIndex) || undefined,
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
            <span className="menu-sub-label">{sub.label}</span>
          </a>
        );
      case "detail":
        return (
          <button key={sub.id} type="button" {...shared}>
            <span className="menu-sub-icon">
              <sub.icon aria-hidden="true" />
            </span>
            <span className="menu-sub-label">{sub.label}</span>
          </button>
        );
    }
  }

  const leadExit = findLeadExit(subIndex);

  return (
    <main className="menu" ref={stageRef} onClick={handleStageClick} data-detail={isDetailOpen ? "open" : undefined}>
      <div className="menu-band" aria-hidden="true" />

      <nav className="menu-rows" aria-label="メインメニュー" inert={isDetailOpen}>
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
        className="menu-detail"
        aria-labelledby="menu-detail-title"
        aria-hidden={!isDetailOpen}
        inert={!isDetailOpen}
      >
        <h2 id="menu-detail-title" style={{ "--n": 0 }}>
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
          <button type="button" className="menu-detail-back" ref={backButtonRef} onClick={closeDetail}>
            <ArrowLeft aria-hidden="true" />
            戻る
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
