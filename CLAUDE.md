# Development Workflow Rules

このファイルは、Claude Codeを使用した開発ワークフローの標準手順を定義します。
新機能の追加やバグ修正を行う際は、以下のフローに従ってください。

## 基本方針

- **できるだけ全てのフェーズ（Phase 1-11）を実行する**
- **各フェーズで TodoWrite ツールを活用**して進捗を管理する
- **不明点があれば AskUserQuestion で確認**してから進める
- **エラーが発生したら必ず修正**してから次のフェーズに進む
- **コミット前にすべてのチェックがパス**していることを確認
- **段階的にコミット**し、大きすぎる変更を避ける
- **Next.js MCP、Chrome DevTools MCPを積極的に活用**して動作確認を徹底する

## フェーズ概要

**推奨フロー**（ほとんどのケースで適用）:

1. **Phase 1: Investigation & Research** - Context7/Serenaで調査
2. **Phase 2: Architecture Design** - component-refactoring-specialistで設計
3. **Phase 3: UI/UX Design** - ui-design-advisorでデザインレビュー
4. **Phase 4: Planning** - TodoWriteで計画立案
5. **Phase 5: Implementation** - コード実装
6. **Phase 6: Testing & Stories** - テスト・ストーリー作成
7. **Phase 7: Code Review** - component-refactoring-specialistでレビュー
8. **Phase 8: Quality Checks** - bun run でチェック実行
9. **Phase 9: Browser Verification** - Next.js MCP + Chrome DevTools MCPで動作確認
10. **Phase 10: Git Commit** - コミット作成
11. **Phase 11: Push** - リモートへプッシュ

### フェーズ省略可能なケース

以下の場合のみフェーズを省略可能：

- **極めて小さなタイポ修正**: Phase 5 → Phase 8 → Phase 10 → Phase 11
- **ドキュメント更新のみ**: Phase 5 → Phase 10 → Phase 11
- **設定ファイルの微修正**: Phase 5 → Phase 8 → Phase 10 → Phase 11

---

## Workflow Steps

### Phase 1: Investigation & Research (調査フェーズ)

**使用ツール**: Context7 MCP, Serena MCP

1. **既存コードベースの調査**
   - Serena MCPを使用して関連するコンポーネント、関数、モジュールを検索
   - `mcp__serena__find_symbol` で既存の実装を確認
   - `mcp__serena__find_referencing_symbols` で依存関係を把握
   - `mcp__serena__get_symbols_overview` でファイル構造を理解

2. **ライブラリドキュメントの確認**
   - Context7 MCPを使用して最新のライブラリドキュメントを取得
   - Next.js, React, その他使用するライブラリの最新情報を確認
   - `mcp__context7__resolve-library-id` → `mcp__context7__get-library-docs` の順で実行

3. **調査結果の整理**
   - 既存パターンやコーディング規約を把握
   - 再利用可能なコンポーネントやユーティリティを特定
   - 必要に応じて `mcp__serena__write_memory` で調査結果を保存

### Phase 2: Architecture Design (アーキテクチャ設計)

**使用エージェント**: component-refactoring-specialist

1. **技術的方針の決定**
   - ファイル配置、ディレクトリ構造の決定
   - 状態管理の方法（useState, useContext, 外部ライブラリなど）
   - データフローとコンポーネント間の関係性の設計
   - APIエンドポイントやデータ取得戦略の決定

2. **コンポーネント設計**
   - `component-refactoring-specialist` エージェントを使用
   - コンポーネント分割の方針（責任の分離、単一責任原則）
   - Props インターフェースの設計
   - 再利用性と保守性を考慮した設計
   - 既存コンポーネントとの整合性確認

3. **パフォーマンス考慮事項**
   - Next.js 16の機能活用（Cache Components, Server Componentsなど）
   - レンダリング戦略（SSR, SSG, ISRなど）
   - 画像最適化、コード分割など

### Phase 3: UI/UX Design (デザイン設計)

**使用エージェント**: ui-design-advisor

1. **デザインレビュー**
   - ダークテーマを中心としたカラー戦略
   - タイポグラフィとスペーシングの確認
   - 視覚的階層とレイアウト設計

2. **アクセシビリティ確認**
   - セマンティックHTML
   - ARIA属性の適切な使用
   - キーボード操作対応

3. **レスポンシブデザイン**
   - モバイル、タブレット、デスクトップでの表示確認
   - ブレークポイントの設定

### Phase 4: Planning (計画立案)

**使用ツール**: ExitPlanMode tool, TodoWrite tool

1. **実装計画の作成**
   - タスクを細分化し、実装順序を決定
   - TodoWriteツールで作業項目をトラッキング
   - 各タスクの依存関係を明確化

2. **計画のレビュー**
   - 不明確な要件や仕様の洗い出し
   - 必要に応じて `AskUserQuestion` で確認
   - ExitPlanModeで計画を確定

