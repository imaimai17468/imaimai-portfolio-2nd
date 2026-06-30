# Daily Analytics & Auto-Improvement Routine

Claude.ai ルーティンによる日次アナリティクス分析と自動改善 PR 作成。

## 概要

毎日 0:00 UTC (日本時間 9:00) に Claude.ai が GA4 データとフィードバック Issue を分析し、改善 PR を自動作成する。

```
Phase 1: データ収集
  GA4 → /api/analytics → データ取得
  GitHub Issues (feedback ラベル) → フィードバック収集

Phase 2: 分析・レポート
  データ分析 → GitHub Issue に投稿 (analytics-report ラベル)

Phase 3: 自動改善
  改善箇所を特定 → コード修正 → PR 作成
```

## ルーティン設定

| 項目 | 値 |
|------|-----|
| スケジュール | `0 0 * * *` (毎日 0:00 UTC) |
| モード | 毎回新規セッション (create_new_session_on_fire) |
| 環境 | Default |

## Phase 1: データ収集

1. `curl -s https://imaim.ai/api/analytics` で GA4 Data API 経由の昨日データ取得
2. `gh issue list -l feedback --state open` でフィードバック Issue 確認
3. 各 Issue の内容を `gh issue view` で取得

## Phase 2: 分析・レポート

GitHub Issue (`analytics-report` ラベル) にレポートを投稿。

### レポート構成

**アナリティクス:**
- 総ページビュー数・ユニークユーザー数
- ページ別アクセスランキング
- トラフィックソース、平均セッション時間
- 注目すべきトレンド

**フィードバック:**
- 新着フィードバックの要約
- 共通する要望やパターン

**改善提案:**
- 具体的な修正箇所（ファイルパス・行番号）を含む改善案
- デザインシステム・React ルールに準拠

## Phase 3: 自動改善 PR 作成

分析に基づいてコードを修正し PR を作成する。

### 手順
1. リポジトリをクローン + `bun install`
2. `fix/daily-improvement-YYYY-MM-DD` ブランチを作成
3. 改善を実装（1 PR = 1 改善、複数あれば複数 PR）
4. `bun run check` + `bun run typecheck` を通す
5. コミット + PR 作成（analytics-report / feedback Issue へのリンクを含む）

### 制約
- 改善が見つからない場合は Phase 2 のレポートのみで終了
- 大規模な変更は避け、小さく安全な改善を優先
- デザインシステムに違反する変更は行わない
- AI デザインクリシェに該当する変更は行わない

## 埋め込み知識

ルーティンは毎回フリーセッションで起動するため、プロンプトに以下の知識を埋め込んでいる。

### AGENTS.md
- Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- 拡張性を常に意識した設計（enum > boolean、interface at boundaries、additive changes）
- 型安全を厳守（as/any/@ts-ignore/non-null ! 禁止）
- コミットは1コミット1目的、prefix: feat/fix/refactor/test/docs/chore

### デザインシステム (.claude/rules/design.md)
- 和色 (Wairo) ベース。純粋な無彩色グレーは使わない
- 角丸は corner-shape: squircle
- セマンティックカラートークン使用（raw 値禁止）
- primary は背景塗りに使わない。destructive は削除・エラーのみ
- 影は drag 状態と sticky header スクロール時のみ
- インタラクティブ要素は5状態必須: default, hover, focus-visible, active, disabled
- タッチターゲット 44px 以上
- コンテンツ状態: loading, empty, error, populated を全て定義
- WCAG AA コントラスト準拠
- AI デザインクリシェ禁止
- アニメーションは transform/opacity のみ

### React ルール (.claude/rules/react.md)
- レンダーは純粋計算（冪等、副作用なし、非ローカル値の変更なし）
- useEffect は外部システムとの同期専用
- コンポーネント分割は再レンダー境界として機能させる
- コロケーション優先
- パススルーレイヤー禁止

## 必要なインフラ

### Vercel 環境変数

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_GA_ID` | GA4 測定 ID |
| `GOOGLE_SA_KEY` | GCP サービスアカウント JSON の base64 |
| `GA4_PROPERTY_ID` | GA4 プロパティ ID |
| `GITHUB_TOKEN` | GitHub PAT (Issues read/write スコープ) |

### 外部サービス設定

| サービス | 設定 |
|---------|------|
| GCP | Google Analytics Data API を有効化 |
| GCP | サービスアカウント作成 + JSON キーダウンロード |
| GA4 | サービスアカウントを「閲覧者」として追加 |
| GitHub | `analytics-report` ラベルを作成 |
| GitHub | `feedback` ラベルを作成 |

## ルーティンの再作成

環境が変わった場合、Claude Code で以下の手順で再作成:

1. `create_trigger` で新規トリガーを作成
2. cron: `0 0 * * *`
3. `create_new_session_on_fire: true`
4. プロンプトに上記の知識とタスクを含める
5. 環境変数が全て設定されていることを確認
