import { ArrowLeft, ExternalLink, VolumeOff } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { MENU, type SubItem } from "./menu-content";
import { measureFocus, pickTapSound, type MenuAxis } from "./menu-motion";
import { createMenuScroller, type MenuScroller } from "./menu-scroller";
import "./menu.css";

type DetailSub = SubItem & { readonly action: Extract<SubItem["action"], { kind: "detail" }> };

const SOUND_VOLUME = 0.6;

function countItems(axis: MenuAxis, mainIndex: number): number {
  return axis === "main" ? MENU.length : (MENU[mainIndex]?.subs.length ?? 0);
}

function indexStyle(index: number): CSSProperties {
  return { "--i": index };
}

export default function MenuScreen() {
  const [mainIndex, setMainIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [openedSub, setOpenedSub] = useState<DetailSub | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
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
    if (event.target instanceof Element && event.target.closest("button, a, dialog")) return;
    cue(pickTapSound(tapCount.current));
    tapCount.current += 1;
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
        setOpenedSub({ ...sub, action: sub.action });
        dialogRef.current?.showModal();
        cue("transition_up");
        return;
    }
  }

  const onKeyPressed = useEffectEvent((event: KeyboardEvent) => {
    if (dialogRef.current?.open) return;
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
    const shared = {
      className: "menu-sub-item",
      style: indexStyle(index),
      "data-sub": index,
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

  return (
    <main className="menu" ref={stageRef} onClick={handleStageClick}>
      <div className="menu-band" aria-hidden="true" />

      <nav className="menu-rows" aria-label="メインメニュー">
        {MENU.map((item, index) => {
          const isSelected = index === mainIndex;
          const Icon = item.id === "sound" && !isSoundOn ? VolumeOff : item.icon;
          return (
            <div
              key={item.id}
              className="menu-row"
              style={indexStyle(index)}
              data-row={index}
              data-selected={isSelected || undefined}
            >
              <span className="menu-main-title" aria-hidden="true">
                {item.label}
              </span>
              <button
                type="button"
                className="menu-main-item"
                aria-current={isSelected ? "true" : undefined}
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

      <dialog
        ref={dialogRef}
        className="menu-detail"
        aria-labelledby="menu-detail-title"
        onClose={() => {
          setOpenedSub(null);
          cue("transition_down");
        }}
      >
        {openedSub && (
          <>
            <button type="button" className="menu-detail-back" onClick={() => dialogRef.current?.close()}>
              <ArrowLeft aria-hidden="true" />
              戻る
            </button>
            <h2 id="menu-detail-title">{openedSub.label}</h2>
            {openedSub.action.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {openedSub.action.href && (
              <a className="menu-detail-link" href={openedSub.action.href} target="_blank" rel="noreferrer">
                開く
                <ExternalLink aria-hidden="true" />
              </a>
            )}
          </>
        )}
      </dialog>
    </main>
  );
}
