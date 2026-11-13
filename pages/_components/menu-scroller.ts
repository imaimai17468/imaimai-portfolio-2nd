import {
  applyRubberBand,
  clampIndex,
  isSettled,
  projectTarget,
  stepSpring,
  type MenuAxis,
  type SpringState,
} from "./menu-motion";

export interface MenuFrame {
  readonly main: number;
  readonly sub: number;
  readonly subOwner: number;
  readonly leftover: { readonly owner: number; readonly shift: number } | null;
}

export interface MenuScrollerOptions {
  countOf(axis: MenuAxis, mainIndex: number): number;
  sizeOf(axis: MenuAxis): number;
  onStep(axis: MenuAxis, index: number): void;
  paint(frame: MenuFrame): void;
}

export interface MenuScroller {
  goTo(axis: MenuAxis, index: number): void;
  setInputEnabled(isEnabled: boolean): void;
  repaint(): void;
  destroy(): void;
}

interface AxisState {
  position: number;
  velocity: number;
  target: number | null;
  lastIndex: number;
}

interface Sample {
  readonly time: number;
  readonly raw: number;
}

const AXES = ["main", "sub"] as const;
const SPRING_PERIOD_S = 0.42;
const WHEEL_IDLE_MS = 140;
const DRAG_START_PX = 8;
const VELOCITY_WINDOW_MS = 100;
const LINE_HEIGHT_PX = 16;

function estimateVelocity(samples: readonly Sample[]): number {
  const last = samples.at(-1);
  const first = samples.find((sample) => last && last.time - sample.time <= VELOCITY_WINDOW_MS);
  if (!first || !last || last.time === first.time) return 0;
  return ((last.raw - first.raw) / (last.time - first.time)) * 1000;
}

interface Gesture {
  raw: Record<MenuAxis, number>;
  samples: Record<MenuAxis, Sample[]>;
}

function startGesture(origin: Record<MenuAxis, number>): Gesture {
  return { raw: { ...origin }, samples: { main: [], sub: [] } };
}

