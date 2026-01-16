import { Vortex } from "@/components/ui/vortex";

type BentoLayoutProps = {
  children: React.ReactNode;
};

/**
 * Bentoページのレイアウトコンポーネント
 * Vortex背景を使用してページ全体のレイアウトを管理
 */
export const BentoLayout: React.FC<BentoLayoutProps> = ({ children }) => {
  return (
    <div>
      <Vortex baseHue={220} containerClassName="h-screen fixed top-0 left-0 w-full -z-10" />
      <main className="min-h-screen py-16 px-4">{children}</main>
    </div>
  );
};
