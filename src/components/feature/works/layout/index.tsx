import { Header } from "@/components/parts/header";
import { Menu } from "@/components/parts/menu";

export const WorksLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <Menu />
      {children}
    </div>
  );
};