### Phase 5: Implementation (実装)

**使用ツール**: Edit, Write, Read, mcp__serena__* tools

1. **コード実装**
   - アーキテクチャ設計に基づいて実装
   - TypeScriptの型定義を厳密に
   - 日本語コメントで意図を明確に

2. **進捗管理**
   - TodoWriteツールでタスクを `in_progress` → `completed` に更新
   - 一度に1つのタスクに集中

3. **コーディング規約の遵守**
   - ESLint、Prettierの設定に従う
   - プロジェクト固有のパターンを踏襲
   - バレルインポート禁止（`@/` aliasを使用した個別インポート）

### Phase 6: Testing & Stories (テスト・ストーリー作成)

**使用エージェント**: test-guideline-enforcer, storybook-story-creator

1. **Storybook ストーリー作成**
   - `storybook-story-creator` エージェントを使用
   - 条件分岐による表示切り替えのある場合のみストーリーを作成
   - 単純なprops値の違いはストーリー化しない

2. **テストコード作成**
   - `test-guideline-enforcer` エージェントを使用
   - Vitest / React Testing Libraryで実装
   - AAAパターン（Arrange-Act-Assert）を厳守
   - 日本語のテストタイトル
   - すべての条件分岐をカバー

### Phase 7: Code Review (コードレビュー)

**使用エージェント**: component-refactoring-specialist

1. **実装レビュー**
   - `component-refactoring-specialist` エージェントを使用
   - コードの品質、可読性、保守性を確認
   - ベストプラクティスへの準拠を確認
   - パフォーマンス上の問題がないか確認
   - コンポーネントの責任分離が適切か確認

2. **リファクタリング**
   - 必要に応じてコードを改善
   - 重複コードの削除
   - 命名の改善
   - コンポーネントの分割・統合の提案

### Phase 8: Quality Checks (品質チェック)

**使用ツール**: Bash tool

1. **静的解析とテスト実行**
   ```bash
   # 型チェック
   bun run type-check

   # Lint
   bun run lint

   # テスト実行
   bun run test

   # ビルド確認
   bun run build
   ```

2. **エラーの修正**
   - エラーが発生した場合は修正して再実行
   - すべてのチェックがパスするまで繰り返す

### Phase 9: Browser Verification (ブラウザ動作確認)

**使用ツール**: mcp__chrome-devtools__*, mcp__next-devtools__*

1. **開発サーバー起動**
   ```bash
   bun run dev
   ```

2. **Next.js Runtime確認（next-devtools MCP）**

   **2.1 サーバー検出とツール一覧**
   ```
   # Next.js開発サーバーを自動検出
   mcp__next-devtools__nextjs_runtime
   action: 'discover_servers'

   # 利用可能なツールを確認
   mcp__next-devtools__nextjs_runtime
   action: 'list_tools'
   port: <検出したポート番号>
   ```

   **2.2 ランタイムエラー・警告の確認**
   ```
   # ビルドエラーやランタイムエラーを取得
   mcp__next-devtools__nextjs_runtime
   action: 'call_tool'
   port: <ポート番号>
   toolName: 'get-errors'  # または 'get-logs', 'get-diagnostics'
   ```

   **2.3 ルート情報の取得**
   ```
   # アプリケーションのルート構造を取得
   mcp__next-devtools__nextjs_runtime
   action: 'call_tool'
   port: <ポート番号>
   toolName: 'get-routes'

   # 特定ルートの詳細情報を取得
   mcp__next-devtools__nextjs_runtime
   action: 'call_tool'
   port: <ポート番号>
   toolName: 'get-route-info'
   args: {path: '/your-route'}
   ```

   **2.4 キャッシュ・ビルド状態の確認**
   ```
   # キャッシュ情報を取得
   mcp__next-devtools__nextjs_runtime
   action: 'call_tool'
   port: <ポート番号>
   toolName: 'get-cache-info'

   # キャッシュをクリア（必要に応じて）
   mcp__next-devtools__nextjs_runtime
   action: 'call_tool'
   port: <ポート番号>
   toolName: 'clear-cache'
   ```

3. **Next.js Documentation検索（必要に応じて）**
   ```
   # Next.js 16の最新ドキュメントを検索
   mcp__next-devtools__nextjs_docs
   query: '検索キーワード'
   category: 'api-reference'  # または 'guides', 'getting-started', 'all'
   ```

