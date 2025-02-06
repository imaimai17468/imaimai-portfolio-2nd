import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";
import { Menu, SpMenu } from "@/components/parts/menu";
import { ScrollCounts } from "@/components/parts/scroll-counts";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <Menu />
      <SpMenu />
      <ScrollCounts />
      {children}
    </div>
  );
};
