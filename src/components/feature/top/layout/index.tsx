import { BackgroundAnimation } from "@/components/feature/top/background-animation";
import { Header } from "@/components/parts/header";

type TopLayoutProps = {
  children: React.ReactNode;
};

export const TopLayout: React.FC<TopLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <BackgroundAnimation />
      <main>{children}</main>
    </div>
  );
};
