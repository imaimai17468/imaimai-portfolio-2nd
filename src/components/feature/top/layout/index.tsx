import { BackgroundAnimation } from "@/components/feature/top/background-animation";

type TopLayoutProps = {
  children: React.ReactNode;
};

export const TopLayout: React.FC<TopLayoutProps> = ({ children }) => {
  return (
    <div>
      <BackgroundAnimation />
      <main>{children}</main>
    </div>
  );
};
