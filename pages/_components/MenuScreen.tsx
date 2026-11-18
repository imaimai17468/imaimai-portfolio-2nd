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
import { bgm } from "../../src/lib/bgm/player";
import { piano } from "../../src/lib/piano/player";
import type { PianoSound } from "../../src/lib/piano/sprite";
import { EdgeBlur } from "./EdgeBlur";
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
import { createMenuScroller, type MenuFrame, type MenuScroller } from "./menu-scroller";
import type { BoardView } from "./scene/placement";
import type { SceneState, TabletopScene } from "./scene/scene";
import { listModelUrls, readSlotOrigins } from "./scene/slots";
import { detectArrival, type ArrivalState } from "./scene/arrival";
import { readTranslate } from "./scene/translate";
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
// Long enough for the farthest exit (150ms + 2 steps of 90ms + 520ms) and the
// hero's way back (700ms) to finish before the 3D pieces stop following them.
const EXIT_FOLLOW_MS = 1600;
// How long the menu waits hidden for the 3D scene before showing the 2D menu.
const SCENE_WAIT_MS = 5000;
// Paints further apart than this are separate gestures, not one slow frame.
const FRAME_GAP_MS = 100;

// Lays the board flat for a measurement, so rects come back in the board's own
// layout, which is also where the open-item flight and the 3D pieces work.
function flattenBoard(stage: HTMLElement): () => void {
  const board = stage.querySelector<HTMLElement>(".menu-board");
  if (!board) return () => {};
  board.style.transition = "none";
  board.style.transform = "none";
  return () => {
    board.style.removeProperty("transform");
    // The transform must be computed before the transition comes back, or
    // the restore animates.
    board.getBoundingClientRect();
    board.style.removeProperty("transition");
  };
}

function readAngle(value: string): number {
  return (Number.parseFloat(value) * Math.PI) / 180 || 0;
}

