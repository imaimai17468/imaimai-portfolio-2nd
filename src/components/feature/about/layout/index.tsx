import { Vortex } from "@/components/ui/vortex";

type AboutLayoutProps = {
  children: React.ReactNode;
};

export const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <div>
      <Vortex baseHue={100} containerClassName="h-screen fixed top-0 left-0 w-full -z-10" />
      <main>{children}</main>
    </div>
  );
};
