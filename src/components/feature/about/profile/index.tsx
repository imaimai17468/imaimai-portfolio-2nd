import { SnsLinkButton } from "@/components/parts/sns-link-button";
import { FlipWords } from "@/components/ui/flip-words";
import { Cake, Heart } from "lucide-react";
import Image from "next/image";
import frogImage from "./frog.jpeg";

export const Profile: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto font-light h-screen flex justify-center flex-col gap-16" aria-label="私について">
      <div className="w-full flex justify-between items-center flex-col-reverse sm:flex-row gap-8 sm:gap-0 px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="text-4xl sm:text-6xl font-black">
              <FlipWords words={["いまいまい", "imaimai17468", "Toshiki Imai"]} className="px-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SnsLinkButton type="github" href="https://github.com/imaimai17468" alt="いまいまいのGitHub" />
            <SnsLinkButton type="x" href="https://x.com/imaimai17468" alt="いまいまいのX（旧Twitter）" />
            <SnsLinkButton type="note" href="https://note.com/imaimai17468" alt="いまいまいのnote" />
            <SnsLinkButton type="zenn" href="https://zenn.dev/imaimai17468" alt="いまいまいのZenn" />
            <SnsLinkButton
              type="speakerdeck"
              href="https://speakerdeck.com/imaimai17468"
              alt="いまいまいのSpeaker Deck"
            />
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
          className="rounded-full w-48 h-48 sm:w-64 sm:h-64"
          src={frogImage}
          alt="いまいまいのプロフィール画像。カエルの上にカタツムリが乗っている。"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};
