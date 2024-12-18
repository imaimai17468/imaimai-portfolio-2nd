import { Header } from "@/components/parts/header";
import { ScrollCounts } from "@/components/parts/scroll-counts";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <BackgroundBeamsWithCollision className="h-screen md:h-screen fixed top-0 left-0 w-full -z-10 dark:to-neutral-900">
        <div />
      </BackgroundBeamsWithCollision>
      <Header />
      <ScrollCounts />
      <main>{children}</main>
    </div>
  );
};
