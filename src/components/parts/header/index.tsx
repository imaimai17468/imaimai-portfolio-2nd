import type React from "react";
import { SnsLinkButton } from "../sns-link-button";

export const Header: React.FC = () => {
  return (
    <div className="w-fit p-2 fixed bottom-3 right-4 flex gap-4">
      <SnsLinkButton href="https://github.com/imaimai17468/imaimai-portfolio-2nd" type="github" />
    </div>
  );
};
