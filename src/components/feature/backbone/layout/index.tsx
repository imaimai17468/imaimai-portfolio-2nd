import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";
import { Menu, SpMenu } from "@/components/parts/menu";
import { ScrollCounts } from "@/components/parts/scroll-counts";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const BackboneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <Menu />
      <SpMenu />
      <ScrollCounts />
      <AuroraBackground />
      {children}
    </div>
  );
};
