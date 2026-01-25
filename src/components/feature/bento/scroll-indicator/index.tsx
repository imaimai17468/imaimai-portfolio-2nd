"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";

type ScrollIndicatorProps = {
  progress: MotionValue<number>;
};

/**
 * スクロール進捗インジケーター
 *
 * UX原則:
 * - Goal Gradient Effect: ゴールへの接近を視覚化して動機付け
 * - Zeigarnik Effect: 進捗を見せることで完了への欲求を刺激
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ progress }) => {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3">
      {/* 進捗バー背景 */}
      <div className="relative w-0.5 h-24 bg-zinc-800 rounded-full overflow-hidden">
        {/* 進捗バー */}
        <motion.div className="absolute bottom-0 left-0 w-full bg-zinc-400 origin-bottom" style={{ scaleY }} />
      </div>

      {/* セクションドット */}
      <div className="flex flex-col gap-2">
        <SectionDot progress={progress} threshold={0} label="Profile" />
        <SectionDot progress={progress} threshold={0.33} label="Activities" />
        <SectionDot progress={progress} threshold={0.66} label="Products" />
      </div>
    </div>
  );
};

type SectionDotProps = {
  progress: MotionValue<number>;
  threshold: number;
  label: string;
};

const SectionDot: React.FC<SectionDotProps> = ({ progress, threshold, label }) => {
  const opacity = useTransform(progress, [threshold - 0.1, threshold, threshold + 0.2], [0.3, 1, 0.3]);
  const scale = useTransform(progress, [threshold - 0.1, threshold, threshold + 0.2], [0.8, 1.2, 0.8]);

  return (
    <motion.div className="group relative flex items-center" style={{ opacity }}>
      <motion.div className="w-2 h-2 rounded-full bg-zinc-400" style={{ scale }} />
      {/* ホバーでラベル表示 */}
      <span className="absolute right-4 whitespace-nowrap text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </motion.div>
  );
};
