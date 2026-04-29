export type EducationEntry = {
  period: string;
  school: string;
  program: string;
  research: string;
  organization: string;
  projects: readonly string[];
  results: readonly string[];
  freelance: readonly string[];
};

export const education = [
  {
    period: "2022 - 2024",
    school: "長岡技術科学大学",
    program: "電気電子情報工学課程",
    research: "睡眠時脳波の構造解析",
    organization: "学園祭実行委員会 情報局 (NUTMEG)",
    projects: [
      "学園祭で使われる資金の管理アプリ",
      "サークルメンバーの育成管理アプリ",
      "駐車場空き情報のリアルタイム監視アプリ",
    ],
    results: [
      "第一回技育博に NUTMEG の代表として参加",
      "技育展 2023 企業賞",
    ],
    freelance: [
      "スタートアップ A 社 — 修理の受注 / 発注ができる LINE アプリの開発",
      "スタートアップ B 社 — 建築関係のマッチングプラットフォーム / 学会の抄録冊子の自動作成サービス / 履歴書の自動 PDF 化・管理サービス",
    ],
  },
  {
    period: "2017 - 2022",
    school: "木更津工業高等専門学校",
    program: "電子制御工学科",
    research: "光学式心拍センサの精度評価",
    organization: "プログラミング研究同好会",
    projects: [
      "文化祭での自作ゲーム展示",
      "研究室の鍵のカードキーシステム化",
      "学校の単位数計算サイト",
    ],
    results: [
      "Paiza S",
      "AtCoder 緑",
    ],
    freelance: [
      "paiza Inc. — 競技プログラミング問題集の作問",
    ],
  },
] as const;