4. **ブラウザテスト（chrome-devtools MCP）**

   **4.1 ページ管理**
   ```
   # ページ一覧を取得
   mcp__chrome-devtools__list_pages

   # 新しいページを作成
   mcp__chrome-devtools__new_page
   url: 'http://localhost:3000/your-route'

   # ページに移動
   mcp__chrome-devtools__navigate_page
   url: 'http://localhost:3000/your-route'
   ```

   **4.2 ページ構造の確認**
   ```
   # アクセシビリティツリーのスナップショット（テキストベース）
   mcp__chrome-devtools__take_snapshot
   verbose: false  # 詳細情報が必要な場合はtrue

   # スクリーンショット（視覚確認）
   mcp__chrome-devtools__take_screenshot
   fullPage: true  # フルページ or false（ビューポートのみ）
   format: 'png'   # or 'jpeg', 'webp'
   ```

   **4.3 インタラクション**
   ```
   # 要素をクリック
   mcp__chrome-devtools__click
   uid: '<snapshot内の要素uid>'

   # フォーム入力
   mcp__chrome-devtools__fill
   uid: '<input要素のuid>'
   value: '入力値'

   # フォーム一括入力
   mcp__chrome-devtools__fill_form
   elements: [{uid: '<uid1>', value: '値1'}, {uid: '<uid2>', value: '値2'}]

   # ホバー
   mcp__chrome-devtools__hover
   uid: '<要素uid>'
   ```

   **4.4 JavaScriptの実行**
   ```
   # カスタムスクリプト実行
   mcp__chrome-devtools__evaluate_script
   function: '() => { return document.title; }'

   # 要素を引数として渡す例
   mcp__chrome-devtools__evaluate_script
   function: '(el) => { return el.innerText; }'
   args: [{uid: '<要素uid>'}]
   ```

   **4.5 ネットワーク・コンソール確認**
   ```
   # コンソールメッセージ一覧
   mcp__chrome-devtools__list_console_messages
   types: ['error', 'warn']  # エラーと警告のみ
   pageSize: 50

   # 特定のコンソールメッセージ詳細
   mcp__chrome-devtools__get_console_message
   msgid: <メッセージID>

   # ネットワークリクエスト一覧
   mcp__chrome-devtools__list_network_requests
   resourceTypes: ['xhr', 'fetch']  # API通信のみ
   pageSize: 50

   # 特定のリクエスト詳細
   mcp__chrome-devtools__get_network_request
   reqid: <リクエストID>
   ```

   **4.6 パフォーマンス測定**
   ```
   # パフォーマンストレース開始
   mcp__chrome-devtools__performance_start_trace
   reload: true      # ページリロードしてトレース
   autoStop: true    # 自動停止

   # トレース停止
   mcp__chrome-devtools__performance_stop_trace

   # パフォーマンスインサイト詳細
   mcp__chrome-devtools__performance_analyze_insight
   insightName: 'LCPBreakdown'  # or 'DocumentLatency'など
   ```

   **4.7 エミュレーション**
   ```
   # CPU スロットリング
   mcp__chrome-devtools__emulate_cpu
   throttlingRate: 4  # 4倍遅い CPUをシミュレート (1-20)

   # ネットワークスロットリング
   mcp__chrome-devtools__emulate_network
   throttlingOption: 'Slow 3G'  # or 'Fast 3G', 'Offline'など

   # ページリサイズ（レスポンシブ確認）
   mcp__chrome-devtools__resize_page
   width: 375   # iPhone SE幅
   height: 667
   ```

5. **ブラウザ自動化（browser_eval MCP）**
   ```
   # ブラウザ起動
   mcp__next-devtools__browser_eval
   action: 'start'
   browser: 'chrome'  # or 'firefox', 'webkit'
   headless: false    # UIを表示する場合はfalse

   # ページ移動
   mcp__next-devtools__browser_eval
   action: 'navigate'
   url: 'http://localhost:3000'

   # スクリーンショット
   mcp__next-devtools__browser_eval
   action: 'screenshot'
   fullPage: true

   # コンソールメッセージ取得
   mcp__next-devtools__browser_eval
   action: 'console_messages'
   errorsOnly: true

   # ブラウザクローズ
   mcp__next-devtools__browser_eval
   action: 'close'
   ```

6. **確認チェックリスト**
   - [ ] Next.js MCPでビルド・ランタイムエラーがゼロ
   - [ ] 全ルートが正しく動作（get-routesで確認）
   - [ ] コンソールエラー・警告がゼロ
   - [ ] ネットワークリクエストが正常（4xx/5xxエラーなし）
   - [ ] Core Web Vitals（LCP, FID, CLS）が良好
   - [ ] レスポンシブデザインが正常（375px〜1920px）
   - [ ] アクセシビリティツリーが適切

### Phase 10: Git Commit

**使用ツール**: Bash tool

1. **変更内容の確認**
   ```bash
   git status
   git diff
   ```

2. **コミット作成**
   - 適切なコミットメッセージを作成（英語、簡潔に）
   - コミットメッセージフォーマット：`<type>: <description>`
   - type例：feat, fix, refactor, docs, test, style, chore
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Phase 11: Push

**使用ツール**: Bash tool

1. **リモートへプッシュ**
   ```bash
   git push origin <branch-name>
   ```

2. **必要に応じてPR作成**
   ```bash
   gh pr create --title "PR title" --body "PR description"
   ```
