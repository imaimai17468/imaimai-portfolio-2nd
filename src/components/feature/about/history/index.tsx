import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { Dot, MonitorIcon, Tickets, UserIcon } from "lucide-react";

const data = [
  {
    title: "2024 -",
    content: (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg mt-1">株式会社ゆめみ</h3>
          <ul className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-500 text-sm">
            <li className="flex gap-2 items-center">
              <MonitorIcon className="w-4 h-4" />
              <p>フロントエンドエンジニア</p>
            </li>
            <li className="flex gap-2 items-center">
              <UserIcon className="w-4 h-4" />
              <p>リクルーター</p>
            </li>
            <li className="flex gap-2 items-center">
              <Tickets className="w-4 h-4" />
              <p>技育プロジェクト担当</p>
            </li>
          </ul>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Project</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center">
                <Dot />
                <p>大型漫画掲載サイトのリニューアル</p>
              </li>
              <li className="flex items-center">
                <Dot />
                <p>HR系サービスのホームページのリニューアル</p>
              </li>
              <li className="flex items-center">
                <Dot />
                <p>求人掲載サービスの管理画面の新規機能開発</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Badge className="bg-green-500 text-white w-fit">Speaker</Badge>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>BEELT : BEENOS LT会</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>ゆめみ x はてな LT会</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>ゆめみ x タイミー アクセシビリティLT会</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>フロントエンドカンファレンス北海道</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>ゆめみ x bitkey LT会</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>フロントエンドカンファレンス北海道2024アフタートーク Online</p>
            </li>
            <li className="flex items-center">
              <Dot className="shrink-0" />
              <p>ゆめみ x LayerX x サイボウズ3社合同フロントエンドカンファレンス北海道2024後夜祭＠東京</p>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">section2</p>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">section3</p>
      </div>
    ),
  },
];
export const History: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto font-light flex flex-col gap-16" aria-label="私のこれまで">
      <Timeline data={data} />
    </div>
  );
};
