"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

const CELL_SIZE = 48;
const TOGGLE_SIZE = 28;
const RIPPLE_SPEED = 0.001;

function hasViewTransition(
  doc: Document
): doc is Document & { startViewTransition: (cb: () => void) => void } {
  return "startViewTransition" in doc;
}

export const SymbolGridBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / CELL_SIZE) + 1,
        rows: Math.ceil(window.innerHeight / CELL_SIZE) + 1,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const triggerRipple = useCallback(
    (clickX: number, clickY: number) => {
      const grid = containerRef.current?.firstElementChild;
      if (!grid) return;
      const cells = grid.children;
      const firstCell = cells[0];
      const baseColor =
        firstCell instanceof HTMLElement
          ? getComputedStyle(firstCell).color
          : "currentColor";

      Array.from(cells).forEach((cell, i) => {
        if (!(cell instanceof HTMLElement)) return;

        const col = i % dimensions.cols;
        const row = Math.floor(i / dimensions.cols);
        const cellCenterX = col * CELL_SIZE + CELL_SIZE / 2;
        const cellCenterY = row * CELL_SIZE + CELL_SIZE / 2;

        const dx = cellCenterX - clickX;
        const dy = cellCenterY - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = distance * RIPPLE_SPEED * 1000;
        const hue = (distance * 0.5) % 360;

        cell.animate(
          [
            { transform: "translateZ(0) scale(1)" },
            {
              transform: "translateZ(30px) scale(1.15)",
              opacity: "0.6",
              offset: 0.35,
            },
            { transform: "translateZ(0) scale(1)" },
          ],
          { duration: 800, delay, easing: "ease-out", fill: "none" }
        );
        cell.animate(
          [
            { color: baseColor },
            { color: `hsl(${hue} 70% 65% / 0.3)`, offset: 0.3 },
            { color: `hsl(${hue} 70% 65% / 0.3)`, offset: 0.5 },
            { color: baseColor },
          ],
          { duration: 1000, delay, easing: "ease-in-out", fill: "none" }
        );
      });
    },
    [dimensions.cols]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
    },
    [triggerRipple]
  );

  const totalCells = dimensions.cols * dimensions.rows;
  const isMobile = dimensions.cols > 0 && dimensions.cols * CELL_SIZE < 768;
  const toggleIndex = isMobile
    ? dimensions.cols + (dimensions.cols - 3)
    : dimensions.cols + 1;

  const toggleCol = dimensions.cols > 0 ? toggleIndex % dimensions.cols : 0;
  const toggleRow =
    dimensions.cols > 0 ? Math.floor(toggleIndex / dimensions.cols) : 0;
  const toggleCenterX = toggleCol * CELL_SIZE + CELL_SIZE / 2;
  const toggleCenterY = toggleRow * CELL_SIZE + CELL_SIZE / 2;

  const handleToggle = useCallback(() => {
    const targetTheme = resolvedTheme === "dark" ? "light" : "dark";

    document.documentElement.style.setProperty(
      "--reveal-x",
      `${toggleCenterX}px`
    );
    document.documentElement.style.setProperty(
      "--reveal-y",
      `${toggleCenterY}px`
    );

    if (hasViewTransition(document)) {
      document.startViewTransition(() => {
        setTheme(targetTheme);
      });
    } else {
      setTheme(targetTheme);
    }
  }, [resolvedTheme, setTheme, toggleCenterX, toggleCenterY]);

  return (
    <div
      ref={containerRef}
      role="presentation"
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ perspective: "600px" }}
      onClick={handleClick}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${dimensions.cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${dimensions.rows}, ${CELL_SIZE}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: totalCells }, (_, i) => {
          if (i === toggleIndex) {
            return (
              <button
                type="button"
                key={i}
                className="flex items-center justify-center text-xs border border-foreground-faint text-foreground-faint m-auto"
                style={{ width: TOGGLE_SIZE, height: TOGGLE_SIZE }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                aria-label="Toggle theme"
              >
                {mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : ""}
              </button>
            );
          }

          return (
            <div
              key={i}
              className="flex items-center justify-center text-foreground/[0.07] text-sm select-none"
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            >
              +
            </div>
          );
        })}
      </div>
    </div>
  );
};
