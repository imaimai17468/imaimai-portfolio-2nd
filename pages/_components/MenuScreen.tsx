import { ArrowLeft, ExternalLink, VolumeOff } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { MENU, type SubItem } from "./menu-content";
import { measureFocus, pickStepSound, type MenuAxis } from "./menu-motion";
import { createMenuScroller, type MenuScroller } from "./menu-scroller";
import "./menu.css";

type DetailSub = SubItem & { readonly action: Extract<SubItem["action"], { kind: "detail" }> };

const SOUND_VOLUME = 0.6;

function countItems(axis: MenuAxis, mainIndex: number): number {
  return axis === "main" ? MENU.length : (MENU[mainIndex]?.subs.length ?? 0);
}

function itemStyle(index: number): CSSProperties {
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

  const main = MENU[mainIndex] ?? MENU[0];
  const subs = main?.subs ?? [];

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
    cue(pickStepSound(index));
  });

  const onPushedPastEdge = useEffectEvent(() => cue("disabled"));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const readSize = (name: string) => Number.parseFloat(getComputedStyle(stage).getPropertyValue(name)) || 1;
    const scroller = createMenuScroller(stage, {
      countOf: countItems,
      sizeOf: (axis) => readSize(axis === "main" ? "--row" : "--sub-width"),
      onStep: (axis, index) => onStepped(axis, index),
      onEdge: () => onPushedPastEdge(),
      paint(mainPosition, subPosition) {
        stage.style.setProperty("--main-pos", String(mainPosition));
        stage.style.setProperty("--sub-pos", String(subPosition));
        for (const item of stage.querySelectorAll<HTMLElement>("[data-axis]")) {
          const position = item.dataset.axis === "main" ? mainPosition : subPosition;
          item.style.setProperty("--focus", String(measureFocus(Number(item.dataset.index) - position)));
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
      const [axis, index] = move;
      if (index < 0 || index >= countItems(axis, mainIndex)) cue("disabled");
      else goTo(axis, index);
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

  return (
    <main className="menu" ref={stageRef}>
      <div className="menu-band" aria-hidden="true" />

      <nav className="menu-main" aria-label="メインメニュー">
        {MENU.map((item, index) => {
          const isSelected = index === mainIndex;
          const Icon = item.id === "sound" && !isSoundOn ? VolumeOff : item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="menu-main-item"
              style={itemStyle(index)}
              data-axis="main"
              data-index={index}
              data-selected={isSelected || undefined}
              aria-current={isSelected ? "true" : undefined}
              onClick={() => goTo("main", index)}
              onFocus={() => goTo("main", index)}
            >
              <span className="menu-main-title" aria-hidden={!isSelected}>
                {item.label}
              </span>
              <span className="menu-main-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="menu-main-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div key={main?.id} className="menu-sub" role="group" aria-label={`${main?.label ?? ""}のサブメニュー`}>
        {subs.map((sub, index) => {
          const shared = {
            className: "menu-sub-item",
            style: itemStyle(index),
            "data-axis": "sub",
            "data-index": index,
            "data-current": index === subIndex || undefined,
            onFocus: () => goTo("sub", index),
          };
          if (sub.action.kind === "soundSwitch") {
            return (
              <button
                key={sub.id}
                type="button"
                role="switch"
                aria-checked={isSoundOn}
                aria-label="サウンド"
                {...shared}
                onClick={() => activateSub(sub, index)}
              >
                <span className="menu-switch" aria-hidden="true">
                  <span className="menu-switch-thumb" />
                </span>
                <span className="menu-sub-label">{isSoundOn ? "オン" : "オフ"}</span>
              </button>
            );
          }
          const content = (
            <>
              <span className="menu-sub-icon">
                <sub.icon aria-hidden="true" />
              </span>
              <span className="menu-sub-label">{sub.label}</span>
            </>
          );
          return sub.action.kind === "link" ? (
            <a
              key={sub.id}
              {...shared}
              href={sub.action.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => activateSub(sub, index)}
            >
              {content}
            </a>
          ) : (
            <button key={sub.id} type="button" {...shared} onClick={() => activateSub(sub, index)}>
              {content}
            </button>
          );
        })}
      </div>

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
