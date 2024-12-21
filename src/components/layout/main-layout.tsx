import { BackgroundAnimation } from "@/components/parts/background-animation";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
        <BackgroundAnimation />
      </div>
      <main>{children}</main>
    </div>
  );
};
