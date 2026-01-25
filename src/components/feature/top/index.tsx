"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { ActivitiesSection } from "./activities-section";
import { HeroSection } from "./hero-section";
import { ProductsSection } from "./products-section";
import { ScrollIndicator } from "./scroll-indicator";

/**
 * Vertical Scroll Storytelling ポートフォリオ
 *
 * design-guidelines に基づく設計:
 * - シンプル: 背景アニメーション・グラスモーフィズムなし
 * - 体験型: スクロールで情報が展開されるナラティブフロー
 * - 没入感: フルスクリーンセクション、スムーズなトランジション
 *
 * UX原則:
 * - Zeigarnik Effect: 次のセクションへの期待感
 * - Goal Gradient Effect: 進捗インジケーターで完了への動機付け
 * - Serial Position Effect: 最初（プロフィール）と最後（プロダクト）を印象的に
 */
export const Top: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative bg-zinc-950">
      {/* スクロール進捗インジケーター */}
      <ScrollIndicator progress={scrollYProgress} />

      {/* Hero: プロフィールセクション */}
      <HeroSection />

      {/* Activities: 活動セクション */}
      <ActivitiesSection />

      {/* Products: プロダクトセクション */}
      <ProductsSection />
    </div>
  );
};
