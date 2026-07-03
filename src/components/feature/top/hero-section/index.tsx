"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BLACK_SCALE = 30;
const FINAL_SCALE = 1;
const INTRO_DELAY = 300;
const INTRO_DURATION = 2000;
const SPACER_HEIGHT = 1800;

const CENTROID_X = 35.38;
const CENTROID_Y = 81.22;

type Phase = "black" | "intro" | "ready";

type Layout = {
  elSize: number;
  singleBlockScale: number;
};

function calcLayout(vw: number, vh: number): Layout {
  const elSize = Math.min(400, vw - 32);
  const cx = (elSize * CENTROID_X) / 100;
  const cy = (elSize * CENTROID_Y) / 100;
  const dL = cx;
  const dR = elSize * 0.74 - cx;
  const dT = cy - elSize * 0.507;
  const dB = elSize - cy;
  const elLeft = (vw - elSize) / 2;
  const elTop = (vh - elSize) / 2;
  const sL = (elLeft + cx) / dL;
  const sR = (vw - elLeft - cx) / dR;
  const sT = (elTop + cy) / dT;
  const sB = (vh - elTop - cy) / dB;
  const singleBlockScale = Math.min(3, sL, sR, sT, sB) * 1.15;
  return { elSize, singleBlockScale };
}

export const HeroSection: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("black");
  const [introProgress, setIntroProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [layout, setLayout] = useState<Layout>({
    elSize: 400,
    singleBlockScale: 3,
  });
  const phaseRef = useRef<Phase>("black");

  useEffect(() => {
    const update = () =>
      setLayout(calcLayout(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
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
        }
      };
      frame = requestAnimationFrame(animate);
    }, INTRO_DELAY);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, []);

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

  let scale: number;
  if (phase === "black") {
    scale = BLACK_SCALE;
  } else if (phase === "intro") {
    scale =
      BLACK_SCALE - (BLACK_SCALE - layout.singleBlockScale) * introProgress;
  } else {
    scale =
      layout.singleBlockScale -
      (layout.singleBlockScale - FINAL_SCALE) * scrollProgress;
  }

  const profileOpacity =
    phase !== "ready" ? 0 : Math.max(0, 1 - scrollProgress / 0.2);

  const otherBlocksOpacity =
    phase !== "ready" || scrollProgress < 0.4
      ? 0
      : Math.min(1, (scrollProgress - 0.4) / 0.3);

  const originT = phase === "ready" ? scrollProgress : 0;
  const ox = CENTROID_X + (50 - CENTROID_X) * originT;
  const oy = CENTROID_Y + (50 - CENTROID_Y) * originT;

  const centroidDx = ((CENTROID_X - ox) / 100) * layout.elSize * scale;
  const centroidDy = ((CENTROID_Y - oy) / 100) * layout.elSize * scale;

  const originPxX = (layout.elSize * ox) / 100;
  const originPxY = (layout.elSize * oy) / 100;

  return (
    <>
      <div style={{ height: SPACER_HEIGHT }} aria-hidden="true" />

      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute aspect-square"
          style={{
            width: layout.elSize,
            left: `calc(50vw - ${originPxX}px)`,
            top: `calc(50vh - ${originPxY}px)`,
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
            <path
              d="M74.1914 99.5H0.5V75.3086L49.7764 50.6709L74.1914 99.5Z"
              fill="#0A0A0A"
            />
            <g style={{ opacity: otherBlocksOpacity }}>
              <path
                d="M99.5 99.5H75.3086L50.6709 50.2236L99.5 25.8086V99.5Z"
                fill="#0A0A0A"
              />
              <path
                d="M24.6914 0.5L49.3291 49.7764L0.5 74.1904V0.5H24.6914Z"
                fill="#0A0A0A"
              />
              <path
                d="M99.5 0.5V24.6904L50.2236 49.3291L25.8086 0.5H99.5Z"
                fill="#0A0A0A"
              />
            </g>
          </svg>
        </div>
      </div>

      <div
        className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-out"
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
          <div className="flex items-center gap-4 pointer-events-auto">
            <a
              href="https://x.com/imaimai17468"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-background transition-colors"
            >
              X
            </a>
            <a
              href="https://github.com/imaimai17468"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-background transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@imaim.ai"
              className="text-xs text-muted hover:text-background transition-colors"
            >
              contact@imaim.ai
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
