import { Button } from "@/components/ui/button";
import { MonitorIcon, Tickets, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto font-light h-screen flex justify-center flex-col gap-16">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-4">
              <h1 className="text-6xl font-black">いまいまい</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com/imaimai17468">
                    <Image src="/images/github-mark-white.svg" alt="いまいまいのGitHub" width={20} height={20} />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://x.com/imaimai17468">
                    <Image src="/images/x-logo-white.png" alt="いまいまいのX（旧Twitter）" width={20} height={20} />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-lg text-zinc-500">imaimai17468 - Toshiki Imai</p>
          </div>

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
        </div>
        <Image
          className="rounded-full w-64 h-64"
          src="/images/frog.jpeg"
          alt="いまいまいのプロフィール画像。カエルの上にカタツムリが乗っている。"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};
