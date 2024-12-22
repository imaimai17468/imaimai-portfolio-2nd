import { Header } from "@/components/parts/header";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

type AboutLayoutProps = {
  children: React.ReactNode;
};

export const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <BackgroundBeamsWithCollision className="h-screen md:h-screen fixed top-0 left-0 w-full -z-10 dark:to-neutral-900">
        <div />
      </BackgroundBeamsWithCollision>
      <main>{children}</main>
    </div>
  );
};
