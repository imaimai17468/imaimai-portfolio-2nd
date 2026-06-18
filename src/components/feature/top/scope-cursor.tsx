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
  const [mode, setMode] = useState<CursorMode>("default");
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
          setMode("pointer");
        }
      } else {
        pos.current.x += (mouse.current.x - pos.current.x) * LERP_SPEED;
        pos.current.y += (mouse.current.y - pos.current.y) * LERP_SPEED;
        snappedRef.current = null;
        dims.current = { w: CURSOR_SIZE, h: CURSOR_SIZE };
        if (prevMode !== "default") {
          prevMode = "default";
          setMode("default");
        }
      }

      const { w, h } = dims.current;
      cursor.style.transform = `translate(${pos.current.x - w / 2}px, ${pos.current.y - h / 2}px)`;
      cursor.style.width = `${w}px`;
      cursor.style.height = `${h}px`;

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
      <ScopeSvg mode={mode} />
    </div>
  );
};

const ScopeSvg: React.FC<{ mode: CursorMode }> = ({ mode }) => {
  const corner = 6;

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
      {mode === "default" && (
        <>
          <line x1={50} y1={6} x2={50} y2={44} className="stroke-foreground/60" strokeWidth={2} />
          <line x1={50} y1={56} x2={50} y2={94} className="stroke-foreground/60" strokeWidth={2} />
          <line x1={6} y1={50} x2={44} y2={50} className="stroke-foreground/60" strokeWidth={2} />
          <line x1={56} y1={50} x2={94} y2={50} className="stroke-foreground/60" strokeWidth={2} />
        </>
      )}

      <path
        d={`M${corner * 2},0 L0,0 L0,${corner * 2}`}
        className="stroke-foreground/80"
        strokeWidth={3}
      />
      <path
        d={`M${100 - corner * 2},0 L100,0 L100,${corner * 2}`}
        className="stroke-foreground/80"
        strokeWidth={3}
      />
      <path
        d={`M0,${100 - corner * 2} L0,100 L${corner * 2},100`}
        className="stroke-foreground/80"
        strokeWidth={3}
      />
      <path
        d={`M100,${100 - corner * 2} L100,100 L${100 - corner * 2},100`}
        className="stroke-foreground/80"
        strokeWidth={3}
      />
    </svg>
  );
};
