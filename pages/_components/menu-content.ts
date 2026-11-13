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
  Newspaper,
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
          sections: [
            {
              heading: "記事",
              entries: [
                { label: "このカエルは何者なんだ", meta: "note 2023.12", href: "https://note.com/imaimai17468/n/nd4bd6756de01" },
              ],
            },
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
            {
              heading: "記事",
              entries: [
                { label: "高専の単位を数えるためのWebページを作る", meta: "Qiita 2021.12", href: "https://qiita.com/imaimai17468/items/0b43c9c9e1f8f16ccea3" },
                { label: "友達の研究室にArduinoで動くカードキーを設置した話", meta: "Qiita 2021.12", href: "https://qiita.com/imaimai17468/items/8d982b91f99a698a8b6c" },
                { label: "筋電センサMyoWareを使って腕とサーボモーターを連携させる", meta: "Qiita 2021.08", href: "https://qiita.com/imaimai17468/items/c85319e61eb26c40b1bb" },
                { label: "Arduinoと筋電センサMyoWareで始める筋電計測", meta: "Qiita 2020.12", href: "https://qiita.com/imaimai17468/items/3f0048cd1c80311c0921" },
                { label: "新型コロナの感染者数を表示するBOTを作る", meta: "Qiita 2020.03", href: "https://qiita.com/imaimai17468/items/88b6fedf3a0ab8a36783" },
                { label: "googletransを使ってDiscordで動く翻訳BOTを作ってみた", meta: "Qiita 2019.12", href: "https://qiita.com/imaimai17468/items/a8dea1b188c626f77da0" },
                { label: "初心者がサイコロを振るDiscord Botを作った", meta: "Qiita 2019.09", href: "https://qiita.com/imaimai17468/items/18541e8734eee403936c" },
                { label: "3年間働いたpaizaのアルバイトを退職しました", meta: "note 2023.03", href: "https://note.com/imaimai17468/n/n8dfdac9e6edc" },
                { label: "非情報系がAtCoderを始めてから１年ちょいが経ってどうなったか", meta: "note 2020.06", href: "https://note.com/imaimai17468/n/n200b90181ab0" },
              ],
            },
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
            {
              heading: "記事",
              entries: [
                { label: "学生団体(非IT)で資金管理アプリのPMをやった時の苦労話", meta: "Qiita 2023.12", href: "https://qiita.com/imaimai17468/items/518d8ab5d76f70f750ce" },
                {
                  label: "学生団体の開発チームは常に不完全でいい",
                  meta: "しずかなインターネット 2023.11",
                  href: "https://sizu.me/imaimai17468/posts/ehr6zu1ozrzd",
                },
              ],
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
            {
              heading: "スライド",
              entries: [
                { label: "フロントエンド設計の所感 １年目", meta: "Speaker Deck 2025.01", href: "https://speakerdeck.com/imaimai17468/hurontoendoshe-ji-nosuo-gan-1nian-mu" },
                { label: "Silk Weave -未来研究大会発表資料-", meta: "Speaker Deck 2024.10", href: "https://speakerdeck.com/imaimai17468/silk-weave-wei-lai-yan-jiu-da-hui-fa-biao-zi-liao" },
              ],
            },
            {
              heading: "記事",
              entries: [
                { label: "新卒1年目、意識して良かったこと集", meta: "note 2024.12", href: "https://note.com/imaimai17468/n/n595ad009b531" },
                { label: "新卒がゆめみの実情をぶっちゃける 【入社エントリ】", meta: "note 2024.08", href: "https://note.com/imaimai17468/n/n4e86315e080d" },
                { label: "入社前に昇給申請をした【ゆめみの給与自己決定制度】", meta: "note 2024.03", href: "https://note.com/imaimai17468/n/n37fd434069ae" },
                { label: "26卒が24卒になった【ゆめみ就活体験記】", meta: "note 2023.01", href: "https://note.com/imaimai17468/n/n64c9e1ad60f3" },
              ],
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
          sections: [
            {
              heading: "記事",
              entries: [
                { label: "高専の単位を数えるためのWebページを作る", meta: "Qiita 2021.12", href: "https://qiita.com/imaimai17468/items/0b43c9c9e1f8f16ccea3" },
              ],
            },
          ],
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
                { label: "いまいまいの☦️卍x学生・若手向けスーパーアルティメットアドバイスガイドx卍☦️", meta: "note 2025.08", href: "https://note.com/imaimai17468/n/n473521e12dc7" },
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
              heading: "スライド",
              entries: [
                { label: "オートメーション・バカにならないために", meta: "2026.03", href: "https://speakerdeck.com/imaimai17468/otomesiyonbakaninaranaitameni" },
                { label: "MVP先行の探索型DocDD", meta: "2025.12", href: "https://speakerdeck.com/imaimai17468/mvpxian-xing-notan-suo-xing-docdd" },
                { label: "コーディングチェックの自動化がしたい！", meta: "2025.06", href: "https://speakerdeck.com/imaimai17468/kodeingutietukunozi-dong-hua-gasitai" },
                { label: "型パズルを好きになるために、競プロを型システムだけで解いてみることにした", meta: "2025.05", href: "https://speakerdeck.com/imaimai17468/xing-pazuruwohao-kininarutameni-jing-purowoxing-sisutemudakedejie-itemirukotonisita" },
                { label: "フロントエンド設計の所感 １年目", meta: "2025.01", href: "https://speakerdeck.com/imaimai17468/hurontoendoshe-ji-nosuo-gan-1nian-mu" },
                { label: "Silk Weave -未来研究大会発表資料-", meta: "2024.10", href: "https://speakerdeck.com/imaimai17468/silk-weave-wei-lai-yan-jiu-da-hui-fa-biao-zi-liao" },
                { label: "Next.jsでクエリパラメータを楽に扱おう nuqsを紹介！", meta: "2024.09", href: "https://speakerdeck.com/imaimai17468/next-dot-jsdekueriparametawole-nixi-ou-nuqswoshao-jie" },
                { label: "TailwindCSSで学ぶ技術批判の気をつけ方", meta: "2024.09", href: "https://speakerdeck.com/imaimai17468/tailwindcssdexue-buji-shu-pi-pan-noqi-wotukefang" },
                { label: "Next.js+yjs+BlockNoteでNotionライクな最高の共同編集エディタを作ろう", meta: "2024.08", href: "https://speakerdeck.com/imaimai17468/next-dot-js-plus-yjs-plus-blocknotedenotionraikunazui-gao-nogong-tong-bian-ji-edeitawozuo-rou" },
                { label: "BlockNoteを布教するぜ", meta: "2024.08", href: "https://speakerdeck.com/imaimai17468/blocknotewobu-jiao-suruze" },
                { label: "Marp + Cursorによるスライド生成", meta: "2024.07", href: "https://speakerdeck.com/imaimai17468/marp-plus-cursorniyorusuraidosheng-cheng" },
                { label: "Next.jsにおけるLazy Loading", meta: "2024.07", href: "https://speakerdeck.com/imaimai17468/next-dot-jsniokerulazy-loading" },
              ],
            },
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
                { label: "技育博 2026 vol.1 フィードバック集", meta: "note 2026.06", href: "https://note.com/imaimai17468/n/n7b6986816c42" },
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
      { id: "zenn", label: "Zenn", icon: BookOpen, action: { kind: "link", href: "https://zenn.dev/imaimai17468" } },
      {
        id: "sizu",
        label: "しずかなインターネット",
        icon: Notebook,
        action: { kind: "link", href: "https://sizu.me/imaimai17468" },
      },
      { id: "qiita", label: "Qiita", icon: Newspaper, action: { kind: "link", href: "https://qiita.com/imaimai17468" } },
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
