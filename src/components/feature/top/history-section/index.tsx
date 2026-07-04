"use client";

import { useExpandableList } from "@/components/feature/top/use-expandable-list";

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
  },
];

export const HistorySection: React.FC = () => {
  const {
    openIndex,
    targetIndex,
    othersFading,
    othersCollapsed,
    handleToggle,
  } = useExpandableList();

  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted tracking-wider mb-8">HISTORY</h2>
      <div>
        {HISTORY.map((entry, i) => {
          const isTarget = i === targetIndex;
          const isOther = targetIndex !== null && !isTarget;

          return (
            <div
              key={entry.period}
              style={{
                opacity: isOther && othersFading ? 0 : 1,
                height: isOther && othersCollapsed ? 0 : "auto",
                marginBottom: isOther && othersCollapsed ? 0 : 16,
                overflow: "hidden",
                transition: "opacity 300ms ease-in-out",
              }}
            >
              <HistoryItem
                entry={entry}
                open={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

type HistoryItemProps = {
  entry: HistoryEntry;
  open: boolean;
  onToggle: () => void;
};

const HistoryItem: React.FC<HistoryItemProps> = ({ entry, open, onToggle }) => {
  return (
    <div>
      <button
        type="button"
        className="w-full text-left group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-background active:opacity-80"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-3">
          {open ? (
            <>
              <span className="text-xs text-muted hover:text-background transition-colors">
                ← 一覧
              </span>
              <span className="text-xs text-muted font-mono flex-shrink-0">
                {entry.period}
              </span>
              <span className="text-sm text-background">{entry.title}</span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted font-mono flex-shrink-0">
                {entry.period}
              </span>
              <span className="text-sm text-background group-hover:text-muted transition-colors">
                {entry.title}
              </span>
              <span className="text-xs text-muted">+</span>
            </>
          )}
        </div>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transition:
            "grid-template-rows 500ms ease-in-out, opacity 500ms ease-in-out",
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 pl-3 space-y-3">
            <div>
              <p className="text-xs text-muted">{entry.subtitle}</p>
              {entry.note && (
                <p className="text-xs text-muted mt-0.5">({entry.note})</p>
              )}
            </div>
            {entry.details.map((detail) => (
              <div key={detail.label}>
                <h4 className="text-xs text-muted tracking-wider uppercase mb-1.5">
                  {detail.label}
                </h4>
                <ul className="space-y-1 pl-3">
                  {detail.values.map((value) => (
                    <li
                      key={value}
                      className="text-sm text-background list-dot"
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {entry.freelance && entry.freelance.length > 0 && (
              <div>
                <h4 className="text-xs text-muted tracking-wider uppercase mb-1.5">
                  Freelance
                </h4>
                <div className="space-y-3 pl-3">
                  {entry.freelance.map((item) => (
                    <div key={item.client}>
                      <p className="text-xs text-muted mb-1">{item.client}</p>
                      <ul className="space-y-1">
                        {item.projects.map((project) => (
                          <li
                            key={project}
                            className="text-sm text-background list-dot"
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
  );
};
