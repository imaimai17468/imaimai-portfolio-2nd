"use client";

import type { AnalyticsEvent } from "@/entities/analytics/analyticsEvent";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const sendToGitHub = (events: AnalyticsEvent[]) => {
  navigator.sendBeacon(
    "/api/analytics",
    new Blob([JSON.stringify({ events })], { type: "application/json" })
  );
};

const hasConsent = () =>
  typeof window !== "undefined" &&
  localStorage.getItem("tracking-consent") === "accepted";

export const PageTracker: React.FC = () => {
  const pathname = usePathname();
  const startTime = useRef(0);
  const prevPath = useRef(pathname);
  const buffer = useRef<AnalyticsEvent[]>([]);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const flush = useCallback(() => {
    if (buffer.current.length === 0) return;
    sendToGitHub(buffer.current);
    buffer.current = [];
  }, []);

  useEffect(() => {
    if (!hasConsent()) return;

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
  }, [pathname, flush]);

  useEffect(() => {
    const interval = setInterval(flush, 60_000);

    const handleBeforeUnload = () => {
      if (!hasConsent()) return;

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
