export type LinkItem = {
  title: string;
  url: string;
  description: string;
  ogpImageUrl?: string; // OGP画像が自動取得できない場合の手動指定用
  iconUrl?: string; // icon.horseで取得できない場合の手動指定用
};