function readExitOffset(stage: HTMLElement, id: string): { x: number; y: number } {
  const [kind, row, sub] = id.split("-");
  const rowElement = stage.querySelector<HTMLElement>(`[data-row="${row}"]`);
  const item = kind === "main" ? rowElement?.querySelector(".menu-main-item") : rowElement?.querySelector(`[data-sub="${sub}"]`);
  const parts = [rowElement, item].map((element) => (element ? readTranslate(getComputedStyle(element).translate) : { x: 0, y: 0 }));
  return parts.reduce((sum, part) => ({ x: sum.x + part.x, y: sum.y + part.y }), { x: 0, y: 0 });
}

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
  // Sound starts off, so the BGM begins from the tap that turns the switch on,
  // which a browser always counts as a user gesture.
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailSub, setDetailSub] = useState<DetailSub | null>(null);
  const [heroSubIndex, setHeroSubIndex] = useState(0);
  const [isHeroLanded, setIsHeroLanded] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  // True from the server render until the 3D scene is ready or has given up,
  // so the 2D menu does not flash before the scene replaces it (menu.css).
  const [isSceneLoading, setIsSceneLoading] = useState(true);
  // The opened item whose 3D piece gives way to its 2D icon, from opening until
  // the icon has flown back after closing.
  const [sceneHeroId, setSceneHeroId] = useState<string | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const heroItemRef = useRef<HTMLElement | null>(null);
  const closeTimers = useRef<number[]>([]);
  const scrollerRef = useRef<MenuScroller | null>(null);
  const tapCount = useRef(0);
  const sceneRef = useRef<TabletopScene | null>(null);
  const paintSceneRef = useRef<(frame?: MenuFrame) => void>(() => {});
  // Re-measures the pieces' places once the board is at rest again.
  const placeSceneRef = useRef<() => void>(() => {});
  const needsPlaceRef = useRef(false);
  // Each open or close starts a new follow; an older one stops at its next frame.
  const exitFollowRef = useRef({ generation: 0, isRunning: false });
  const sceneInputRef = useRef<{ isSoundOn: boolean; heroId: string | null; offsets: ReadonlyMap<string, { x: number; y: number }> }>({
    isSoundOn: false,
    heroId: null,
    offsets: new Map(),
  });

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
    const stageElement = stage;
    const readSize = (name: string) => Number.parseFloat(getComputedStyle(stage).getPropertyValue(name)) || 1;
    const canvas = stage.querySelector<HTMLCanvasElement>(".menu-scene");
    let sizes = { row: readSize("--row"), sub: readSize("--sub-width"), icon: readSize("--main-icon") };
    const readBoard = (): BoardView => {
      const style = getComputedStyle(stageElement);
      return {
        perspective: readSize("--board-perspective"),
        tilt: readAngle(style.getPropertyValue("--board-tilt")),
        twist: readAngle(style.getPropertyValue("--board-twist")),
        originX: stageElement.clientWidth / 2,
        originY: stageElement.clientHeight / 2,
      };
    };
    let board = readBoard();
    let lastPaintTime = 0;
    let pendingFrame: MenuFrame | null = null;
    let arrival: ArrivalState = { owner: 0, isArmed: false, previous: 0 };
    let sceneFrameId = 0;
    let isDisposed = false;

    function buildSceneState(frame: MenuFrame): SceneState {
      const input = sceneInputRef.current;
      return {
        frame,
        layout: { row: sizes.row, subWidth: sizes.sub, iconSize: sizes.icon, board },
        offsets: input.offsets,
        heroId: input.heroId,
        isSoundOn: input.isSoundOn,
      };
    }
    // The icons are measured only while nothing but the scroll moves them:
    // while an item is open, or its items are leaving or returning, their exit
    // translate and the flying icon would land in the measurement.
    function placeScene(scene: TabletopScene) {
      const frame = scroller.readFrame();
      if (stageElement.dataset.detail === "open" || exitFollowRef.current.isRunning) {
        needsPlaceRef.current = true;
      } else {
        needsPlaceRef.current = false;
        const restoreBoard = flattenBoard(stageElement);
        scene.setSlots(readSlotOrigins(stageElement, frame, { row: sizes.row, subWidth: sizes.sub }));
        restoreBoard();
      }
      scene.resize(stageElement.clientWidth, stageElement.clientHeight, window.devicePixelRatio);
      scene.render(buildSceneState(frame));
    }
    function handleResize() {
      sizes = { row: readSize("--row"), sub: readSize("--sub-width"), icon: readSize("--main-icon") };
      board = readBoard();
      // The DOM is moved by the old sizes until the scroller paints with the
      // new ones, and the slots undo that paint.
      scroller.repaint();
      if (sceneRef.current) placeScene(sceneRef.current);
    }
    placeSceneRef.current = () => {
      if (sceneRef.current) placeScene(sceneRef.current);
    };
    window.addEventListener("resize", handleResize);
    const rows = collectRowElements(stage);
    const scroller = createMenuScroller(stage, {
      countOf: countItems,
      sizeOf: (axis) => (axis === "main" ? sizes.row : sizes.sub),
      onStep: (axis, index) => onStepped(axis, index),
      paint(frame) {
        rowsElement.style.transform = `translate3d(0, ${-frame.main * sizes.row}px, 0)`;
        for (const row of rows) paintRow(row, frame, sizes.sub);
        if (!sceneRef.current) return;
        // The piece a sub slide comes to rest on rattles once it is there;
        // reduced motion keeps it still.
        const detected = detectArrival(arrival, frame);
        arrival = detected.state;
        if (detected.arrivedSub !== null && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          sceneRef.current.wobble(`sub-${frame.subOwner}-${detected.arrivedSub}`, Math.random);
        }
        // Drag and wheel paint once per input event, which can come several
        // times a frame; the scene draws the latest once per frame, and its
        // frame time is measured between those draws.
        pendingFrame = frame;
        if (sceneFrameId) return;
        sceneFrameId = window.requestAnimationFrame((now) => {
          sceneFrameId = 0;
          const scene = sceneRef.current;
          if (!scene || !pendingFrame) return;
          if (now - lastPaintTime < FRAME_GAP_MS) scene.recordFrameTime(now - lastPaintTime);
          lastPaintTime = now;
          scene.render(buildSceneState(pendingFrame));
        });
      },
    });
    scrollerRef.current = scroller;
    paintSceneRef.current = (frame) => sceneRef.current?.render(buildSceneState(frame ?? scroller.readFrame()));

    // The 3D library loads only in the browser. Where it cannot start, or is
    // not ready within the wait, the 2D menu shows instead; a scene that is
    // ready later still takes over.
    const loadingTimer = window.setTimeout(() => setIsSceneLoading(false), SCENE_WAIT_MS);
    if (!canvas) setIsSceneLoading(false);
    if (canvas) {
      void import("./scene/scene").then(async ({ createTabletopScene }) => {
        const root = document.documentElement;
        const scene = await createTabletopScene(canvas, (name) => getComputedStyle(root).getPropertyValue(name), listModelUrls(), () => {
          // The GPU went away: drop the scene and show the 2D icons again.
          sceneRef.current?.dispose();
          sceneRef.current = null;
          setIsSceneReady(false);
        }, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        if (!scene) {
          setIsSceneLoading(false);
          return;
        }
        if (isDisposed) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        // The ready state widens the main column's inset, so the slots are
        // measured after it applies.
        flushSync(() => setIsSceneReady(true));
        handleResize();
        // Measuring pauses the board's transitions, so the board fades in from
        // the next frame, once they are back.
        window.requestAnimationFrame(() => setIsSceneLoading(false));
      }).catch(() => setIsSceneLoading(false));
    }

    return () => {
      isDisposed = true;
      window.clearTimeout(loadingTimer);
      window.cancelAnimationFrame(sceneFrameId);
      exitFollowRef.current.generation += 1;
      exitFollowRef.current.isRunning = false;
      window.removeEventListener("resize", handleResize);
      scroller.destroy();
      scrollerRef.current = null;
      sceneRef.current?.dispose();
      sceneRef.current = null;
      paintSceneRef.current = () => {};
    };
  }, []);

  // Synchronise the 3D switch's lever with the sound setting.
  useEffect(() => {
    sceneInputRef.current.isSoundOn = isSoundOn;
    paintSceneRef.current();
  }, [isSoundOn]);

  // Synchronise the hidden 3D piece with the item whose 2D icon is flying.
  useEffect(() => {
    sceneInputRef.current.heroId = sceneHeroId;
    paintSceneRef.current();
  }, [sceneHeroId]);

  // Synchronise the scene's colours with the colour scheme.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange() {
      sceneRef.current?.refreshColors();
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // While the DOM items leave or return, the pieces follow their translate.
  function followExit(onDone?: () => void) {
    const stage = stageRef.current;
    if (!stage || !sceneRef.current) {
      onDone?.();
      return;
    }
    const startedAt = performance.now();
    const follow = exitFollowRef.current;
    follow.generation += 1;
    follow.isRunning = true;
    const generation = follow.generation;
    const ids = [...stage.querySelectorAll<HTMLElement>("[data-row]")].flatMap((rowElement) => {
      const row = rowElement.dataset.row;
      const subIds = [...rowElement.querySelectorAll<HTMLElement>("[data-sub]")].map((sub) => `sub-${row}-${sub.dataset.sub}`);
      return [`main-${row}`, ...subIds];
    });
    function step(now: number) {
      if (!stage || generation !== follow.generation) return;
      sceneInputRef.current.offsets = new Map(ids.map((id) => [id, readExitOffset(stage, id)]));
      paintSceneRef.current();
      if (now - startedAt < EXIT_FOLLOW_MS) {
        window.requestAnimationFrame(step);
        return;
      }
      sceneInputRef.current.offsets = new Map();
      follow.isRunning = false;
      onDone?.();
      if (needsPlaceRef.current && stage.dataset.detail !== "open") placeSceneRef.current();
      paintSceneRef.current();
    }
    window.requestAnimationFrame(step);
  }

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
    window.addEventListener("click", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
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
    const copy = subElement?.querySelector<HTMLElement>(".menu-sub-heading");
    if (!stage || !detail || !subElement || !icon || !label || !copy) return;
    const frame = scrollerRef.current?.readFrame();
    if (!frame) return;
    const restoreBoard = flattenBoard(stage);
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
    detail.scrollTop = 0;
    const heading = detail.querySelector("h2");
    if (heading) {
      // The copy of the label set like the heading, scaled down to the label's
      // size, is what lands: it ends the flight at scale 1 as the same text the
      // heading is, rather than as small text blown up.
      const restScale = Number.parseFloat(getComputedStyle(label).fontSize) / Number.parseFloat(getComputedStyle(heading).fontSize);
      const copyRect = copy.getBoundingClientRect();
      const copyText = readTextRect(copy);
      const headingText = readTextRect(heading);
      const move = measureLabelMove(
        projectRestingCenter({ x: copyText.left, y: copyText.top }, motion),
        projectRestingCenter({ x: copyRect.left + copyRect.width / 2, y: copyRect.top }, motion),
        { x: headingText.left, y: headingText.top },
        restScale,
      );
      subElement.style.setProperty("--label-dx", `${move.dx}px`);
      subElement.style.setProperty("--label-dy", `${move.dy}px`);
    }
    restoreBoard();
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
    setSceneHeroId(`sub-${mainIndex}-${index}`);
    followExit();
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
    followExit();
    // The piece takes the icon's place again once the icon is back over it.
    closeTimers.current.push(window.setTimeout(() => setSceneHeroId(null), HERO_RETURN_MS));
    cue("transition_down");
  }

  function activateSub(sub: SubItem, index: number) {
    goTo("sub", index);
    switch (sub.action.kind) {
      case "soundSwitch":
        if (isSoundOn) {
          cue("toggle_off");
          bgm.stop();
          setIsSoundOn(false);
        } else {
          setIsSoundOn(true);
          piano.play("toggle_on", SOUND_VOLUME);
          bgm.start();
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
            <span className="menu-sub-label">
              {renderLabel(sub)}
              <ExternalLink className="menu-sub-external" aria-hidden="true" />
            </span>
          </a>
        );
      case "detail":
        return (
          <button key={sub.id} type="button" {...shared}>
            <span className="menu-sub-icon">
              <sub.icon aria-hidden="true" />
            </span>
            <span className="menu-sub-label">{renderLabel(sub)}</span>
            <span className="menu-sub-heading" aria-hidden="true">
              {sub.label}
            </span>
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
      data-scene={isSceneReady ? "ready" : undefined}
      data-scene-loading={isSceneLoading || undefined}
      data-scene-hero={sceneHeroId ? "" : undefined}
    >
      <div className="menu-board">
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
      </div>
      <canvas className="menu-scene" aria-hidden="true" />

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

      <EdgeBlur edge="top" />
      <EdgeBlur edge="bottom" />
    </main>
  );
}
