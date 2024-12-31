import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";
import { Menu } from "@/components/parts/menu";

export const WorksLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <Menu />
      {children}
    </div>
  );
};
