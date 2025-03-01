import type React from "react";
import { SnsLinkButton } from "../sns-link-button";

export const PortfolioGitHubLink: React.FC = () => {
  return (
    <div className="w-fit p-2 fixed bottom-3 right-4 gap-4 hidden sm:flex">
      <SnsLinkButton href="https://github.com/imaimai17468/imaimai-portfolio-2nd" type="github" />
    </div>
  );
};
