"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BLOCKS, type BlockKey } from "@/components/shared/block-page/blocks";

const BLACK_SCALE = 30;
const FINAL_SCALE = 1;
const INTRO_DELAY = 300;
const INTRO_DURATION = 2000;
const ZOOM_DURATION = 1200;
const SPACER_HEIGHT = 1800;
const PADDING = 16;

const HOME_CENTROID = BLOCKS[0];

type Phase = "black" | "intro" | "ready";

type Layout = {
  elSize: number;
  singleBlockScale: number;
};

type ZoomState = {
  block: (typeof BLOCKS)[number];
  progress: number;
  targetScale: number;
};

function calcLayout(vw: number, vh: number): Layout {
  const elSize = Math.min(400, vw - 32);
  const cx = (elSize * HOME_CENTROID.cx) / 100;
  const cy = (elSize * HOME_CENTROID.cy) / 100;
  const b = HOME_CENTROID.bounds;
  const dL = cx - (elSize * b.minX) / 100;
  const dR = (elSize * b.maxX) / 100 - cx;
  const dT = cy - (elSize * b.minY) / 100;
  const dB = (elSize * b.maxY) / 100 - cy;
  const elLeft = (vw - elSize) / 2;
  const elTop = (vh - elSize) / 2;
  const sL = (elLeft + cx - PADDING) / dL;
  const sR = (vw - elLeft - cx - PADDING) / dR;
  const sT = (elTop + cy - PADDING) / dT;
  const sB = (vh - elTop - cy - PADDING) / dB;
  const singleBlockScale = Math.min(sL, sR, sT, sB) * 0.85;
  return { elSize, singleBlockScale };
}

