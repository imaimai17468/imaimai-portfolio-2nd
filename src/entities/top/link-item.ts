/**
 * リンクアイテムの型定義
 * Activities と Products で共通して使用
 */
export type LinkItem = {
  title: string;
  url: string;
  description: string;
  ogpImageUrl?: string; // OGP画像が自動取得できない場合の手動指定用
};
