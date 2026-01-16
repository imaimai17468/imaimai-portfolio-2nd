import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import avatarImage from "./avatar.jpeg";

/**
 * プロフィールカードコンポーネント
 * アバター、名前、肩書き、Twitter情報を表示
 */
export const ProfileCard: React.FC = () => {
  return (
    <Card className="h-full border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader className="flex flex-col items-center space-y-4 pb-4">
        <Image
          src={avatarImage}
          alt="imaimai17468のプロフィール画像"
          width={120}
          height={120}
          className="rounded-full"
          priority
        />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">imaimai17468</h1>
          <p className="text-base text-muted-foreground">Front-end Developer</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href="https://x.com/imaimai17468"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="X (Twitter) icon"
              >
                <title>X (Twitter)</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@imaimai17468</span>
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          24卒 | フロントエンド | ゆめみ(消滅) → ???
        </p>
      </CardContent>
    </Card>
  );
};
