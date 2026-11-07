# Imaimai Portfolio

[imaim.ai](https://imaim.ai)

imaimai17468 のポートフォリオサイト。Rust 製の Web フレームワーク [hypersig](https://github.com/imaimai17468/hypersig) で HTML を生成し、生成したファイルをそのまま配信する静的サイト。

## 構成

| ファイル | 役割 |
|---------|------|
| `generator/` | ページを生成する Rust のプログラム。内容とスタイルはすべて `generator/src/main.rs` にある |
| `index.html` | トップページ（生成物）。Zenn と sizu の記事を新しい順に並べる |
| `about/index.html` | About ページ（生成物） |
| `hypersig.js` | hypersig のランタイム（生成物） |
| `fonts/` | Zen Kurenaido をページの文字だけに絞った WOFF2 と、その元のフォントとライセンス |
| `scripts/` | 生成とフォントの絞り込みを行うスクリプト |
| `frog.svg` / `pencil.svg` / `paper.svg` / `avatar.png` | ヘッダーのカエル、トップの筆文字、紙の質感の背景、About のアイコン |
| `icon.png` | ファビコン |
| `og.png` | OG / Twitter Card 用のシェア画像（1200×630） |

## 生成

`cargo` と `uv` が必要。記事一覧は Zenn と sizu の RSS から取得するので、ネットワークにもつながっている必要がある。

```bash
scripts/build.sh
```

記事一覧はこのコマンドを実行して生成物をコミットしたときだけ更新される。

## ローカル確認

```bash
python3 -m http.server
```

## デプロイ

Vercel（Framework Preset: Other）。`main` へのマージで自動デプロイされる。

## ライセンス

MIT

---

<div align="center">
  <p>Made with 🐸 by imaimai17468</p>
</div>
