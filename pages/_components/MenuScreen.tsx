import { ArrowLeft, ExternalLink, VolumeOff } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type UIEvent } from "react";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { MENU, type SubItem } from "./menu-content";
import { findIndexAt, isPushingPastEdge, pickStepSound } from "./menu-motion";
import "./menu.css";

type DetailSub = SubItem & { readonly action: Extract<SubItem["action"], { kind: "detail" }> };

const EDGE_SOUND_INTERVAL_MS = 400;

function measureStep(list: HTMLElement | null, fallback: number): number {
  const items = list?.querySelectorAll<HTMLElement>("[data-menu-item]");
  if (!items || items.length === 0) return fallback;
  const [first, second] = [items[0], items[1]];
  if (first && second) return second.offsetLeft - first.offsetLeft || second.offsetTop - first.offsetTop;
  return first?.offsetHeight ?? fallback;
}

export default function MenuScreen() {
  const [mainIndex, setMainIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [openedSub, setOpenedSub] = useState<DetailSub | null>(null);
  const mainListRef = useRef<HTMLElement>(null);
  const subRowRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastEdgeSoundAt = useRef(0);

  const main = MENU[mainIndex] ?? MENU[0];
  const subs = main?.subs ?? [];

  function cue(sound: PianoSound) {
    if (isSoundOn) piano.play(sound, 0.6);
  }

  function cueEdge(now: number) {
    if (now - lastEdgeSoundAt.current < EDGE_SOUND_INTERVAL_MS) return;
    lastEdgeSoundAt.current = now;
    cue("disabled");
  }

  const onMainStepped = useEffectEvent((index: number) => {
    setMainIndex(index);
    setSubIndex(0);
    cue(pickStepSound("main", index));
  });

  const onPushedPastMainEdge = useEffectEvent((now: number) => cueEdge(now));

  useEffect(() => {
    let lastIndex = findIndexAt(window.scrollY, measureStep(mainListRef.current, 1), MENU.length);
    function handleScroll() {
      const index = findIndexAt(window.scrollY, measureStep(mainListRef.current, 1), MENU.length);
      if (index === lastIndex) return;
      lastIndex = index;
      onMainStepped(index);
    }
    function handleWheel(event: WheelEvent) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && isPushingPastEdge(window.scrollY, maxScroll, event.deltaY)) {
        onPushedPastMainEdge(event.timeStamp);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

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

  function scrollMainTo(index: number) {
    window.scrollTo({ top: index * measureStep(mainListRef.current, 1), behavior: "smooth" });
  }

  function scrollSubTo(index: number) {
    const row = subRowRef.current;
    row?.scrollTo({ left: index * measureStep(row, 1), behavior: "smooth" });
  }

  function handleSubScroll(event: UIEvent<HTMLDivElement>) {
    const row = event.currentTarget;
    const index = findIndexAt(row.scrollLeft, measureStep(row, 1), subs.length);
    if (index === subIndex) return;
    setSubIndex(index);
    cue(pickStepSound("sub", index));
  }

  function activateSub(sub: SubItem) {
    switch (sub.action.kind) {
      case "sound":
        if (sub.action.isOn) {
          setIsSoundOn(true);
          piano.play("toggle_on", 0.6);
        } else {
          cue("toggle_off");
          setIsSoundOn(false);
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

  function handleKeyDown(event: KeyboardEvent) {
    if (dialogRef.current?.open) return;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step !== undefined) {
      event.preventDefault();
      const next = mainIndex + step;
      if (next < 0 || next >= MENU.length) cueEdge(event.timeStamp);
      else scrollMainTo(next);
      return;
    }
    const subStep = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (subStep !== undefined) {
      event.preventDefault();
      const next = subIndex + subStep;
      if (next < 0 || next >= subs.length) cueEdge(event.timeStamp);
      else scrollSubTo(next);
      return;
    }
    const sub = subs[subIndex];
    if (event.key === "Enter" && sub && sub.action.kind !== "link") {
      event.preventDefault();
      activateSub(sub);
    }
  }

  const onKeyPressed = useEffectEvent((event: KeyboardEvent) => handleKeyDown(event));

  useEffect(() => {
    function listen(event: KeyboardEvent) {
      onKeyPressed(event);
    }
    window.addEventListener("keydown", listen);
    return () => window.removeEventListener("keydown", listen);
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <main className="menu">
      <div className="menu-band" aria-hidden="true" />

      <nav className="menu-main" aria-label="メインメニュー" ref={mainListRef}>
        {MENU.map((item, index) => {
          const isSelected = index === mainIndex;
          const Icon = item.id === "sound" && !isSoundOn ? VolumeOff : item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="menu-main-item"
              data-menu-item=""
              data-selected={isSelected || undefined}
              aria-current={isSelected ? "true" : undefined}
              onClick={() => scrollMainTo(index)}
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

      <div
        key={main?.id}
        className="menu-sub"
        ref={subRowRef}
        onScroll={handleSubScroll}
        role="group"
        aria-label={`${main?.label ?? ""}のサブメニュー`}
      >
        {subs.map((sub, index) => {
          const isCurrent = index === subIndex;
          const isPressed = sub.action.kind === "sound" ? sub.action.isOn === isSoundOn : undefined;
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
              className="menu-sub-item"
              data-menu-item=""
              data-current={isCurrent || undefined}
              href={sub.action.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => activateSub(sub)}
            >
              {content}
            </a>
          ) : (
            <button
              key={sub.id}
              type="button"
              className="menu-sub-item"
              data-menu-item=""
              data-current={isCurrent || undefined}
              aria-pressed={isPressed}
              onClick={() => activateSub(sub)}
            >
              {content}
            </button>
          );
        })}
        <span className="menu-sub-tail" aria-hidden="true" />
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
            <button type="button" className="menu-detail-back" onClick={closeDialog}>
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
