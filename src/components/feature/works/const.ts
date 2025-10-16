export type Work = {
  title: string;
  image: string;
  description: string;
  url?: string;
};

export const WORKS = [
  {
    title: "Contrast Color palette",
    image: "/works/contrast_color_palette.png",
    description: "ダークテーマを含め、コントラスト比が高いカラーパレットを作れるようにするためのツール",
    url: "https://contrast-color-pallet.vercel.app/",
  },
  {
    title: "TsuukinPlace",
    image: "/works/tsuukin-place.png",
    description: "通勤時間や経路を最適化し、効率的な通勤プランを提案するWebアプリケーション",
    url: "https://tsuukin-place.com/",
  },
  {
    title: "Madorism",
    image: "/works/madorism.png",
    description: "間取り図さえあれば部屋の寸法や家具を置いたときのシミュレーションができるWebアプリケーション",
    url: "https://madorism.com/",
  },
  {
    title: "Kowagarasema.show",
    image: "/works/kowagarasemashow.png",
    description: "怖がらせましょう！",
    url: "https://kowagarasema.show/",
  },
  {
    title: "Digital Agency Icons",
    image: "/works/digital_agency_icons.png",
    description:
      "デジタル庁デザインシステムのアイコンを、React・Vue・Svelteで簡単に使える非公式コンポーネントライブラリ",
    url: "https://digital-agency-icons-docs.vercel.app/",
  },
] satisfies Work[];
