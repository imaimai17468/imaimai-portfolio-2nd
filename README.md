<div align="center">
  <h1>Imaimai Portfolio</h1>
  <p><a href="https://imaimai.ai">imaimai.ai</a></p>
</div>

<div align="center">

  ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)

</div>

## 概要

imaimai17468 のポートフォリオサイト。和色 (Wairo) をベースにしたデザインシステムで構築。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui |
| Build | Bun |
| Lint / Format | OxLint + OxFmt |
| Type Check | tsgo |
| Analytics | Google Analytics 4 |

## セットアップ

```bash
git clone https://github.com/imaimai17468/imaimai-portfolio-2nd.git
cd imaimai-portfolio-2nd
bun install
```

### 環境変数

`.env.local.example` をコピーして `.env.local` を作成し、値を設定:

```bash
cp .env.local.example .env.local
```

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_GA_ID` | GA4 測定 ID |
| `GITHUB_TOKEN` | GitHub PAT (フィードバック PR 作成用) |
| `GITHUB_REPO` | 対象リポジトリ (デフォルト: `imaimai17468/imaimai-portfolio-2nd`) |
| `GOOGLE_SA_KEY` | GCP サービスアカウント JSON の base64 (日次レポート用) |
| `GA4_PROPERTY_ID` | GA4 プロパティ ID (日次レポート用) |

### 開発サーバー

```bash
bun run dev
```

## コマンド

```bash
bun run dev              # 開発サーバー
bun run build            # プロダクションビルド
bun run typecheck        # 型チェック (tsgo)
bun run check            # OxLint + OxFmt 一括チェック
bun run check:fix        # OxLint + OxFmt 一括修正
```

## プロジェクト構成

```
src/
├── app/
│   ├── page.tsx                  # トップページ
│   ├── history/                  # 経歴ページ
│   ├── projects/                 # プロジェクトページ
│   ├── skills/                   # スキルページ
│   └── api/
│       ├── analytics/            # GA4 Data API (日次レポート用)
│       └── feedback/             # フィードバック → GitHub Issue
├── components/
│   ├── feature/top/              # セクションコンポーネント
│   │   ├── hero-section/
│   │   ├── history-section/
│   │   ├── projects-section/
│   │   └── skills-section/
│   ├── shared/                   # 共有コンポーネント
│   │   ├── ai-widget/            # AI チャットウィジェット
│   │   ├── consent-banner/       # トラッキング同意バナー
│   │   └── header/               # ヘッダーナビゲーション
│   └── ui/                       # shadcn/ui プリミティブ
├── entities/                     # Zod スキーマ + 型定義
├── gateways/                     # データ取得関数
├── repositories/                 # React Query カスタムフック
└── lib/                          # ライブラリ設定
```

## アナリティクス

GA4 でユーザー行動を収集し、Claude Code Remote のルーティン (cron) が毎朝 9:00 (JST) に `/api/analytics` 経由でデータを取得、分析レポートを PR として作成します。

```
ユーザー → GA4 (収集)
                ↓
Claude Code Remote routine (毎朝 9:00 JST)
  1. /api/analytics → GA4 Data API でページ別・オーディエンス指標を取得
  2. レポート分析・要約
  3. GitHub PR を作成
```

## ライセンス

MIT

---

<div align="center">
  <p>Made with 🐸 by imaimai17468</p>
</div>
