"use client";

import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const sendToGitHub = (
  events: Array<{
    type: string;
    path?: string;
    from?: string;
    to?: string;
    dwell_seconds?: number;
  }>
) => {
  navigator.sendBeacon(
    "/api/analytics",
    new Blob([JSON.stringify({ events })], { type: "application/json" })
  );
};

export const PageTracker: React.FC = () => {
  const pathname = usePathname();
  const startTime = useRef(Date.now());
  const prevPath = useRef(pathname);
  const buffer = useRef<
    Array<{
      type: string;
      path?: string;
      from?: string;
      to?: string;
      dwell_seconds?: number;
    }>
  >([]);

  const flush = useCallback(() => {
    if (buffer.current.length === 0) return;
    sendToGitHub(buffer.current);
    buffer.current = [];
  }, []);

  useEffect(() => {
    const now = Date.now();
    const dwellMs = now - startTime.current;

    if (prevPath.current !== pathname && dwellMs > 1000) {
      const dwellSeconds = Math.round(dwellMs / 1000);
      track("page_dwell", {
        path: prevPath.current,
        dwell_seconds: dwellSeconds,
      });
      track("page_transition", { from: prevPath.current, to: pathname });

      buffer.current.push({
        type: "dwell",
        path: prevPath.current,
        dwell_seconds: dwellSeconds,
      });
      buffer.current.push({
        type: "transition",
        from: prevPath.current,
        to: pathname,
      });
    }

    prevPath.current = pathname;
    startTime.current = now;
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(flush, 60_000);

    const handleBeforeUnload = () => {
      const dwellMs = Date.now() - startTime.current;
      if (dwellMs > 1000) {
        const dwellSeconds = Math.round(dwellMs / 1000);
        track("page_dwell", { path: pathname, dwell_seconds: dwellSeconds });
        buffer.current.push({
          type: "dwell",
          path: pathname,
          dwell_seconds: dwellSeconds,
        });
      }
      flush();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, flush]);

  return null;
};
