"use client";

import { useCallback, useEffect, useState } from "react";

export const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("tracking-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem("tracking-consent", "accepted");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-6 py-2">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          UX改善のためにページ閲覧データを収集しています
        </p>
        <button
          type="button"
          onClick={accept}
          className="flex-shrink-0 px-3 py-1 text-xs border border-border bg-background text-foreground hover:bg-secondary focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
