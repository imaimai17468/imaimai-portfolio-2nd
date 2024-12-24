import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { Cake, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Profile: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto font-light h-screen flex justify-center flex-col gap-16" aria-label="私について">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="text-6xl font-black">
              <FlipWords words={["いまいまい", "imaimai17468", "Toshiki Imai"]} className="px-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com/imaimai17468">
                <Image src="/images/github-mark-white.svg" alt="いまいまいのGitHub" width={20} height={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://x.com/imaimai17468">
                <Image src="/images/x-logo-white.png" alt="いまいまいのX（旧Twitter）" width={16} height={16} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://note.com/imaimai17468">
                <Image src="/images/note.svg" alt="いまいまいのnote" width={24} height={24} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://zenn.dev/imaimai17468">
                <Image src="/images/zenn.svg" alt="いまいまいのZenn" width={20} height={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://speakerdeck.com/imaimai17468">
                <Image src="/images/speaker-deck.png" alt="いまいまいのSpeaker Deck" width={20} height={20} />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-500 text-sm">
              <li className="flex gap-2 items-center">
                <Cake className="w-4 h-4" />
                <p>2001-08-01</p>
              </li>
              <li className="flex gap-2 items-center">
                <Heart className="w-4 h-4" />
                <p>開発・料理</p>
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
