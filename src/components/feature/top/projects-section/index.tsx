"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const PROJECTS = [
  {
    title: "maniae",
    url: "https://maniae.imaim.ai",
    description: "周囲の公共交通機関から終電をとにかく探すWebアプリ",
    screenshot: "/projects/maniae.png",
    favicon: "/projects/favicons/maniae-imaim-ai.png",
  },
  {
    title: "wbsb",
    url: "https://wbsb.dev",
    description: "エンジニアの知的好奇心を満たす技術記事共有サービス",
    screenshot: "/projects/wbsb.png",
    favicon: "/projects/favicons/wbsb-dev.png",
  },
  {
    title: "いまいまいフロントテンプレート",
    url: "https://github.com/imaimai17468/imaimai-front-templete",
    description:
      "Next.js + Tailwind CSS + shadcn/ui のフロントエンド開発テンプレート",
    screenshot: "/projects/front-template.png",
    favicon: "/projects/favicons/github-com.png",
  },
  {
    title: "Osampo",
    url: "https://osampo.vercel.app",
    description:
      "標高グラデーションマップでお散歩ルートを探索・記録できるアプリ",
    screenshot: "/projects/osampo.png",
    favicon: "/projects/favicons/osampo-vercel-app.png",
  },
  {
    title: "ツウキンプレイス",
    url: "https://tsuukin-place.com",
    description: "通勤時間から駅の家賃相場を調べられるサービス",
    screenshot: "/projects/tsuukin-place.png",
    favicon: "/projects/favicons/tsuukin-place-com.png",
  },
  {
    title: "Contrast Color Palette",
    url: "https://contrast-color-palette.vercel.app",
    description: "コントラスト比を考慮したカラーパレット生成ツール",
    screenshot: "/projects/contrast-color-palette.png",
  },
  {
    title: "Digital Agency Icons",
    url: "https://digital-agency-icons-docs.vercel.app",
    description:
      "デジタル庁アイコンをReact・Vue・Svelteで使える非公式コンポーネントライブラリ",
    screenshot: "/projects/digital-agency-icons.png",
  },
  {
    title: "imaimai UI",
    url: "https://imaimai-ui.vercel.app",
    description: "他のライブラリには無い、実装が面倒なコンポーネント集",
    screenshot: "/projects/imaimai-ui.png",
    favicon: "/projects/favicons/imaimai-ui-vercel-app.png",
  },
  {
    title: "木更津高専単位カウンター",
    url: "https://credits-counter-fo-knct.vercel.app",
    description: "木更津高専の卒業に必要な単位数を自動計算するツール",
    screenshot: "/projects/knct-credits.png",
    favicon: "/projects/favicons/credits-counter-fo-knct-vercel-app.png",
  },
];

export const ProjectsSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [othersFading, setOthersFading] = useState(false);
  const [othersCollapsed, setOthersCollapsed] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleToggle = useCallback(
    (index: number) => {
      if (busy) return;
      setBusy(true);

      if (openIndex === null) {
        setTargetIndex(index);
        requestAnimationFrame(() => {
          setOthersFading(true);
          setTimeout(() => {
            setOthersCollapsed(true);
            requestAnimationFrame(() => {
              setOpenIndex(index);
              setBusy(false);
            });
          }, 300);
        });
      } else {
        setOpenIndex(null);
        setTimeout(() => {
          setOthersCollapsed(false);
          requestAnimationFrame(() => {
            setOthersFading(false);
            setTimeout(() => {
              setTargetIndex(null);
              setBusy(false);
            }, 300);
          });
        }, 500);
      }
    },
    [busy, openIndex]
  );

  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted tracking-wider mb-8">PROJECTS</h2>
      <div>
        {PROJECTS.map((project, i) => {
          const isTarget = i === targetIndex;
          const isOther = targetIndex !== null && !isTarget;

          return (
            <div
              key={project.url}
              style={{
                opacity: isOther && othersFading ? 0 : 1,
                height: isOther && othersCollapsed ? 0 : "auto",
                marginBottom: isOther && othersCollapsed ? 0 : 12,
                overflow: "hidden",
                transition: "opacity 300ms ease-in-out",
              }}
            >
              <button
                type="button"
                className="w-full text-left group"
                onClick={() => handleToggle(i)}
              >
                <div className="flex items-center gap-2">
                  {openIndex === i ? (
                    <span className="text-xs text-muted hover:text-background transition-colors">
                      ← 一覧
                    </span>
                  ) : (
                    <>
                      {project.favicon && (
                        <Image
                          src={project.favicon}
                          alt=""
                          width={16}
                          height={16}
                          className="shrink-0"
                        />
                      )}
                      <span className="text-sm text-background group-hover:text-muted transition-colors">
                        {project.title}
                      </span>
                      <span className="text-xs text-muted ml-auto">+</span>
                    </>
                  )}
                </div>
              </button>
              <div
                className="grid"
                style={{
                  gridTemplateRows: openIndex === i ? "1fr" : "0fr",
                  opacity: openIndex === i ? 1 : 0,
                  transition:
                    "grid-template-rows 500ms ease-in-out, opacity 500ms ease-in-out",
                }}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 space-y-3">
                    <p className="text-xs text-muted">{project.description}</p>
                    <Image
                      src={project.screenshot}
                      alt={project.title}
                      width={640}
                      height={400}
                      className="w-full"
                    />
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-background transition-colors"
                    >
                      {project.url}
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
