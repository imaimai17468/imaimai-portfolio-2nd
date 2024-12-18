import Link from "next/link";
import type React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-fit p-2 rotate-90 fixed top-28 -left-24 flex gap-4 text-zinc-500">
      <p>imaimai portfolio</p>
      <p>-</p>
      <Link
        href="https://github.com/imaimai17468/imaimai-portfolio-2nd"
        className="hover:text-zinc-300 transition-colors duration-300"
      >
        <p>GitHub</p>
      </Link>
    </header>
  );
};
