import { TopLayout } from "./layout";
import { Menu } from "./menu";

export const Top: React.FC = () => {
  return (
    <TopLayout>
      <div className="p-2 h-screen">
        <Menu />
        <div className="flex flex-col items-center h-full justify-center border border-zinc-200 rounded-lg">
          <div className="w-fit">
            <h1 className="text-9xl font-raleway font-black">CREATOR's HIGH</h1>
            <p className="text-end">－ 開発でキマれ</p>
          </div>
        </div>
      </div>
    </TopLayout>
  );
};
