"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 32;
const MAGNET_RADIUS = 60;
const LERP_SPEED = 0.15;
const MAGNET_LERP = 0.2;
const SNAP_PADDING = 4;

type CursorMode = "default" | "pointer";

type CursorDimensions = {
  w: number;
  h: number;
};

export const ScopeCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const dims = useRef<CursorDimensions>({ w: CURSOR_SIZE, h: CURSOR_SIZE });
  const rafRef = useRef(0);
  const snappedRef = useRef<Element | null>(null);
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    setHasPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const findNearestInteractive = useCallback((x: number, y: number) => {
    const elements = document.querySelectorAll("a, button");
    let nearest: { el: Element; dist: number; rect: DOMRect } | null = null;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist < MAGNET_RADIUS && (!nearest || dist < nearest.dist)) {
        nearest = { el, dist, rect };
      }
    }

    return nearest;
  }, []);

  useEffect(() => {
    if (!hasPointer) return;

    let prevMode: CursorMode = "default";

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    const onClick = (e: MouseEvent) => {
      const snapped = snappedRef.current;
      if (!snapped) return;
      if (snapped.contains(e.target instanceof Node ? e.target : null)) return;

      const rect = snapped.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      if (dist > MAGNET_RADIUS) return;

      e.preventDefault();
      e.stopPropagation();
      if (snapped instanceof HTMLElement) {
        requestAnimationFrame(() => {
          snapped.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              clientX: pos.current.x,
              clientY: pos.current.y,
            }),
          );
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick, true);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const animate = () => {
      const cursor = cursorRef.current;
      if (!cursor) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target = findNearestInteractive(mouse.current.x, mouse.current.y);

      if (target) {
        const cx = target.rect.left + target.rect.width / 2;
        const cy = target.rect.top + target.rect.height / 2;
        pos.current.x += (cx - pos.current.x) * MAGNET_LERP;
        pos.current.y += (cy - pos.current.y) * MAGNET_LERP;
        snappedRef.current = target.el;
        dims.current = {
          w: target.rect.width + SNAP_PADDING * 2,
          h: target.rect.height + SNAP_PADDING * 2,
        };
        if (prevMode !== "pointer") {
          prevMode = "pointer";
        }
      } else {
        pos.current.x += (mouse.current.x - pos.current.x) * LERP_SPEED;
        pos.current.y += (mouse.current.y - pos.current.y) * LERP_SPEED;
        snappedRef.current = null;
        dims.current = { w: CURSOR_SIZE, h: CURSOR_SIZE };
        if (prevMode !== "default") {
          prevMode = "default";
        }
      }

      const { w, h } = dims.current;
      cursor.style.transform = `translate(${pos.current.x - w / 2}px, ${pos.current.y - h / 2}px)`;
      cursor.style.width = `${w}px`;
      cursor.style.height = `${h}px`;
      cursor.dataset.mode = prevMode;

      const svg = cursor.querySelector("svg");
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const c = 6;
        const paths = svg.querySelectorAll("[data-corner]");
        paths[0]?.setAttribute("d", `M${c},0 L0,0 L0,${c}`);
        paths[1]?.setAttribute("d", `M${w - c},0 L${w},0 L${w},${c}`);
        paths[2]?.setAttribute("d", `M0,${h - c} L0,${h} L${c},${h}`);
        paths[3]?.setAttribute("d", `M${w},${h - c} L${w},${h} L${w - c},${h}`);

        if (prevMode === "default") {
          const hw = w / 2;
          const hh = h / 2;
          const g = 3;
          const lines = svg.querySelectorAll("[data-cross]");
          lines[0]?.setAttribute("x1", String(hw));
          lines[0]?.setAttribute("y1", String(g));
          lines[0]?.setAttribute("x2", String(hw));
          lines[0]?.setAttribute("y2", String(hh - g));
          lines[1]?.setAttribute("x1", String(hw));
          lines[1]?.setAttribute("y1", String(hh + g));
          lines[1]?.setAttribute("x2", String(hw));
          lines[1]?.setAttribute("y2", String(h - g));
          lines[2]?.setAttribute("x1", String(g));
          lines[2]?.setAttribute("y1", String(hh));
          lines[2]?.setAttribute("x2", String(hw - g));
          lines[2]?.setAttribute("y2", String(hh));
          lines[3]?.setAttribute("x1", String(hw + g));
          lines[3]?.setAttribute("y1", String(hh));
          lines[3]?.setAttribute("x2", String(w - g));
          lines[3]?.setAttribute("y2", String(hh));
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasPointer, findNearestInteractive]);

  if (!hasPointer) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s, width 0.15s, height 0.15s",
      }}
    >
      <ScopeSvg />
    </div>
  );
};

const ScopeSvg: React.FC = () => {
  const s = CURSOR_SIZE;
  const c = 6;
  const g = 3;
  const hw = s / 2;
  const hh = s / 2;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${s} ${s}`} fill="none">
      <g className="scope-crosshair">
        <line
          data-cross=""
          x1={hw}
          y1={g}
          x2={hw}
          y2={hh - g}
          className="stroke-foreground/60"
          strokeWidth={1}
        />
        <line
          data-cross=""
          x1={hw}
          y1={hh + g}
          x2={hw}
          y2={s - g}
          className="stroke-foreground/60"
          strokeWidth={1}
        />
        <line
          data-cross=""
          x1={g}
          y1={hh}
          x2={hw - g}
          y2={hh}
          className="stroke-foreground/60"
          strokeWidth={1}
        />
        <line
          data-cross=""
          x1={hw + g}
          y1={hh}
          x2={s - g}
          y2={hh}
          className="stroke-foreground/60"
          strokeWidth={1}
        />
      </g>

      <path
        data-corner=""
        d={`M${c},0 L0,0 L0,${c}`}
        className="stroke-foreground/80"
        strokeWidth={1.5}
      />
      <path
        data-corner=""
        d={`M${s - c},0 L${s},0 L${s},${c}`}
        className="stroke-foreground/80"
        strokeWidth={1.5}
      />
      <path
        data-corner=""
        d={`M0,${s - c} L0,${s} L${c},${s}`}
        className="stroke-foreground/80"
        strokeWidth={1.5}
      />
      <path
        data-corner=""
        d={`M${s},${s - c} L${s},${s} L${s - c},${s}`}
        className="stroke-foreground/80"
        strokeWidth={1.5}
      />
    </svg>
  );
};
