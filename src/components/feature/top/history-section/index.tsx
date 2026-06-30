"use client";

import { useCallback, useState } from "react";

type DetailItem = {
  label: string;
  values: string[];
};

type FreelanceItem = {
  client: string;
  projects: string[];
};

type HistoryEntry = {
  period: string;
  title: string;
  subtitle: string;
  note?: string;
  details: DetailItem[];
  freelance?: FreelanceItem[];
};

const HISTORY: HistoryEntry[] = [
  {
    period: "2024.12 -",
    title: "アクセンチュア株式会社",
    subtitle: "Song D&DP · Product Engineer",
    details: [
      {
        label: "Projects",
        values: [
          "MultiAgentSaaS開発・提案",
          "社内フットサル大会アプリの開発",
          "バイクのマイページ系アプリの開発",
          "アパレル企業の社内イベント向けデジタル展示物の開発",
        ],
      },
      { label: "Other", values: ["技育プロジェクト", "Song LT会主催"] },
      { label: "Speaker", values: ["技育祭"] },
    ],
  },
  {
    period: "2024.04 - 2024.12",
    title: "株式会社ゆめみ",
    subtitle: "Frontend Engineer",
    note: "会社消滅",
    details: [
      {
        label: "Projects",
        values: [
          "大型漫画掲載サイトのリニューアル",
          "HR系サービスのホームページのリニューアル",
          "求人掲載サービスの管理画面の新規機能開発",
          "飛行機の国際線予約サービスの新規開発",
        ],
      },
      { label: "Other", values: ["リクルーター", "技育プロジェクト"] },
      {
        label: "Speaker",
        values: ["フロントエンドカンファレンス北海道 2024", "TSKaigi 2025"],
      },
    ],
  },
  {
    period: "2022.04 - 2024.03",
    title: "長岡技術科学大学",
    subtitle: "電気電子情報工学課程",
    details: [
      { label: "研究", values: ["睡眠時脳波の構造解析"] },
      { label: "Club", values: ["学園祭実行委員会 情報局 (NUTMEG)"] },
      {
        label: "Projects",
        values: [
          "学園祭で使われる資金管理アプリの開発",
          "サークルメンバーの育成管理アプリの開発",
          "駐車場空き情報のリアルタイム監視アプリの開発",
        ],
      },
      { label: "Results", values: ["技育展 2023 企業賞"] },
    ],
    freelance: [
      {
        client: "スタートアップA社",
        projects: ["修理の受注/発注ができるLINEアプリの開発"],
      },
      {
        client: "スタートアップB社",
        projects: [
          "建築関係のマッチングプラットフォームの開発",
          "学会の抄録冊子の自動作成サービス",
          "履歴書の自動PDF化・管理サービス",
        ],
      },
    ],
  },
  {
    period: "2017.04 - 2022.03",
    title: "木更津工業高等専門学校",
    subtitle: "電子制御工学科",
    details: [
      { label: "研究", values: ["光学式心拍センサの精度評価"] },
      { label: "Club", values: ["プログラミング研究同好会"] },
      {
        label: "Projects",
        values: [
          "文化祭での自作ゲーム展示の開発",
          "研究室の鍵のカードキーシステムの開発",
          "学校の単位数計算サイトの開発",
        ],
      },
      { label: "Results", values: ["Paiza S", "AtCoder 緑"] },
    ],
    freelance: [
      {
        client: "paiza Inc.",
        projects: ["競技プログラミング問題集の作問"],
      },
    ],
  },
];

export const HistorySection: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted-foreground tracking-wider mb-8">
        HISTORY
      </h2>
      <div className="space-y-6">
        {HISTORY.map((entry) => (
          <HistoryItem key={entry.period} entry={entry} />
        ))}
      </div>
    </section>
  );
};

const HistoryItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
        <span className="text-xs text-muted-foreground font-mono flex-shrink-0 sm:w-40">
          {entry.period}
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-foreground">
              {entry.title}
            </span>
            {entry.note && (
              <span className="text-xs text-muted-foreground">
                ({entry.note})
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entry.subtitle}
          </p>
          <button
            type="button"
            className="flex items-center justify-center w-6 h-6 border border-border bg-background text-muted-foreground mt-2 focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? "Close details" : "Open details"}
          >
            <span
              className="text-xs leading-none"
              style={{ transform: "translateY(-0.5px)" }}
            >
              {open ? "−" : "+"}
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: open ? "200rem" : "0" }}
          >
            <div className="flex flex-col items-start">
              <div className="w-px h-3 bg-border ml-3" />
            </div>
            <div className="border border-border bg-background p-4 space-y-4">
              {entry.details.map((detail) => (
                <div key={detail.label}>
                  <h4 className="text-xs text-muted-foreground tracking-wider uppercase mb-1.5">
                    {detail.label}
                  </h4>
                  <ul className="space-y-1 pl-3">
                    {detail.values.map((value) => (
                      <li
                        key={value}
                        className="text-sm text-foreground-strong list-dot"
                      >
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {entry.freelance && entry.freelance.length > 0 && (
                <div>
                  <h4 className="text-xs text-muted-foreground tracking-wider uppercase mb-1.5">
                    Freelance
                  </h4>
                  <div className="space-y-3 pl-3">
                    {entry.freelance.map((item) => (
                      <div key={item.client}>
                        <p className="text-xs text-foreground-muted-alpha mb-1">
                          {item.client}
                        </p>
                        <ul className="space-y-1">
                          {item.projects.map((project) => (
                            <li
                              key={project}
                              className="text-sm text-foreground-strong list-dot"
                            >
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
