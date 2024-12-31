import { Menu } from "@/components/parts/menu";
import { TopLayout } from "./layout";

export const Top: React.FC = () => {
  return (
    <TopLayout>
      <div className="p-2 h-screen">
        <Menu />
        <div className="flex flex-col items-center h-full justify-center border border-zinc-200 rounded-lg">
          <div className="w-fit">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-raleway font-black">
              CREATOR's HIGH
            </h1>
            <p className="text-end text-sm lg:text-base">－ 開発でキマれ</p>
          </div>
        </div>
      </div>
    </TopLayout>
  );
};
