import type { CodeExample, PropDefinition, UsageExample } from "../component-metadata";

/**
 * Hyperspeedコンポーネントのprops定義
 */
export const hyperspeedProps: PropDefinition[] = [
  {
    name: "effectOptions",
    type: "Partial<HyperspeedOptions>",
    required: false,
    description: "Hyperspeedエフェクトの設定オプション",
  },
  {
    name: "effectOptions.distortion",
    type: "string | Distortion",
    required: false,
    defaultValue: "turbulentDistortion",
    description: "適用するディストーションエフェクトのタイプ",
  },
  {
    name: "effectOptions.length",
    type: "number",
    required: false,
    defaultValue: 400,
    description: "道路の長さ",
  },
  {
    name: "effectOptions.roadWidth",
    type: "number",
    required: false,
    defaultValue: 10,
    description: "道路の幅",
  },
  {
    name: "effectOptions.fov",
    type: "number",
    required: false,
    defaultValue: 90,
    description: "カメラの視野角（Field of View）",
  },
];

/**
 * Hyperspeedコンポーネントのコード例
 */
export const hyperspeedCodeExamples: CodeExample[] = [
  {
    title: "基本的な使い方",
    description: "デフォルト設定でのシンプルな実装",
    code: `import Hyperspeed from '@/blocks/Backgrounds/Hyperspeed/Hyperspeed';

export default function MyPage() {
  return (
    <div className="relative h-screen">
      <Hyperspeed />
    </div>
  );
}`,
    language: "tsx",
  },
  {
    title: "カスタムオプション付き",
    description: "特定のエフェクトオプションでカスタマイズ",
    code: `import Hyperspeed from '@/blocks/Backgrounds/Hyperspeed/Hyperspeed';

export default function MyPage() {
  return (
    <div className="relative h-screen">
      <Hyperspeed
        effectOptions={{
          distortion: 'mountainDistortion',
          roadWidth: 15,
          fov: 100,
          colors: {
            roadColor: 0x080808,
            leftCars: [0xff0000, 0xff6600],
            rightCars: [0x00ffff, 0x0066ff],
          }
        }}
      />
    </div>
  );
}`,
    language: "tsx",
  },
  {
    title: "プリセットの使用",
    description: "事前定義されたプリセット設定を適用",
    code: `import Hyperspeed from '@/blocks/Backgrounds/Hyperspeed/Hyperspeed';
import { hyperspeedPresets } from '@/blocks/Backgrounds/Hyperspeed/HyperSpeedPresets';

export default function MyPage() {
  return (
    <div className="relative h-screen">
      <Hyperspeed effectOptions={hyperspeedPresets.two} />
    </div>
  );
}`,
    language: "tsx",
  },
];

/**
 * Hyperspeedコンポーネントの使用例
 */
export const hyperspeedUsageExamples: UsageExample[] = [
  {
    title: "フルページ背景",
    description: "ページ全体の背景エフェクトとして使用",
    code: `<div className="relative min-h-screen">
  <div className="absolute inset-0 -z-10">
    <Hyperspeed />
  </div>
  <div className="relative z-10">
    {/* コンテンツをここに配置 */}
  </div>
</div>`,
  },
  {
    title: "セクション背景",
    description: "特定のセクションの背景として使用",
    code: `<section className="relative h-[600px]">
  <div className="absolute inset-0">
    <Hyperspeed effectOptions={{ roadWidth: 12 }} />
  </div>
  <div className="relative z-10 container mx-auto">
    {/* セクションコンテンツ */}
  </div>
</section>`,
  },
];