function calcBlockTargetScale(
  vw: number,
  vh: number,
  elSize: number,
  block: (typeof BLOCKS)[number]
): number {
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
  return Math.max(sL, sR, sT, sB) * 3;
}

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipIntro = searchParams.get("blocks") !== null;

  const [phase, setPhase] = useState<Phase>(skipIntro ? "ready" : "black");
  const [introProgress, setIntroProgress] = useState(skipIntro ? 1 : 0);
  const [scrollProgress, setScrollProgress] = useState(skipIntro ? 1 : 0);
  const [layout, setLayout] = useState<Layout>({
    elSize: 400,
    singleBlockScale: 3,
  });
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const phaseRef = useRef<Phase>(skipIntro ? "ready" : "black");

  useEffect(() => {
    const update = () => {
      const dvh = window.visualViewport?.height ?? window.innerHeight;
      setLayout(calcLayout(window.innerWidth, dvh));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (skipIntro) {
      document.body.style.backgroundColor = "var(--background)";
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, max);
      return;
    }
    let frame: number;
    const timeout = window.setTimeout(() => {
      phaseRef.current = "intro";
      setPhase("intro");
      const start = performance.now();
      const animate = (now: number) => {
        const t = Math.min((now - start) / INTRO_DURATION, 1);
        const eased = 1 - (1 - t) * (1 - t) * (1 - t);
        setIntroProgress(eased);
        if (t < 1) {
          frame = requestAnimationFrame(animate);
        } else {
          phaseRef.current = "ready";
          setPhase("ready");
          document.body.style.backgroundColor = "var(--background)";
        }
      };
      frame = requestAnimationFrame(animate);
    }, INTRO_DELAY);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [skipIntro]);

  useEffect(() => {
    const onScroll = () => {
      if (phaseRef.current !== "ready") return;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateToBlock = useCallback(
    (key: BlockKey) => {
      const block = BLOCKS.find((b) => b.key === key);
      if (!block || zoom) return;
      const dvh = window.visualViewport?.height ?? window.innerHeight;
      const targetScale = calcBlockTargetScale(
        window.innerWidth,
        dvh,
        layout.elSize,
        block
      );
      setZoom({ block, progress: 0, targetScale });
      const start = performance.now();
      const animate = (now: number) => {
        const t = Math.min((now - start) / ZOOM_DURATION, 1);
        const eased = t * t * t;
        setZoom({ block, progress: eased, targetScale });
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          document.body.style.backgroundColor = "var(--block-surface)";
          router.push(block.href);
        }
      };
      requestAnimationFrame(animate);
    },
    [router, zoom, layout.elSize]
  );

  let scale: number;
  let ox: number;
  let oy: number;

  if (zoom) {
    const zp = zoom.progress;
    scale = FINAL_SCALE + (zoom.targetScale - FINAL_SCALE) * zp;
    ox = 50 + (zoom.block.cx - 50) * zp;
    oy = 50 + (zoom.block.cy - 50) * zp;
  } else if (phase === "black") {
    scale = BLACK_SCALE;
    ox = HOME_CENTROID.cx;
    oy = HOME_CENTROID.cy;
  } else if (phase === "intro") {
    scale =
      BLACK_SCALE - (BLACK_SCALE - layout.singleBlockScale) * introProgress;
    ox = HOME_CENTROID.cx;
    oy = HOME_CENTROID.cy;
  } else {
    scale =
      layout.singleBlockScale -
      (layout.singleBlockScale - FINAL_SCALE) * scrollProgress;
    ox = HOME_CENTROID.cx + (50 - HOME_CENTROID.cx) * scrollProgress;
    oy = HOME_CENTROID.cy + (50 - HOME_CENTROID.cy) * scrollProgress;
  }

  const profileOpacity =
    phase !== "ready" || zoom ? 0 : Math.max(0, 1 - scrollProgress / 0.2);

  const otherBlocksOpacity = zoom
    ? Math.max(0, 1 - zoom.progress / 0.6)
    : phase !== "ready" || scrollProgress < 0.4
      ? 0
      : Math.min(1, (scrollProgress - 0.4) / 0.3);

  const labelsOpacity = zoom
    ? Math.max(0, 1 - zoom.progress / 0.3)
    : phase === "ready" && scrollProgress > 0.7
      ? Math.min(1, (scrollProgress - 0.7) / 0.2)
      : 0;

  const centroidDx = ((HOME_CENTROID.cx - ox) / 100) * layout.elSize * scale;
  const centroidDy = ((HOME_CENTROID.cy - oy) / 100) * layout.elSize * scale;

  const originPxX = (layout.elSize * ox) / 100;
  const originPxY = (layout.elSize * oy) / 100;

  return (
    <>
      {!zoom && <div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />}

      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute aspect-square"
          style={{
            width: layout.elSize,
            left: `calc(50vw - ${originPxX}px)`,
            top: `calc(50dvh - ${originPxY}px)`,
            transform: `scale(${scale})`,
            transformOrigin: `${ox}% ${oy}%`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-full"
          >
            {zoom ? (
              <>
                <path d={zoom.block.path} fill="var(--block-surface)" />
                <g style={{ opacity: otherBlocksOpacity }}>
                  {BLOCKS.filter((b) => b.key !== zoom.block.key).map((b) => (
                    <path key={b.key} d={b.path} fill="var(--block-surface)" />
                  ))}
                </g>
              </>
            ) : (
              <>
                <path d={BLOCKS[0].path} fill="var(--block-surface)" />
                <g style={{ opacity: otherBlocksOpacity }}>
                  {BLOCKS.slice(1).map((b) => (
                    <path key={b.key} d={b.path} fill="var(--block-surface)" />
                  ))}
                </g>
              </>
            )}
            {labelsOpacity > 0 && (
              <g
                style={{ opacity: labelsOpacity }}
                className="pointer-events-auto"
              >
                {BLOCKS.map((b) => (
                  <a
                    key={b.key}
                    href={b.href}
                    className="cursor-pointer outline-none focus-visible:underline focus-visible:outline-hidden"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToBlock(b.key);
                    }}
                  >
                    <text
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
                  </a>
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>

      <div
        className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{
          opacity: profileOpacity,
          transform: `translate(${centroidDx}px, ${centroidDy}px) scale(${scale / layout.singleBlockScale})`,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/frog_large.png"
              alt="imaimai17468"
              width={48}
              height={48}
              className="shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="text-lg font-bold text-background">
                imaimai17468
              </h1>
              <p className="text-sm text-muted">Engineer</p>
            </div>
          </div>
          <div
            className="flex items-center gap-4"
            style={{ pointerEvents: profileOpacity > 0 ? "auto" : "none" }}
          >
            <a
              href="https://x.com/imaimai17468"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-background transition-colors focus-visible:underline focus-visible:outline-hidden"
            >
              X
            </a>
            <a
              href="https://github.com/imaimai17468"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-background transition-colors focus-visible:underline focus-visible:outline-hidden"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@imaim.ai"
              className="text-xs text-muted hover:text-background transition-colors focus-visible:underline focus-visible:outline-hidden"
            >
              contact@imaim.ai
            </a>
          </div>
        </div>
      </div>

      <div
        className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{
          bottom: "max(2rem, env(safe-area-inset-bottom, 0px) + 1rem)",
          opacity: profileOpacity,
        }}
      >
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-foreground">scroll</span>
          <span className="text-foreground">↓</span>
        </div>
      </div>
    </>
  );
};
