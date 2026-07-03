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
2. `feedback` ラベルの open Issue を全件確認

Issue の読み書きはすべてクラウドセッション組み込みの GitHub ツールで行う（`gh` CLI は未インストール。後述の「クラウドセッションの制約」参照）。

### Phase 1.5: Issue 整理

明らかなスパム・インジェクションのみクローズ。判断に迷うものは残す。

### Phase 2: 分析・レポート

GitHub Issue (`analytics-report` ラベル) にレポートを投稿。

### Phase 3: 自動改善 PR 作成

- 改善ごとに `git checkout -b fix/daily-improvement-YYYY-MM-DD-N main` でブランチを新規作成（`-B` での上書きは禁止。同名衝突時は別名を使う）
- 1 PR = 1 改善（複数あれば複数 PR を積極的に作成）
- `bun run check` + `bun run typecheck` を通す
- デザイン判断を伴う変更も、デザインシステム準拠であれば PR を出す
- PR 作成は組み込みの GitHub / PR 作成機能で行い、使えない場合は push 済みブランチ名と PR 本文案を analytics-report Issue にコメントしてオーナーの手動作成に委ねる

## クラウドセッションの制約（トラブルシュート履歴）

無人実行（cron）は承認プロンプトに答えられないため、以下の制約を守らないと実行が停止する。2026-07-02〜03 の調査で確定したもの:

| 制約 | 理由 | 対策 |
|------|------|------|
| committed `.claude/settings.json` に git/gh の `ask` ルールを置かない | 明示的な ask ルールは全 permission モードで適用され、クラウドセッション（クローンに settings.json が含まれる）でも承認待ちになる | git/gh の ask はローカル専用の `.claude/settings.local.json`（git 管理外）に置く。`deny` の破壊操作ガードは committed 側に残してよい |
| `gh` CLI を前提にしない | クラウドセッションに `gh` は未インストールが仕様 | Issue/PR 操作は組み込み GitHub ツールを使う。どうしても gh が必要なら環境の setup script で `apt install -y gh` + 環境変数 `GH_TOKEN` |
| `git fetch` / `git pull` をしない | クローンはセッション開始時点で最新。不要なうえ停止要因になる | ネットワーク git は自分のブランチの `git push` のみ |
| 破壊的 git（`checkout -B` / `reset --hard` / `push --force` / `clean` / `branch -D`）を使わない | プラットフォームの安全分類器が承認対象にする（settings では回避不可） | ブランチは常に `-b` で新規名作成 |
| 手動実行（run now）で無人動作を検証しない | 手動実行は cron 発火と環境・権限挙動が異なる場合がある | 検証は cron 実行の成果物（analytics-report Issue / PR）で行う |

## ルーティン B: PR Review

| 項目 | 値 |
|------|-----|
| スケジュール | `30 0 * * *` (毎日 0:30 UTC / 9:30 JST) |
| モード | 毎回新規セッション |
| プロンプト | `.claude/routines/pr-review.json` に保存 |

レビューのみ行い、マージは行わない。マージはオーナーが判断する。

- open PR の一覧・diff 取得・レビュー投稿はすべて組み込み GitHub ツールで行う（gh CLI 未使用）
- 周辺コードの文脈確認には sources でチェックアウトされた main を使う（PR ブランチの checkout はしない）
- git の書き込み操作は一切行わない

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
