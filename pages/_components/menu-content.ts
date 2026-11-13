import {
  AtSign,
  BookOpen,
  Briefcase,
  Building,
  Calculator,
  Code,
  Component,
  Feather,
  Gavel,
  GraduationCap,
  HandHeart,
  Heart,
  Layers,
  Link,
  Mail,
  Map,
  Mic,
  Notebook,
  Package,
  Palette,
  PenLine,
  Presentation,
  Quote,
  School,
  Shapes,
  Sparkles,
  TrainFront,
  UserRound,
  Volume2,
  VolumeOff,
  type LucideIcon,
} from "lucide-react";

export type SubAction =
  | { readonly kind: "detail"; readonly paragraphs: readonly string[]; readonly href?: string }
  | { readonly kind: "link"; readonly href: string }
  | { readonly kind: "sound"; readonly isOn: boolean };

export interface SubItem {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly action: SubAction;
}

export interface MainItem {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly subs: readonly SubItem[];
}

const PLACEHOLDER = "ここに中身を書きます。";

export const MENU: readonly MainItem[] = [
  {
    id: "sound",
    label: "サウンド",
    icon: Volume2,
    subs: [
      { id: "on", label: "オン", icon: Volume2, action: { kind: "sound", isOn: true } },
      { id: "off", label: "オフ", icon: VolumeOff, action: { kind: "sound", isOn: false } },
    ],
  },
  {
    id: "profile",
    label: "プロフィール",
    icon: UserRound,
    subs: [
      {
        id: "intro",
        label: "自己紹介",
        icon: UserRound,
        action: {
          kind: "detail",
          paragraphs: [
            "千葉の田舎でぬくぬくしているエンジニアです。",
            "ものづくりが好きで、C言語に始まり、競技プログラミング、ゲーム（Unity）、ビジュアル表現（Processing）、IoT、AI、そしてWebなど興味本位で多くのものに手を出しています。",
          ],
        },
      },
      {
        id: "motto",
        label: "筆先の黒は乾かすな",
        icon: Quote,
        action: {
          kind: "detail",
          paragraphs: [
            "自身が達成したい表現を求め続け、手を止めるなという気持ちを込めています。",
            "どんな時代であれ、アルチザンであり、クラフツマンシップを持ち続けます。",
          ],
        },
      },
      {
        id: "likes",
        label: "好きなこと",
        icon: Heart,
        action: {
          kind: "detail",
          paragraphs: ["今はフロントエンドとハードウェアに熱が入っています。", PLACEHOLDER],
        },
      },
    ],
  },
  {
    id: "career",
    label: "経歴",
    icon: Briefcase,
    subs: [
      { id: "kosen", label: "木更津高専", icon: School, action: { kind: "detail", paragraphs: [PLACEHOLDER] } },
      {
        id: "nagaoka",
        label: "長岡技術科学大学",
        icon: GraduationCap,
        action: { kind: "detail", paragraphs: [PLACEHOLDER] },
      },
      {
        id: "yumemi",
        label: "ゆめみ",
        icon: Building,
        action: { kind: "detail", paragraphs: ["2024年に株式会社ゆめみに入社。", PLACEHOLDER] },
      },
      {
        id: "accenture",
        label: "アクセンチュア",
        icon: Briefcase,
        action: {
          kind: "detail",
          paragraphs: ["買収によりアクセンチュアでエンジニアとして働きながら、採用活動、DevEx改善に取り組んでいます。"],
        },
      },
    ],
  },
  {
    id: "products",
    label: "プロダクト",
    icon: Package,
    subs: [
      {
        id: "hypersig",
        label: "hypersig",
        icon: Layers,
        action: {
          kind: "detail",
          paragraphs: ["ページもブラウザの動きもサーバーも Rust で書き、シグナル名や URL の誤りをコンパイルエラーにする Web フレームワーク。"],
          href: "https://imaimai17468.github.io/hypersig/",
        },
      },
      {
        id: "template",
        label: "テンプレート",
        icon: Code,
        action: {
          kind: "detail",
          paragraphs: ["TanStack Start + Tailwind CSS + shadcn/ui を Cloudflare Workers で動かすフロントエンド開発テンプレート。"],
          href: "https://github.com/imaimai17468/imaimai-front-templete",
        },
      },
      {
        id: "osampo",
        label: "Osampo",
        icon: Map,
        action: {
          kind: "detail",
          paragraphs: ["標高グラデーションマップでお散歩ルートを探索・記録できるアプリ。"],
          href: "https://osampo.vercel.app",
        },
      },
      {
        id: "tsuukin",
        label: "ツウキンプレイス",
        icon: TrainFront,
        action: {
          kind: "detail",
          paragraphs: ["通勤時間から駅の家賃相場を調べられるサービス。"],
          href: "https://tsuukin-place.com",
        },
      },
      {
        id: "palette",
        label: "カラーパレット",
        icon: Palette,
        action: {
          kind: "detail",
          paragraphs: ["コントラスト比を考慮したカラーパレット生成ツール。"],
          href: "https://contrast-color-palette.vercel.app",
        },
      },
      {
        id: "da-icons",
        label: "デジタル庁アイコン",
        icon: Shapes,
        action: {
          kind: "detail",
          paragraphs: ["デジタル庁アイコンを React・Vue・Svelte で使える非公式コンポーネントライブラリ。"],
          href: "https://digital-agency-icons-docs.vercel.app",
        },
      },
      {
        id: "imaimai-ui",
        label: "imaimai UI",
        icon: Component,
        action: {
          kind: "detail",
          paragraphs: ["他のライブラリには無い、実装が面倒なコンポーネント集。"],
          href: "https://imaimai-ui.vercel.app",
        },
      },
      {
        id: "credits",
        label: "単位カウンター",
        icon: Calculator,
        action: {
          kind: "detail",
          paragraphs: ["木更津高専の卒業に必要な単位数を自動計算するツール。"],
          href: "https://credits-counter-fo-knct.vercel.app",
        },
      },
    ],
  },
  {
    id: "activities",
    label: "活動",
    icon: Mic,
    subs: [
      {
        id: "geekten",
        label: "技育祭",
        icon: Presentation,
        action: {
          kind: "detail",
          paragraphs: ["サポーターズ主催の技育祭でスポンサー登壇を務めています。", "2026 春・東海・九州・関西・秋"],
        },
      },
      { id: "tskaigi", label: "TSKaigi 2025", icon: Mic, action: { kind: "detail", paragraphs: [PLACEHOLDER] } },
      {
        id: "fec-hokkaido",
        label: "フロントエンドカンファレンス北海道",
        icon: Mic,
        action: { kind: "detail", paragraphs: ["2024 年に登壇。", PLACEHOLDER] },
      },
      {
        id: "geekhaku",
        label: "技育博 審査員",
        icon: Gavel,
        action: {
          kind: "detail",
          paragraphs: ["学生の制作物に対して審査とフィードバックを行っています。", "2025 Vol.1・Vol.2・Vol.6、2026 Vol.1"],
        },
      },
      {
        id: "gemini",
        label: "Gemini 3 ハッカソン",
        icon: Sparkles,
        action: { kind: "detail", paragraphs: ["東京大会の予選審査を務めました。"] },
      },
    ],
  },
  {
    id: "articles",
    label: "記事",
    icon: PenLine,
    subs: [
      { id: "zenn", label: "Zenn", icon: BookOpen, action: { kind: "link", href: "https://zenn.dev/imaimai17468" } },
      { id: "sizu", label: "sizu", icon: Notebook, action: { kind: "detail", paragraphs: [PLACEHOLDER] } },
    ],
  },
  {
    id: "links",
    label: "リンク",
    icon: Link,
    subs: [
      { id: "github", label: "GitHub", icon: Code, action: { kind: "link", href: "https://github.com/imaimai17468" } },
      { id: "x", label: "X", icon: AtSign, action: { kind: "link", href: "https://x.com/imaimai17468" } },
      {
        id: "sponsors",
        label: "Sponsors",
        icon: HandHeart,
        action: { kind: "link", href: "https://github.com/sponsors/imaimai17468" },
      },
      { id: "mail", label: "メール", icon: Mail, action: { kind: "link", href: "mailto:contact@imaim.ai" } },
      { id: "blog", label: "このサイト", icon: Feather, action: { kind: "link", href: "https://imaim.ai" } },
    ],
  },
];
