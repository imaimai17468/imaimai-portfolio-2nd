# Imaimai Portfolio

[imaim.ai](https://imaim.ai)

imaimai17468 のポートフォリオサイト。`index.html` と `style.css`、アイコンの `icon.png`、シェア画像の `og.png` だけで構成された静的サイト。

## 構成

| ファイル | 役割 |
|---------|------|
| `index.html` | 全コンテンツ（Links / Projects / History / Speaker） |
| `style.css` | スタイル |
| `icon.png` | ファビコン兼、名前の横のアイコン |
| `og.png` | OG / Twitter Card 用のシェア画像（1200×630） |

## ローカル確認

ビルドは不要。`index.html` をブラウザで直接開くか、任意の静的サーバーで配信する。

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
