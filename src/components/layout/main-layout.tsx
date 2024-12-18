import { Header } from "@/components/parts/header";
import { ScrollCounts } from "@/components/parts/scroll-counts";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <ScrollCounts />
      <main>{children}</main>
    </div>
  );
};
