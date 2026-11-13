import {
  applyRubberBand,
  clampIndex,
  isSettled,
  projectTarget,
  stepSpring,
  type MenuAxis,
} from "./menu-motion";

export interface MenuScrollerOptions {
  countOf(axis: MenuAxis, mainIndex: number): number;
  sizeOf(axis: MenuAxis): number;
  onStep(axis: MenuAxis, index: number): void;
  onEdge(): void;
  paint(main: number, sub: number): void;
}

export interface MenuScroller {
  goTo(axis: MenuAxis, index: number): void;
  repaint(): void;
  destroy(): void;
}

interface AxisState {
  position: number;
  velocity: number;
  target: number | null;
  lastIndex: number;
  isSilent: boolean;
}

interface Sample {
  readonly time: number;
  readonly raw: number;
}

const SPRING_PERIOD_S = 0.42;
const WHEEL_IDLE_MS = 140;
const AXIS_LOCK_PX = 8;
const VELOCITY_WINDOW_MS = 100;
const LINE_HEIGHT_PX = 16;

function estimateVelocity(samples: readonly Sample[]): number {
  const last = samples.at(-1);
  const first = samples.find((sample) => last && last.time - sample.time <= VELOCITY_WINDOW_MS);
  if (!first || !last || last.time === first.time) return 0;
  return ((last.raw - first.raw) / (last.time - first.time)) * 1000;
}

export function createMenuScroller(stage: HTMLElement, options: MenuScrollerOptions): MenuScroller {
  const axes: Record<MenuAxis, AxisState> = {
    main: { position: 0, velocity: 0, target: null, lastIndex: 0, isSilent: false },
    sub: { position: 0, velocity: 0, target: null, lastIndex: 0, isSilent: false },
  };
  let frame = 0;
  let lastFrameTime = 0;

  function countOf(axis: MenuAxis): number {
    return options.countOf(axis, axes.main.lastIndex);
  }

  function paint() {
    options.paint(axes.main.position, axes.sub.position);
  }

  function emitSteps() {
    for (const axis of ["main", "sub"] as const) {
      const state = axes[axis];
      const index = clampIndex(state.position, countOf(axis));
      if (index === state.lastIndex) continue;
      state.lastIndex = index;
      if (!state.isSilent) options.onStep(axis, index);
    }
  }

  function tick(time: number) {
    const dt = Math.min((time - lastFrameTime) / 1000, 1 / 30);
    lastFrameTime = time;
    let isMoving = false;
    for (const state of Object.values(axes)) {
      if (state.target === null) continue;
      let next = { position: state.position, velocity: state.velocity };
      for (let step = 0; step < 4; step += 1) next = stepSpring(next, state.target, dt / 4, SPRING_PERIOD_S);
      state.position = next.position;
      state.velocity = next.velocity;
      if (isSettled(state, state.target)) {
        state.position = state.target;
        state.velocity = 0;
        state.target = null;
        state.isSilent = false;
      } else {
        isMoving = true;
      }
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

  function returnSubToStart() {
    const sub = axes.sub;
    if (sub.position === 0 && sub.target === null) return;
    sub.isSilent = true;
    settle("sub", 0, sub.velocity);
  }

  function follow(axis: MenuAxis, raw: number, hasCuedEdge: boolean): boolean {
    const state = axes[axis];
    const count = countOf(axis);
    state.target = null;
    state.position = applyRubberBand(raw, count);
    emitSteps();
    paint();
    const isPastEdge = raw < 0 || raw > count - 1;
    if (isPastEdge && !hasCuedEdge) options.onEdge();
    return hasCuedEdge || isPastEdge;
  }

  // Drag
  let drag: {
    pointerId: number;
    startX: number;
    startY: number;
    origin: Record<MenuAxis, number>;
    axis: MenuAxis | null;
    samples: Sample[];
    hasCuedEdge: boolean;
  } | null = null;
  let shouldSuppressClick = false;

  function handlePointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    for (const state of Object.values(axes)) {
      if (state.target === null || state.isSilent) continue;
      state.target = null;
      state.velocity = 0;
    }
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: { main: axes.main.position, sub: axes.sub.position },
      axis: null,
      samples: [],
      hasCuedEdge: false,
    };
  }

  function handlePointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.axis === null) {
      if (Math.hypot(dx, dy) < AXIS_LOCK_PX) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? "sub" : "main";
      stage.setPointerCapture(event.pointerId);
      if (drag.axis === "main") returnSubToStart();
    }
    const delta = drag.axis === "main" ? dy : dx;
    const raw = drag.origin[drag.axis] - delta / options.sizeOf(drag.axis);
    drag.samples.push({ time: event.timeStamp, raw });
    if (drag.samples.length > 20) drag.samples.shift();
    drag.hasCuedEdge = follow(drag.axis, raw, drag.hasCuedEdge);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const { axis, samples } = drag;
    drag = null;
    if (axis === null) return;
    shouldSuppressClick = true;
    const state = axes[axis];
    const count = countOf(axis);
    const velocity = estimateVelocity(samples);
    const isInside = state.position >= 0 && state.position <= count - 1;
    settle(axis, projectTarget(state.position, velocity, count), isInside ? velocity : 0);
  }

  function handleClickCapture(event: MouseEvent) {
    if (!shouldSuppressClick) return;
    shouldSuppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  // Wheel and trackpad
  let wheel: { axis: MenuAxis; raw: number; samples: Sample[]; hasCuedEdge: boolean } | null = null;
  let wheelTimer = 0;

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const scale = event.deltaMode === 0 ? 1 : LINE_HEIGHT_PX;
    const deltaX = (event.deltaX || (event.shiftKey ? event.deltaY : 0)) * scale;
    const deltaY = (event.shiftKey ? 0 : event.deltaY) * scale;
    if (wheel === null) {
      const axis: MenuAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "sub" : "main";
      if (axis === "main") returnSubToStart();
      wheel = { axis, raw: axes[axis].position, samples: [], hasCuedEdge: false };
    }
    const delta = wheel.axis === "main" ? deltaY : deltaX;
    wheel.raw += delta / options.sizeOf(wheel.axis);
    wheel.samples.push({ time: event.timeStamp, raw: wheel.raw });
    wheel.hasCuedEdge = follow(wheel.axis, wheel.raw, wheel.hasCuedEdge);
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      if (!wheel) return;
      const { axis } = wheel;
      wheel = null;
      settle(axis, clampIndex(axes[axis].position, countOf(axis)), 0);
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
      if (axis === "main" && index !== axes.main.lastIndex) returnSubToStart();
      settle(axis, clampIndex(index, countOf(axis)), axes[axis].velocity);
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
