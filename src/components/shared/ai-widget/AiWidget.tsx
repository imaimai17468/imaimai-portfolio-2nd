"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export const AiWidget: React.FC = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const pathname = usePathname();
  const penRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = penRef.current;
    if (!el) return;
    let frame = 0;
    const animate = () => {
      const t = Date.now() * 0.002;
      el.style.transform = `translate(${Math.sin(t) * 3}px, ${Math.cos(t * 1.3) * 3}px)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowInfo(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showInfo]);

  const handleSubmit = useCallback(() => {
    const trimmed = message.trim();
    if (trimmed.length === 0) {
      setError("メッセージを入力してください");
      return;
    }
    if (trimmed.length < 10) {
      setError(`あと${10 - trimmed.length}文字以上入力してください`);
      return;
    }
    setError("");
    setStatus("sending");
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed, page: pathname }),
    })
      .then(() => {
        setStatus("sent");
        setMessage("");
        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      })
      .catch(() => {
        setStatus("idle");
        setError("送信に失敗しました");
      });
  }, [message, pathname]);

  return (
    <div className="flex items-end gap-3 p-4 sm:p-6 justify-end">
      <div className="flex items-end gap-1 shrink-0 mb-1">
        <Image src="/frog_large.png" alt="" width={28} height={28} />
        <span ref={penRef} className="text-lg text-muted-foreground">
          ✎
        </span>
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-muted-foreground">
            このサイトはAIが考えながら作っています
          </p>
          <button
            type="button"
            onClick={() => setShowInfo((prev) => !prev)}
            className="p-3.5 -m-3.5 text-muted-foreground hover:text-foreground bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80"
            aria-label="仕組みについて"
          >
            <span className="w-4 h-4 flex items-center justify-center text-xs border border-border">
              ?
            </span>
          </button>
        </div>
        {showInfo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-backdrop"
            onClick={() => setShowInfo(false)}
            role="presentation"
          >
            <div
              className="border border-border bg-background p-6 max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="このサイトの仕組み"
            >
              <h3 className="text-sm font-medium text-foreground mb-3">
                このサイトの仕組み
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  このポートフォリオはAIエージェントが継続的に改善しています。
                </p>
                <p>
                  ページの滞在時間や遷移パターンを匿名で収集し、毎日AIが分析してデザインの改善提案をPRとして作成します。
                </p>
                <p>
                  下のフォームから改善のアイデアを送ることもできます。送信された内容はGitHub
                  Issueとして記録され、AIの改善材料になります。
                </p>
                <p>
                  <a
                    href="https://github.com/imaimai17468/imaimai-portfolio-2nd/blob/main/docs/analytics-routine.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    仕組みの詳細
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="mt-4 min-h-11 min-w-11 px-3 py-1 text-xs border border-border bg-background text-foreground hover:bg-secondary focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
        {status === "sent" ? (
          <p className="text-xs text-foreground">
            送信しました。ありがとうございます。
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="改善のアイデアを送る..."
                className="flex-1 min-h-14 px-2 py-1.5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground resize-none wrap-break-word focus:outline-hidden border-b border-border hover:border-muted-foreground focus-visible:border-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="shrink-0 min-h-11 min-w-11 px-4 py-1.5 text-xs border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                {status === "sending" ? "送信中..." : "送信"}
              </button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
