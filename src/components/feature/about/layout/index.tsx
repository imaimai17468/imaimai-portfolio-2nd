import { Header } from "@/components/parts/header";
import { Menu } from "@/components/parts/menu";
import { Vortex } from "@/components/ui/vortex";

type AboutLayoutProps = {
  children: React.ReactNode;
};

export const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <Menu />
      <Vortex containerClassName="h-screen fixed top-0 left-0 w-full -z-10">
        <div />
      </Vortex>
      <main>{children}</main>
    </div>
  );
};
