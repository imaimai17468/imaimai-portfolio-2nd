import { BackgroundAnimation } from "@/components/feature/top/background-animation";
import { PortfolioGitHubLink } from "@/components/parts/github-portfolio-link";

type TopLayoutProps = {
  children: React.ReactNode;
};

export const TopLayout: React.FC<TopLayoutProps> = ({ children }) => {
  return (
    <div>
      <PortfolioGitHubLink />
      <BackgroundAnimation />
      <main>{children}</main>
    </div>
  );
};
