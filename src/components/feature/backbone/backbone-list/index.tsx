import Image from "next/image";
import Link from "next/link";
import { BackboneListItem } from "./backbone-list-item";

export const BackboneList = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto py-16">
      <div className="grid grid-cols-3 gap-8">
        <BackboneListItem
          title="CHICO CARLITO vs MOL53 : KING OF KINGS 2023 GRAND CHAMPIONSHIP FINAL"
          youtubeUrl="https://www.youtube.com/embed/xemRYJYzs_c?si=jYoKsJVaNRIW4r42"
          description="自分を最後信じ抜いた奴は、敵はいない"
        />
        <BackboneListItem
          title="映像研には手を出すな！"
          youtubeUrl="https://www.youtube.com/embed/xcElFRSjZqU?si=I98W-WiNDTFYYmX2"
          description="大半の人が細部を見なくても、私は私を救わなくちゃいけないんだ。動きの一つ一つに感動する人に、私はここにいるって、言わなくちゃいけないんだ。"
        />
        <BackboneListItem
          title="ピンポン"
          youtubeUrl="https://www.youtube.com/embed/5XSHvXT2DpU?si=phoNRwze5rghHdBV"
          description="僕の血は鉄の味がする"
        />
        <BackboneListItem
          title="Cyberpunk 2077"
          youtubeUrl=""
          description="そいつが何者なのかを決めるのは、結局何を信じ、何を守って生きているかだ。迷った時にはそれが帰り道を示し、粉々に砕け散っても、自分を繋ぎ止めてくれる。"
          contents={
            <Link
              href="https://www.cyberpunk.net/jp/ja/cyberpunk-2077"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <div className="bg-[#FCFF50] h-[200px] rounded-lg p-4 flex justify-center items-center">
                <Image
                  src="https://www.cyberpunk.net/build/images/home8/logo-franchise-black-en@2x-06852b64.png"
                  alt="Cyberpunk 2077"
                  width={300}
                  height={300}
                />
              </div>
            </Link>
          }
        />
        <BackboneListItem
          title="輪入道 - 真 ADRENALINE 2020 ウイニングラップ"
          youtubeUrl="https://www.youtube.com/embed/zZKs16YhDY8?si=sGLA55Ac1gkxfDh2"
          description="どんな場所にだって光が差してる、気が付かないだけ、暗い場所で見る光も悪くねえ"
        />
      </div>
    </div>
  );
};
