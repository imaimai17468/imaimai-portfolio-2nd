# Imaimai Portfolio

[imaim.ai](https://imaim.ai)

imaimai17468 のポートフォリオサイト。React と [Void](https://void.cloud) で作り、Cloudflare Workers に配信する。デザインは作り直し中で、トップページは Void のスターターのまま。

## 構成

| パス | 役割 |
|------|------|
| `pages/` | ページ。ファイルが URL になり、サーバーで描画したあとブラウザで hydrate する |
| `src/` | 複数のページが使うコード |
| `public/` | そのまま配信する画像。`avatar.png`、`icon.png`、`og.png` は旧サイトから引き継いだもの |
| `vite.config.ts` / `void.config.ts` | Vite と Void の設定 |

## 開発

Node 24.22+ か 26.12+ が必要。`mise.toml` で Node と pnpm の版を固定している。

```bash
mise install
pnpm install
pnpm run dev
```

## デプロイ

```bash
npx void deploy
```

Cloudflare のアカウントに対して実行する。
