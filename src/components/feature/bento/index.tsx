import { BentoLayout } from "./layout";
import { LinkCard } from "./link-card";
import { ProfileCard } from "./profile-card";

type LinkItem = {
  title: string;
  url: string;
  description?: string;
};

/**
 * リンクデータの定義
 */
const LINKS: LinkItem[] = [
  {
    title: "しずかなインターネット",
    url: "https://sizu.me/imaimai17468",
    description: "静かで心地よいインターネット空間での活動",
  },
  {
    title: "いまいまいさんの記事一覧",
    url: "https://zenn.dev/imaimai17468",
    description: "技術記事やナレッジの共有",
  },
  {
    title: "imaimai17468's Portfolio 2nd",
    url: "https://imaimai.tech",
    description: "ポートフォリオサイト",
  },
  {
    title: "LAPRAS Profile",
    url: "https://lapras.com/public/imaimai17468",
    description: "エンジニアとしてのキャリアプロフィール",
  },
  {
    title: "ツウキンプレイス",
    url: "https://tsuukin-place.com",
    description: "通勤時間から駅の家賃相場を調べるサービス",
  },
  {
    title: "Contrast Color Palette",
    url: "https://contrast-color-palette.vercel.app",
    description: "アクセシブルな色の組み合わせを提案",
  },
  {
    title: "Digital Agency Icons",
    url: "https://digital-agency-icons-docs.vercel.app",
    description: "非公式アイコンライブラリ",
  },
  {
    title: "imaimai UI",
    url: "https://imaimai-ui.vercel.app",
    description: "オリジナルUIコンポーネント集",
  },
];

/**
 * Bentoページのメインコンポーネント
 * bento.meスタイルのリンク集を表示
 */
export const Bento: React.FC = () => {
  return (
    <BentoLayout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* プロフィールカード - モバイルでは通常サイズ、md以上で2行分の高さ */}
          <div className="md:row-span-2">
            <ProfileCard />
          </div>

          {/* リンクカード */}
          {LINKS.map((link) => (
            <LinkCard key={link.url} title={link.title} url={link.url} description={link.description} />
          ))}
        </div>
      </div>
    </BentoLayout>
  );
};
