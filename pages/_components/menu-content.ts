import {
  AtSign,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calculator,
  Code,
  Component,
  FileText,
  Gavel,
  GraduationCap,
  HandHeart,
  Heart,
  IdCard,
  Layers,
  Link,
  Mail,
  Map,
  Megaphone,
  Mic,
  Notebook,
  Package,
  Palette,
  PenLine,
  Presentation,
  Quote,
  School,
  Shapes,
  TrainFront,
  UserRound,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export interface DetailEntry {
  readonly label: string;
  readonly meta?: string;
  readonly href?: string;
}

export interface DetailSection {
  readonly heading: string;
  readonly entries: readonly DetailEntry[];
}

export type SubAction =
  | {
      readonly kind: "detail";
      readonly paragraphs: readonly string[];
      readonly sections?: readonly DetailSection[];
      readonly href?: string;
    }
  | { readonly kind: "link"; readonly href: string }
  | { readonly kind: "soundSwitch" };

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

function entries(labels: readonly string[]): readonly DetailEntry[] {
  return labels.map((label) => ({ label }));
}

export const MENU: readonly MainItem[] = [
  {
    id: "sound",
    label: "サウンド",
    icon: Volume2,
    subs: [{ id: "switch", label: "サウンド", icon: Volume2, action: { kind: "soundSwitch" } }],
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
            "千葉の田舎でぬくぬくしているエンジニアです。木更津高専、長岡技術科学大学を経て、2024年株式会社ゆめみに入社し、現在は買収によりアクセンチュアでエンジニアとして働きながら、採用活動、DevEx改善に取り組んでいます。",
            "ものづくりが好きで、C言語に始まり、競技プログラミング、ゲーム（Unity）、ビジュアル表現（Processing）、IoT、AI、そしてWebなど興味本位で多くのものに手を出しています。",
            "人材育成・組織運営に興味があり、サポーターズ主催の技育祭ではスポンサー登壇を務めています。また、複数のハッカソンで審査員を務め、学生の制作物に対してフィードバックを行う活動も行なっています。",
            "開発物では、Rust製Webフレームワーク、個人開発向けテンプレートをはじめ、個人で困った時に作ったサービスがぽこぽこあります。",
          ],
        },
      },
      {
        id: "role",
        label: "肩書き",
        icon: IdCard,
        action: {
          kind: "detail",
          paragraphs: [
            "Front-end Developer / Product Engineer",
            "2001 年生まれ。木更津高専・長岡技科大卒。Front-end / Product Engineer として大規模サイトリニューアルや新規サービス立ち上げに従事しつつ、採用と技術教育プロジェクトのマネジメントも担当。",
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
            "\"わかってんじゃん、アンタ\"って思ってもらえる人に、私はここにいるって伝えなくちゃいけないんだ。",
          ],
        },
      },
      {
        id: "likes",
        label: "好きなこと",
        icon: Heart,
        action: {
          kind: "detail",
          paragraphs: ["ものづくりが好きです。今はフロントエンドとハードウェアに熱が入っています。"],
          sections: [
            { heading: "スキル", entries: entries(["フロントエンド開発", "UI/UX デザイン", "React / Next.js", "TypeScript"]) },
          ],
        },
      },
      {
        id: "support",
        label: "応援",
        icon: HandHeart,
        action: {
          kind: "detail",
          paragraphs: [
            "hypersig や個人開発のサービスを気に入っていただけたら、GitHub Sponsors から応援してもらえると嬉しいです。",
          ],
          href: "https://github.com/sponsors/imaimai17468",
        },
      },
    ],
  },
  {
    id: "career",
    label: "経歴",
    icon: Briefcase,
    subs: [
      {
        id: "kosen",
        label: "木更津高専",
        icon: School,
        action: {
          kind: "detail",
          paragraphs: ["2017.04 - 2022.03", "木更津工業高等専門学校 電子制御工学科。研究は光学式心拍センサの精度評価。プログラミング研究同好会に所属。"],
          sections: [
            { heading: "つくったもの", entries: entries(["文化祭での自作ゲーム展示", "研究室の鍵のカードキーシステム化", "学校の単位数計算サイト"]) },
            { heading: "成果", entries: entries(["Paiza S", "AtCoder 緑"]) },
            { heading: "業務委託", entries: entries(["paiza Inc. — 競技プログラミング問題集の作問"]) },
          ],
        },
      },
      {
        id: "nagaoka",
        label: "長岡技術科学大学",
        icon: GraduationCap,
        action: {
          kind: "detail",
          paragraphs: ["2022.04 - 2024.03", "長岡技術科学大学 電気電子情報工学課程。研究は睡眠時脳波の構造解析。学園祭実行委員会 情報局（NUTMEG）に所属。"],
          sections: [
            {
              heading: "つくったもの",
              entries: entries([
                "学園祭で使われる資金の管理アプリ",
                "サークルメンバーの育成管理アプリ",
                "駐車場空き情報のリアルタイム監視アプリ",
              ]),
            },
            { heading: "成果", entries: entries(["第一回技育博に NUTMEG の代表として参加", "技育展 2023 企業賞"]) },
            {
              heading: "業務委託",
              entries: entries([
                "スタートアップ A 社 — 修理の受注 / 発注ができる LINE アプリの開発",
                "スタートアップ B 社 — 建築関係のマッチングプラットフォーム / 学会の抄録冊子の自動作成サービス / 履歴書の自動 PDF 化・管理サービス",
              ]),
            },
          ],
        },
      },
      {
        id: "yumemi",
        label: "ゆめみ",
        icon: Building,
        action: {
          kind: "detail",
          paragraphs: ["2024.04 - 2024.12", "Product Engineer / Recruiter / 技育プロジェクト担当"],
          sections: [
            {
              heading: "担当したこと",
              entries: entries([
                "大規模マンガプラットフォームのリニューアル",
                "HR サービスのコーポレートサイト刷新",
                "求人サービスの管理画面開発",
                "海外向け航空券予約システム開発",
              ]),
            },
          ],
        },
      },
      {
        id: "accenture",
        label: "アクセンチュア",
        icon: Briefcase,
        action: {
          kind: "detail",
          paragraphs: [
            "2024.12 - 現在",
            "Product Engineer / Recruiter / 技育プロジェクト担当。買収によりアクセンチュアでエンジニアとして働きながら、採用活動、DevEx改善に取り組んでいます。",
          ],
          sections: [
            { heading: "担当したこと", entries: entries(["MultiAgent SaaS の開発と提案", "バイクのマイページ系サービス開発"]) },
          ],
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
          sections: [
            {
              heading: "記事",
              entries: [
                {
                  label: "Rust だけで画面もブラウザの動きも書くWebフレームワーク「hypersig」を作った",
                  meta: "Zenn 2026.10",
                  href: "https://zenn.dev/imaimai17468/articles/4ef759d08862ae",
                },
              ],
            },
          ],
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
          sections: [
            {
              heading: "記事",
              entries: [
                {
                  label: "OKLCHで高コントラストなカラーパレットを生成するサイトを作った【ダークテーマ対応】",
                  meta: "Zenn 2024.10",
                  href: "https://zenn.dev/yumemi_inc/articles/4f530d30ef395b",
                },
              ],
            },
          ],
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
        id: "recruiting-talks",
        label: "採用登壇",
        icon: Megaphone,
        action: {
          kind: "detail",
          paragraphs: ["サポーターズ主催の技育祭で、スポンサー登壇を務めています。"],
          sections: [
            {
              heading: "2026",
              entries: entries(["技育祭 2026 春", "技育祭 2026 東海", "技育祭 2026 九州", "技育祭 2026 関西", "技育祭 2026 秋"]),
            },
            {
              heading: "記事",
              entries: [
                {
                  label: "社長の代わりに代表登壇した技育祭2026まとめ",
                  meta: "しずかなインターネット 2026.10",
                  href: "https://sizu.me/imaimai17468/posts/xkcvwurhscnu",
                },
              ],
            },
          ],
        },
      },
      {
        id: "tech-talks",
        label: "技術登壇",
        icon: Presentation,
        action: {
          kind: "detail",
          paragraphs: ["技術カンファレンスでの登壇。"],
          sections: [
            { heading: "2025", entries: entries(["TSKaigi 2025"]) },
            { heading: "2024", entries: entries(["フロントエンドカンファレンス北海道 2024"]) },
            {
              heading: "記事",
              entries: [
                {
                  label: "MarpのHTMLをコネコネして、biim式RTA画面で登壇した",
                  meta: "Zenn 2026.07",
                  href: "https://zenn.dev/imaimai17468/articles/d045e19b191102",
                },
                {
                  label: "TS Kaigiの配信likeなスライド画面共有用サイトを作った",
                  meta: "Zenn 2024.09",
                  href: "https://zenn.dev/yumemi_inc/articles/ecdac199cf8380",
                },
              ],
            },
          ],
          href: "https://speakerdeck.com/imaimai17468",
        },
      },
      {
        id: "judge",
        label: "審査員",
        icon: Gavel,
        action: {
          kind: "detail",
          paragraphs: ["複数のハッカソンで審査員を務め、学生の制作物に対してフィードバックを行っています。"],
          sections: [
            { heading: "2026", entries: entries(["技育博 2025 Vol.6", "Gemini 3 ハッカソン 東京（予選審査）", "技育博 2026 Vol.1"]) },
            { heading: "2025", entries: entries(["技育博 2025 Vol.1", "技育博 2025 Vol.2"]) },
            {
              heading: "記事",
              entries: [
                {
                  label: "技術力に優劣はない（技育などに参加している学生に向けて）",
                  meta: "しずかなインターネット 2025.10",
                  href: "https://sizu.me/imaimai17468/posts/th1ffhnz89sh",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "articles",
    label: "記事",
    icon: PenLine,
    subs: [
      {
        id: "zenn",
        label: "Zenn",
        icon: BookOpen,
        action: {
          kind: "detail",
          paragraphs: ["技術記事と知見の共有。"],
          sections: [
            {
              heading: "新しい順",
              entries: [
                { label: "Rust だけで画面もブラウザの動きも書くWebフレームワーク「hypersig」を作った", meta: "2026.10", href: "https://zenn.dev/imaimai17468/articles/4ef759d08862ae" },
                { label: "良いAIの行動、メモ", meta: "2026.09", href: "https://zenn.dev/imaimai17468/articles/4fe1531b71929b" },
                { label: "MarpのHTMLをコネコネして、biim式RTA画面で登壇した", meta: "2026.07", href: "https://zenn.dev/imaimai17468/articles/d045e19b191102" },
                {
                  label: "別モデルによるクロスレビューは有効なのか？同一モデルの継続セッション・別セッションと比較する（React習熟度スコア基準）",
                  meta: "2026.06",
                  href: "https://zenn.dev/imaimai17468/articles/c5440b98a6e766",
                },
                { label: "新しいデザインシステム・コンポーネント管理のかたち「shadcn/ui registry」", meta: "2025.12", href: "https://zenn.dev/imaimai17468/articles/774e42f5613b15" },
                { label: "もっと気軽にDocDD(SpecDD)でAI駆動開発したい", meta: "2025.11", href: "https://zenn.dev/imaimai17468/articles/5df32a0bcfc75a" },
                { label: "OKLCHで高コントラストなカラーパレットを生成するサイトを作った【ダークテーマ対応】", meta: "2024.10", href: "https://zenn.dev/yumemi_inc/articles/4f530d30ef395b" },
                { label: "TS Kaigiの配信likeなスライド画面共有用サイトを作った", meta: "2024.09", href: "https://zenn.dev/yumemi_inc/articles/ecdac199cf8380" },
                { label: "Next.js + shadcn/ui + TanStackTableでモダンなテーブルを作ろう", meta: "2024.01", href: "https://zenn.dev/imaimai17468/articles/10763ce1dd3bc4" },
                { label: "簡単Flexboxコンポーネントでコードを綺麗にしよう", meta: "2023.12", href: "https://zenn.dev/imaimai17468/articles/7d3e91cbaae0a6" },
                { label: "Next.js+yjs+BlockNoteでGoogle Docs+Notionのような共同編集エディタを作ろう", meta: "2023.10", href: "https://zenn.dev/imaimai17468/articles/af22e695ed24a8" },
                { label: "Next.js+WebSpeechAPIで超簡単音声認識をしてみよう", meta: "2023.09", href: "https://zenn.dev/imaimai17468/articles/a3e29a59765ab6" },
              ],
            },
          ],
          href: "https://zenn.dev/imaimai17468",
        },
      },
      {
        id: "sizu",
        label: "しずかなインターネット",
        icon: Notebook,
        action: {
          kind: "detail",
          paragraphs: ["落ち着いた発信のための場。"],
          sections: [
            {
              heading: "新しい順",
              entries: [
                { label: "社長の代わりに代表登壇した技育祭2026まとめ", meta: "2026.10", href: "https://sizu.me/imaimai17468/posts/xkcvwurhscnu" },
                { label: "半年で20kg痩せた（頑張らずに、トラップは避ける）", meta: "2026.09", href: "https://sizu.me/imaimai17468/posts/7c58d71rk2w6" },
                { label: "仕事はやりたくないし、らくしたいもの", meta: "2026.05", href: "https://sizu.me/imaimai17468/posts/wvk69whu0c1f" },
                { label: "もう新卒って言いづらいね（３年目）", meta: "2026.04", href: "https://sizu.me/imaimai17468/posts/z5avi4c813m8" },
                { label: "2025年振り返りと来年のこと", meta: "2025.12", href: "https://sizu.me/imaimai17468/posts/dr14aaisx4eb" },
                { label: "モチベという言葉を使うのをやめようの会 2025", meta: "2025.11", href: "https://sizu.me/imaimai17468/posts/8d3b7uoiisz4" },
                { label: "フロントエンド エッセンス集", meta: "2025.11", href: "https://sizu.me/imaimai17468/posts/mn48hb4kfrr3" },
                { label: "ゆめみが消えるのでこれまでのキャリアと金の変遷を書く", meta: "2025.10", href: "https://sizu.me/imaimai17468/posts/tmbfa621u8fs" },
                { label: "技術力に優劣はない（技育などに参加している学生に向けて）", meta: "2025.10", href: "https://sizu.me/imaimai17468/posts/th1ffhnz89sh" },
                { label: "自分を弱いと思うとき / 適者生存 / 先輩を舐めろ", meta: "2024.12", href: "https://sizu.me/imaimai17468/posts/zxa393668fku" },
                { label: "学生団体の開発チームは常に不完全でいい", meta: "2023.11", href: "https://sizu.me/imaimai17468/posts/ehr6zu1ozrzd" },
              ],
            },
          ],
          href: "https://sizu.me/imaimai17468",
        },
      },
      { id: "note", label: "note", icon: FileText, action: { kind: "link", href: "https://note.com/imaimai17468" } },
    ],
  },
  {
    id: "links",
    label: "リンク",
    icon: Link,
    subs: [
      { id: "github", label: "GitHub", icon: Code, action: { kind: "link", href: "https://github.com/imaimai17468" } },
      { id: "x", label: "X", icon: AtSign, action: { kind: "link", href: "https://x.com/imaimai17468" } },
      { id: "speakerdeck", label: "Speaker Deck", icon: Presentation, action: { kind: "link", href: "https://speakerdeck.com/imaimai17468" } },
      { id: "lapras", label: "LAPRAS", icon: Award, action: { kind: "link", href: "https://lapras.com/public/imaimai17468" } },
      { id: "sponsors", label: "Sponsors", icon: HandHeart, action: { kind: "link", href: "https://github.com/sponsors/imaimai17468" } },
      { id: "mail", label: "メール", icon: Mail, action: { kind: "link", href: "mailto:contact@imaim.ai" } },
    ],
  },
];
