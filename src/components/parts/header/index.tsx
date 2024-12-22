import Link from "next/link";
import type React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-fit p-2 fixed bottom-4 right-4 flex gap-4">
      <p>imaimai portfolio</p>
      <p>-</p>
      <Link
        href="https://github.com/imaimai17468/imaimai-portfolio-2nd"
        className="hover:text-zinc-500 transition-colors duration-300"
      >
        <p>GitHub</p>
      </Link>
    </header>
  );
};
