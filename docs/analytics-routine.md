# Daily Analytics & Auto-Improvement Routine

Claude.ai ルーティン + GitHub Actions による日次アナリティクス分析、自動改善 PR 作成、自動レビュー。

## 概要

毎日 3 つのジョブが連携して、ポートフォリオサイトを継続的に改善する。

```
8:50 JST  GitHub Actions: GA4 データ収集
  → analytics-data ラベルの Issue にコメントとして投稿
      ↓
9:00 JST  ルーティンA: Daily GA4 Analytics + Auto PR
  Phase 1: データ収集 (analytics-data Issue + feedback Issue)
  Phase 1.5: 不要 Issue のクローズ
  Phase 2: 分析・レポート → GitHub Issue (analytics-report)
  Phase 3: コード修正 → PR 作成（複数可）

9:30 JST  ルーティンB: PR Review
  Phase 4: CI 確認 + コードレビュー → approve or request-changes
      ↓
オーナーが PR を確認してマージ判断
```

## GitHub Actions: GA4 データ収集

| 項目 | 値 |
|------|-----|
| ワークフロー | `.github/workflows/ga4-collect.yaml` |
| スケジュール | `50 23 * * *` (毎日 23:50 UTC / 8:50 JST) |
| 出力先 | `analytics-data` ラベルの Issue にコメント |

GitHub Actions が GA4 Data API から直接データを取得し、JSON を Issue コメントに投稿する。
claude.ai ルーチン環境は egress ポリシーでカスタムドメインへのアクセスがブロックされるため、GitHub Actions で事前取得する方式を採用。

## ルーティン A: Daily GA4 Analytics + Auto PR

| 項目 | 値 |
|------|-----|
| スケジュール | `0 0 * * *` (毎日 0:00 UTC / 9:00 JST) |
| モード | 毎回新規セッション |
| プロンプト | `.claude/routines/daily-analytics.json` に保存 |

### Phase 1: データ収集

1. `analytics-data` ラベルの Issue から最新の GA4 データ（JSON）を読み取る
2. `gh issue list -l feedback --state open` でフィードバック Issue 確認

### Phase 1.5: Issue 整理

クローズ対象は厳格に限定:
- 明確なプロンプトインジェクション（英語の長文で AI への指示を含むもの）
- 完全に意味不明なノイズ、送信テスト

クローズ **しない** もの:
- 一見ジョークでも文脈がある可能性のあるもの（オーナーのアイコンはカエル）
- トーン変更要望（「派手に」「明るく」等）
- 挨拶・好意的コメント
- 判断に迷うものは残す

### Phase 2: 分析・レポート

GitHub Issue (`analytics-report` ラベル) にレポートを投稿。

### Phase 3: 自動改善 PR 作成

- 改善ごとに `fix/daily-improvement-YYYY-MM-DD-N` ブランチを作成
- 1 PR = 1 改善（複数あれば複数 PR を積極的に作成）
- `bun run check` + `bun run typecheck` を通す
- デザイン判断を伴う変更も、デザインシステム準拠であれば PR を出す

## ルーティン B: PR Review

| 項目 | 値 |
|------|-----|
| スケジュール | `30 0 * * *` (毎日 0:30 UTC / 9:30 JST) |
| モード | 毎回新規セッション |

レビューのみ行い、マージは行わない。マージはオーナーが判断する。

## 必要なインフラ

### GitHub Secrets (GitHub Actions 用)

| 変数 | 説明 |
|------|------|
| `GOOGLE_SA_KEY` | GCP サービスアカウント JSON の base64 |
| `GA4_PROPERTY_ID` | GA4 プロパティ ID |

### Vercel 環境変数 (API エンドポイント用)

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_GA_ID` | GA4 測定 ID |
| `GOOGLE_SA_KEY` | GCP サービスアカウント JSON の base64 |
| `GA4_PROPERTY_ID` | GA4 プロパティ ID |
| `ANALYTICS_API_KEY` | `/api/analytics` エンドポイントの認証キー |

### GitHub ラベル

| ラベル | 用途 |
|--------|------|
| `analytics-data` | GA4 生データの Issue（GitHub Actions が投稿） |
| `analytics-report` | 分析レポートの Issue（ルーティンが投稿） |
| `feedback` | ユーザーフィードバック |

### 外部サービス設定

| サービス | 設定 |
|---------|------|
| GCP | Google Analytics Data API を有効化 |
| GCP | サービスアカウント作成 + JSON キーダウンロード |
| GA4 | サービスアカウントを「閲覧者」として追加 |
