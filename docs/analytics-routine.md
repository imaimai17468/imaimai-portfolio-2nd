# Daily Analytics & Auto-Improvement Routine

Claude.ai ルーティンによる日次アナリティクス分析、自動改善 PR 作成、自動レビュー・マージ。

## 概要

毎日 2 つのルーティンが連携して、ポートフォリオサイトを継続的に改善する。

```
9:00 JST  ルーティンA: Daily GA4 Analytics + Auto PR
  Phase 1: データ収集 (GA4 + feedback Issue)
  Phase 2: 分析・レポート → GitHub Issue (analytics-report)
  Phase 3: コード修正 → PR 作成

9:30 JST  ルーティンB: PR Review + Auto Merge
  CI 確認 → コードレビュー → 判定
    ├── 問題なし → マージ
    ├── 軽微な問題 → 自動修正(1回) → 再レビュー → マージ or エスカレーション
    └── 重大な問題 → @imaimai17468 にエスカレーション
```

## ルーティン A: Daily GA4 Analytics + Auto PR

| 項目 | 値 |
|------|-----|
| スケジュール | `0 0 * * *` (毎日 0:00 UTC / 9:00 JST) |
| モード | 毎回新規セッション |

### Phase 1: データ収集

1. `curl -s https://imaim.ai/api/analytics` で GA4 データ取得
   - ページ別: PV, ユーザー数, 滞在時間, 直帰率, エンゲージメント率, エンゲージメント時間
   - オーディエンス別: デバイス種別, 流入元, 新規/リピーター
2. `gh issue list -l feedback --state open` でフィードバック Issue 確認

### Phase 2: 分析・レポート

GitHub Issue (`analytics-report` ラベル) にレポートを投稿。

- アナリティクス: ページ別パフォーマンス、トラフィックソース、トレンド
- フィードバック: 新着の要約、共通パターン
- 改善提案: 具体的な修正箇所（ファイルパス・行番号）

### Phase 3: 自動改善 PR 作成

- `fix/daily-improvement-YYYY-MM-DD` ブランチを作成
- 1 PR = 1 改善（複数あれば複数 PR）
- `bun run check` + `bun run typecheck` を通す
- 改善が見つからない場合は Phase 2 のレポートのみで終了

## ルーティン B: PR Review + Auto Merge

| 項目 | 値 |
|------|-----|
| スケジュール | `30 0 * * *` (毎日 0:30 UTC / 9:30 JST) |
| モード | 毎回新規セッション |

### レビューフロー

1. open PR を取得（daily-improvement / fix/ ブランチ）
2. CI ステータス確認
3. コードレビュー（デザインシステム、React ルール、型安全）

### 判定とアクション

| 判定 | アクション |
|------|----------|
| 問題なし | approve → squash merge → ブランチ削除 |
| 軽微な問題 | 自動修正（1回のみ）→ 再レビュー → 通過ならマージ |
| 重大な問題 | PR open のまま @imaimai17468 にメンションで報告 |
| 修正2回目でも問題あり | PR open のまま @imaimai17468 にメンションで報告 |
| セキュリティ制約違反 | PR open のまま @imaimai17468 にメンションで報告 |

### セキュリティ制約

| 制約 | 内容 |
|------|------|
| 変更可能ファイル | `src/components/`, `src/app/globals.css` のみ |
| 変更禁止ファイル | `route.ts`, `layout.tsx`, 設定ファイル, `package.json`, `.env*` |
| diff 上限 | 100 行を超える PR はマージしない |
| 修正回数 | 最大 1 回。2 回目の問題発見でエスカレーション |

## 埋め込み知識

両ルーティンは毎回フリーセッションで起動するため、プロンプトに以下の知識を埋め込んでいる。

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

### コーディング規約（ルーティン B のみ）
- Tailwind arbitrary value 禁止（トークンを使う）
- Tailwind opacity modifier 禁止（専用トークンを定義する）

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

### ルーティン A
1. `create_trigger` で新規トリガーを作成
2. cron: `0 0 * * *`, `create_new_session_on_fire: true`
3. プロンプトに AGENTS.md + デザインシステム + React ルールの知識を含める
4. Phase 1-3 のタスクを記載

### ルーティン B
1. `create_trigger` で新規トリガーを作成
2. cron: `30 0 * * *`, `create_new_session_on_fire: true`
3. プロンプトにデザインシステム + React ルール + コーディング規約 + セキュリティ制約を含める
4. レビューフロー + 判定アクション + エスカレーション手順を記載
5. エスカレーション先: @imaimai17468
