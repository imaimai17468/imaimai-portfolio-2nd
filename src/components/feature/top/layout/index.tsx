import { BackgroundAnimation } from "@/components/feature/top/background-animation";
import { Header } from "@/components/parts/header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
