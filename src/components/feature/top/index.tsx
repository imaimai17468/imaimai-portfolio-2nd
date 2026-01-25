import { ActivitiesSection } from "./activities-section";
import { HeroSection } from "./hero-section";
import { ProductsSection } from "./products-section";

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
 * - Serial Position Effect: 最初（プロフィール）と最後（プロダクト）を印象的に
 */
export const Top: React.FC = () => {
  return (
    <div className="relative bg-zinc-950">
      {/* Hero: プロフィールセクション */}
      <HeroSection />

      {/* Activities: 活動セクション */}
      <ActivitiesSection />

      {/* Products: プロダクトセクション */}
      <ProductsSection />
    </div>
  );
};