export function createMenuScroller(stage: HTMLElement, options: MenuScrollerOptions): MenuScroller {
  const axes: Record<MenuAxis, AxisState> = {
    main: { position: 0, velocity: 0, target: null, lastIndex: 0 },
    sub: { position: 0, velocity: 0, target: null, lastIndex: 0 },
  };
  let leftover: { owner: number; spring: SpringState } | null = null;
  let frame = 0;
  let lastFrameTime = 0;
  let drag: (Gesture & { pointerId: number; lastX: number; lastY: number; isDragging: boolean }) | null = null;
  let wheel: Gesture | null = null;
  let wheelTimer = 0;
  let shouldSuppressClick = false;
  let isInputEnabled = true;

  function countOf(axis: MenuAxis): number {
    return options.countOf(axis, axes.main.lastIndex);
  }

  function paint() {
    options.paint({
      main: axes.main.position,
      sub: axes.sub.position,
      subOwner: axes.main.lastIndex,
      leftover: leftover && { owner: leftover.owner, shift: leftover.spring.position },
    });
  }

  // The sub row belongs to the selected main item. When the selection moves,
  // the shift it had springs back on the item it left, and the new row starts
  // from its first item, with any gesture in progress counting from there.
  function handOverSubRow(previousMain: number) {
    const sub = axes.sub;
    if (Math.abs(sub.position) > 0.001) {
      leftover = { owner: previousMain, spring: { position: sub.position, velocity: sub.velocity } };
    }
    sub.position = 0;
    sub.velocity = 0;
    sub.target = null;
    sub.lastIndex = 0;
    for (const gesture of [drag, wheel]) {
      if (!gesture) continue;
      gesture.raw.sub = 0;
      gesture.samples.sub = [];
    }
    animate();
  }

  function emitSteps() {
    const main = axes.main;
    const mainIndex = clampIndex(main.position, countOf("main"));
    if (mainIndex !== main.lastIndex) {
      const previousMain = main.lastIndex;
      main.lastIndex = mainIndex;
      handOverSubRow(previousMain);
      options.onStep("main", mainIndex);
    }
    const sub = axes.sub;
    const subIndex = clampIndex(sub.position, countOf("sub"));
    if (subIndex !== sub.lastIndex) {
      sub.lastIndex = subIndex;
      options.onStep("sub", subIndex);
    }
  }

  function tick(time: number) {
    const dt = Math.min((time - lastFrameTime) / 1000, 1 / 30);
    lastFrameTime = time;
    let isMoving = false;
    for (const state of Object.values(axes)) {
      if (state.target === null) continue;
      let next: SpringState = state;
      for (let step = 0; step < 4; step += 1) next = stepSpring(next, state.target, dt / 4, SPRING_PERIOD_S);
      state.position = next.position;
      state.velocity = next.velocity;
      if (isSettled(state, state.target)) {
        state.position = state.target;
        state.velocity = 0;
        state.target = null;
      } else {
        isMoving = true;
      }
    }
    if (leftover) {
      let next = leftover.spring;
      for (let step = 0; step < 4; step += 1) next = stepSpring(next, 0, dt / 4, SPRING_PERIOD_S);
      leftover = isSettled(next, 0) ? null : { owner: leftover.owner, spring: next };
      isMoving ||= leftover !== null;
    }
    emitSteps();
    paint();
    frame = isMoving ? requestAnimationFrame(tick) : 0;
  }

  function animate() {
    if (frame !== 0) return;
    lastFrameTime = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function settle(axis: MenuAxis, target: number, velocity: number) {
    const state = axes[axis];
    state.target = target;
    state.velocity = velocity;
    animate();
  }

  function follow(gesture: Gesture, time: number) {
    for (const axis of AXES) {
      const state = axes[axis];
      const count = countOf(axis);
      const raw = gesture.raw[axis];
      state.target = null;
      state.position = applyRubberBand(raw, count);
      const samples = gesture.samples[axis];
      samples.push({ time, raw });
      if (samples.length > 20) samples.shift();
    }
    emitSteps();
    paint();
  }

  function release(gesture: Gesture, shouldProject: boolean) {
    for (const axis of AXES) {
      const state = axes[axis];
      const count = countOf(axis);
      const velocity = shouldProject ? estimateVelocity(gesture.samples[axis]) : 0;
      const isInside = state.position >= 0 && state.position <= count - 1;
      settle(axis, projectTarget(state.position, velocity, count), isInside ? velocity : 0);
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (!isInputEnabled || !event.isPrimary || event.button !== 0) return;
    for (const state of Object.values(axes)) {
      if (state.target === null) continue;
      state.target = null;
      state.velocity = 0;
    }
    drag = {
      ...startGesture({ main: axes.main.position, sub: axes.sub.position }),
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      isDragging: false,
    };
  }

  function handlePointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    if (!drag.isDragging) {
      if (Math.hypot(dx, dy) < DRAG_START_PX) return;
      drag.isDragging = true;
      stage.setPointerCapture(event.pointerId);
    }
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.raw.main -= dy / options.sizeOf("main");
    drag.raw.sub -= dx / options.sizeOf("sub");
    follow(drag, event.timeStamp);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const gesture = drag;
    drag = null;
    if (!gesture.isDragging) return;
    shouldSuppressClick = true;
    release(gesture, true);
  }

  function handleClickCapture(event: MouseEvent) {
    if (!shouldSuppressClick) return;
    shouldSuppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    if (!isInputEnabled) return;
    const scale = event.deltaMode === 0 ? 1 : LINE_HEIGHT_PX;
    const deltaX = (event.deltaX || (event.shiftKey ? event.deltaY : 0)) * scale;
    const deltaY = (event.shiftKey ? 0 : event.deltaY) * scale;
    wheel ??= startGesture({ main: axes.main.position, sub: axes.sub.position });
    wheel.raw.main += deltaY / options.sizeOf("main");
    wheel.raw.sub += deltaX / options.sizeOf("sub");
    follow(wheel, event.timeStamp);
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      if (!wheel) return;
      const gesture = wheel;
      wheel = null;
      release(gesture, false);
    }, WHEEL_IDLE_MS);
  }

  function handleResize() {
    paint();
  }

  stage.addEventListener("pointerdown", handlePointerDown);
  stage.addEventListener("pointermove", handlePointerMove);
  stage.addEventListener("pointerup", handlePointerUp);
  stage.addEventListener("pointercancel", handlePointerUp);
  stage.addEventListener("click", handleClickCapture, { capture: true });
  stage.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", handleResize);
  paint();

  return {
    goTo(axis, index) {
      settle(axis, clampIndex(index, countOf(axis)), axes[axis].velocity);
    },
    setInputEnabled(isEnabled) {
      isInputEnabled = isEnabled;
      if (!isEnabled) drag = null;
    },
    repaint: paint,
    destroy() {
      cancelAnimationFrame(frame);
      window.clearTimeout(wheelTimer);
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerup", handlePointerUp);
      stage.removeEventListener("pointercancel", handlePointerUp);
      stage.removeEventListener("click", handleClickCapture, { capture: true });
      stage.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    },
  };
}
