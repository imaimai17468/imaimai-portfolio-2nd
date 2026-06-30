# Daily Analytics & Auto-Improvement Routine

Claude.ai ルーティンによる日次アナリティクス分析、自動改善 PR 作成、自動レビュー。

## 概要

毎日 2 つのルーティンが連携して、ポートフォリオサイトを継続的に改善する。

```
9:00 JST  ルーティンA: Daily GA4 Analytics + Auto PR
  Phase 1: データ収集 (GA4 + feedback Issue)
  Phase 2: 分析・レポート → GitHub Issue (analytics-report)
  Phase 3: コード修正 → PR 作成

9:30 JST  ルーティンB: PR Review
  Phase 4: CI 確認 + コードレビュー → approve or request-changes
      ↓
オーナーが PR を確認してマージ判断
```

## ルーティン A: Daily GA4 Analytics + Auto PR

| 項目 | 値 |
|------|-----|
| スケジュール | `0 0 * * *` (毎日 0:00 UTC / 9:00 JST) |
| モード | 毎回新規セッション |
| 埋め込み知識 | AGENTS.md, .claude/rules/design.md, .claude/rules/react.md |

### Phase 1: データ収集

1. `curl -s https://imaim.ai/api/analytics` で GA4 データ取得
   - ページ別: PV, ユーザー数, 滞在時間, 直帰率, エンゲージメント率, エンゲージメント時間
   - オーディエンス別: デバイス種別, 流入元, 新規/リピーター
2. `gh issue list -l feedback --state open` でフィードバック Issue 確認

### Phase 2: 分析・レポート

GitHub Issue (`analytics-report` ラベル) にレポートを投稿。

- アナリティクス: ページ別パフォーマンス、トラフィックソース、トレンド
- フィードバック: 新着の要約、共通パターン
- 改善提案: 具体的な修正箇所（ファイルパス・行番号）、デザインシステム・React ルールに準拠

### Phase 3: 自動改善 PR 作成

- `fix/daily-improvement-YYYY-MM-DD` ブランチを作成
- 1 PR = 1 改善（複数あれば複数 PR）
- `bun run check` + `bun run typecheck` を通す
- 改善が見つからない場合は Phase 2 のレポートのみで終了

## ルーティン B: PR Review

| 項目 | 値 |
|------|-----|
| スケジュール | `30 0 * * *` (毎日 0:30 UTC / 9:30 JST) |
| モード | 毎回新規セッション |
| 埋め込み知識 | .claude/rules/design.md, .claude/rules/react.md, コーディング規約 |

レビューのみ行い、マージは行わない。マージはオーナーが判断する。

### Phase 4: コードレビュー

1. open PR を取得（daily-improvement / fix/ ブランチ）
2. CI ステータス確認
3. デザインシステム、React ルール、型安全の観点でレビュー
4. 問題なし → approve / 問題あり → request-changes（具体的な問題と修正案をコメント）

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
