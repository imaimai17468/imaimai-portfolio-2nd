import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";
import { Menu } from "@/components/parts/menu";
import { ScrollCounts } from "@/components/parts/scroll-counts";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const BackboneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <Menu />
      <ScrollCounts />
      <AuroraBackground />
      {children}
    </div>
  );
};
