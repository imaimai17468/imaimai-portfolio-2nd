import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { Dot, MonitorIcon, Search, Tickets, UserIcon } from "lucide-react";

const data = [
  {
    title: "2024 -",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <div className="flex flex-col gap-8">
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
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Project</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot />
                <p>大型漫画掲載サイトのリニューアル</p>
              </li>
              <li className="flex">
                <Dot />
                <p>HR系サービスのホームページのリニューアル</p>
              </li>
              <li className="flex">
                <Dot />
                <p>求人掲載サービスの管理画面の新規機能開発</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Event Sponsor</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot />
                <p>技育CAMPハッカソン</p>
              </li>
              <li className="flex">
                <Dot />
                <p>技育CAMPキャラバン</p>
              </li>
              <li className="flex">
                <Dot />
                <p>技育展 2024</p>
              </li>
              <li className="flex">
                <Dot />
                <p>アクセシビリティカンファレンス 福岡</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Owner</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>mixi2 フロントエンド部</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Speaker</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>BEELT : BEENOS LT会</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>ゆめみ x はてな LT会</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>ゆめみ x タイミー アクセシビリティLT会</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>フロントエンドカンファレンス北海道</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>ゆめみ x bitkey LT会</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>フロントエンドカンファレンス北海道2024アフタートーク Online</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>ゆめみ x LayerX x サイボウズ3社合同フロントエンドカンファレンス北海道2024後夜祭＠東京</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2022-2024",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg mt-1">長岡技術科学大学</h3>
            <ul className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-500 text-sm">
              <li className="flex gap-2 items-center">
                <UserIcon className="w-4 h-4" />
                <p>電気電子情報工学課程</p>
              </li>
              <li className="flex gap-2 items-center">
                <Search className="w-4 h-4" />
                <p>睡眠時脳波の構造解析</p>
              </li>
              <li className="flex gap-2 items-center">
                <Tickets className="w-4 h-4" />
                <p>学園祭実行委員会 情報局 (NUTMEG)</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Project</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot />
                <p>学園祭で使われる資金の管理アプリ</p>
              </li>
              <li className="flex">
                <Dot />
                <p>サークルメンバーの育成管理アプリ</p>
              </li>
              <li className="flex">
                <Dot />
                <p>駐車場空き情報のリアルタイム監視アプリ</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Result</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>第一回技育博にNUTMEGの代表として参加</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>技育展 2023 企業賞</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Works</Badge>
            <p className="text-sm">スタートアップA社</p>
            <ul className="flex flex-col gap-2 text-sm border-b border-zinc-300 pb-1 border-dashed">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>修理の受注/発注ができるLINEアプリの開発</p>
              </li>
            </ul>
            <p className="text-sm">スタートアップB社</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>建築関係のマッチングプラットフォームの開発</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>学会の抄録冊子の自動作成サービス</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>履歴書の自動PDF化・管理サービス</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2017-2022",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg mt-1">木更津工業高等専門学校</h3>
            <ul className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-500 text-sm">
              <li className="flex gap-2 items-center">
                <UserIcon className="w-4 h-4" />
                <p>電子制御工学科</p>
              </li>
              <li className="flex gap-2 items-center">
                <Search className="w-4 h-4" />
                <p>光学式心拍センサの精度評価</p>
              </li>
              <li className="flex gap-2 items-center">
                <Tickets className="w-4 h-4" />
                <p>プログラミング研究同好会</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Project</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot />
                <p>文化祭での自作ゲーム展示</p>
              </li>
              <li className="flex">
                <Dot />
                <p>研究室の鍵のカードキーシステム化</p>
              </li>
              <li className="flex">
                <Dot />
                <p>学校の単位数計算サイト</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Result</Badge>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>Paiza S</p>
              </li>
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>AtCoder 緑</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500 text-white w-fit">Works</Badge>
            <p className="text-sm">paiza Inc.</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex">
                <Dot className="shrink-0 -mt-0.5" />
                <p>競技プログラミング問題集の作問</p>
              </li>
            </ul>
          </div>
        </div>
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
