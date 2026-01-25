"use client";

import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { LinkItem } from "@/entities/bento/link-item";

const ACTIVITIES: LinkItem[] = [
  {
    title: "しずかなインターネット",
    url: "https://sizu.me/imaimai17468",
    description: "静かで心地よいインターネット空間での活動",
  },
  {
    title: "Zenn",
    url: "https://zenn.dev/imaimai17468",
    description: "技術記事やナレッジの共有",
  },
  {
    title: "Portfolio",
    url: "https://imaimai.tech",
    description: "ポートフォリオサイト",
  },
  {
    title: "LAPRAS",
    url: "https://lapras.com/public/imaimai17468",
    description: "エンジニアとしてのキャリアプロフィール",
  },
];

/**
 * Activities Section - 活動
 *
 * design-guidelines:
 * - Spatial Composition: スタッガードアニメーションでリズム感
 * - Typography: セクションタイトルの視覚的階層
 *
 * UX原則:
 * - Progressive Disclosure: スクロールで順番に表示
 * - Immediate Feedback: ホバーで視覚的フィードバック
 */
export const ActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto w-full">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm text-zinc-500 tracking-wider mb-2 block">01</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">Activities</h2>
          <p className="text-zinc-500 mt-4 max-w-lg">執筆活動やコミュニティでの発信</p>
        </motion.div>

        {/* アクティビティリスト */}
        <div className="space-y-4">
          {ACTIVITIES.map((activity, index) => (
            <ActivityCard key={activity.url} activity={activity} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

type ActivityCardProps = {
  activity: LinkItem;
  index: number;
  isInView: boolean;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index, isInView }) => {
  const domain = new URL(activity.url).hostname.replace("www.", "");
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={activity.url} target="_blank" rel="noopener noreferrer" className="group block">
        <div className="flex items-center justify-between p-6 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-200 hover:bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <Image
              src={faviconUrl}
              alt={`${activity.title} favicon`}
              width={24}
              height={24}
              className="flex-shrink-0"
              unoptimized
            />
            <div>
              <h3 className="text-lg font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">
                {activity.title}
              </h3>
              <p className="text-sm text-zinc-500">{activity.description}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
};
