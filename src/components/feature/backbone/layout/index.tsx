import { Header } from "@/components/parts/header";
import { Menu } from "@/components/parts/menu";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const BackboneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <Menu />
      <AuroraBackground />
      {children}
    </div>
  );
};
