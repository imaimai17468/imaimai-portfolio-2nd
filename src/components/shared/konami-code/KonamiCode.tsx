"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const KonamiCode: React.FC = () => {
  const [found, setFound] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progressRef.current];
      const matches = e.key.toLowerCase() === expected?.toLowerCase();
      const restartsSequence =
        e.key.toLowerCase() === SEQUENCE[0].toLowerCase();
      progressRef.current = matches
        ? progressRef.current + 1
        : restartsSequence
          ? 1
          : 0;
      if (progressRef.current === SEQUENCE.length) {
        progressRef.current = 0;
        setFound(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!found) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFound(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [found]);

  if (!found) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-backdrop"
      onClick={() => setFound(false)}
      role="presentation"
    >
      <div
        className="border border-border bg-background p-6 max-w-sm mx-4 flex flex-col items-center text-center gap-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="隠しコマンド"
      >
        <Image src="/frog_large.png" alt="" width={48} height={48} />
        <h3 className="text-sm font-medium text-foreground">
          コナミコマンド、見つけましたね
        </h3>
        <p className="text-xs text-muted-foreground">
          細部まで見てくれてありがとうございます。
        </p>
        <button
          type="button"
          onClick={() => setFound(false)}
          className="mt-1 min-h-11 min-w-11 px-3 py-1 text-xs border border-border bg-background text-foreground hover:bg-secondary focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
