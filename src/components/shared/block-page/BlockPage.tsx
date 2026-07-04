"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BLOCKS, type BlockKey } from "./blocks";

type BlockPageProps = {
  blockKey: BlockKey;
  children: React.ReactNode;
};

const FADE_OUT_DURATION = 300;
const ZOOM_OUT_DURATION = 1200;

function calcBlockScale(
  vw: number,
  vh: number,
  block: (typeof BLOCKS)[number]
) {
  const elSize = Math.min(400, vw - 32);
  const originInEl = {
    x: (elSize * block.cx) / 100,
    y: (elSize * block.cy) / 100,
  };
  const elLeft = (vw - elSize) / 2;
  const elTop = (vh - elSize) / 2;
  const originVp = { x: elLeft + originInEl.x, y: elTop + originInEl.y };
  const dL = originInEl.x - (elSize * block.bounds.minX) / 100;
  const dR = (elSize * block.bounds.maxX) / 100 - originInEl.x;
  const dT = originInEl.y - (elSize * block.bounds.minY) / 100;
  const dB = (elSize * block.bounds.maxY) / 100 - originInEl.y;
  const sL = dL > 0 ? originVp.x / dL : 1;
  const sR = dR > 0 ? (vw - originVp.x) / dR : 1;
  const sT = dT > 0 ? originVp.y / dT : 1;
  const sB = dB > 0 ? (vh - originVp.y) / dB : 1;
  return {
    elSize,
    scale: Math.max(sL, sR, sT, sB) * 3,
  };
}

export const BlockPage: React.FC<BlockPageProps> = ({ blockKey, children }) => {
  const router = useRouter();
  const block = BLOCKS.find((b) => b.key === blockKey);
  const [layout, setLayout] = useState({ elSize: 400, scale: 3 });
  const [contentFade, setContentFade] = useState(0);
  const [zoomOut, setZoomOut] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const t = Math.min((now - start) / 400, 1);
      setContentFade(t);
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.backgroundColor = "var(--background)";
      });
    });
  }, []);

  useEffect(() => {
    if (!block) return;
    const update = () => {
      const dvh = window.visualViewport?.height ?? window.innerHeight;
      setLayout(calcBlockScale(window.innerWidth, dvh, block));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [block]);

  const handleBack = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);

    const fadeStart = performance.now();
    const fadeOut = (now: number) => {
      const t = Math.min((now - fadeStart) / FADE_OUT_DURATION, 1);
      setContentFade(1 - t);
      if (t < 1) {
        requestAnimationFrame(fadeOut);
        return;
      }
      const zoomStart = performance.now();
      const animateZoom = (now2: number) => {
        const t2 = Math.min((now2 - zoomStart) / ZOOM_OUT_DURATION, 1);
        const eased = 1 - (1 - t2) * (1 - t2) * (1 - t2);
        setZoomOut(eased);
        if (t2 < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          router.push("/?blocks");
        }
      };
      requestAnimationFrame(animateZoom);
    };
    requestAnimationFrame(fadeOut);
  }, [router, isLeaving]);

  if (!block) return null;

  const currentScale = layout.scale - (layout.scale - 1) * zoomOut;
  const ox = block.cx + (50 - block.cx) * zoomOut;
  const oy = block.cy + (50 - block.cy) * zoomOut;
  const originPxX = (layout.elSize * ox) / 100;
  const originPxY = (layout.elSize * oy) / 100;

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute aspect-square"
          style={{
            width: layout.elSize,
            left: `calc(50vw - ${originPxX}px)`,
            top: `calc(50dvh - ${originPxY}px)`,
            transform: `scale(${currentScale})`,
            transformOrigin: `${ox}% ${oy}%`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path d={block.path} fill="var(--block-surface)" />
            {zoomOut > 0.3 && (
              <g style={{ opacity: Math.min(1, (zoomOut - 0.3) / 0.4) }}>
                {BLOCKS.filter((b) => b.key !== block.key).map((b) => (
                  <path key={b.key} d={b.path} fill="var(--block-surface)" />
                ))}
              </g>
            )}
            {zoomOut > 0.6 && (
              <g style={{ opacity: Math.min(1, (zoomOut - 0.6) / 0.3) }}>
                {BLOCKS.map((b) => (
                  <text
                    key={b.key}
                    x={b.cx}
                    y={b.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--background)"
                    fontSize="5"
                    fontWeight="300"
                  >
                    {b.label}
                  </text>
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>

      <div
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-6"
        style={{ opacity: contentFade }}
      >
        <div className="pointer-events-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-muted hover:text-background transition-colors mb-6 px-6 focus-visible:underline focus-visible:outline-hidden active:opacity-80"
          >
            ← Index
          </button>
          {children}
        </div>
      </div>
    </>
  );
};
