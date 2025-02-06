import { AuroraBackground } from "@/components/ui/aurora-background";

export const BackboneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <AuroraBackground />
      {children}
    </div>
  );
};
