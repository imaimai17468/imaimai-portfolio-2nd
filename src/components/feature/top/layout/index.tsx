import { BackgroundAnimation } from "@/components/feature/top/background-animation";
import { Header } from "@/components/parts/header";

type TopLayoutProps = {
  children: React.ReactNode;
};

export const TopLayout: React.FC<TopLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
        <BackgroundAnimation />
      </div>
      <main>{children}</main>
    </div>
  );
};
