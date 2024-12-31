import { BackgroundAnimation } from "@/components/feature/top/background-animation";
import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";
import { Menu, SpMenu } from "@/components/parts/menu";

type TopLayoutProps = {
  children: React.ReactNode;
};

export const TopLayout: React.FC<TopLayoutProps> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <Menu />
      <SpMenu />
      <BackgroundAnimation />
      <main>{children}</main>
    </div>
  );
};
