"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { label: "History", href: "/history" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Links", href: "/links" },
];

export const NextPageLink: React.FC = () => {
  const pathname = usePathname();
  const currentIndex = PAGES.findIndex((p) => p.href === pathname);
  if (currentIndex < 0) return null;
  const next = PAGES[currentIndex + 1];
  if (!next) return null;

  return (
    <div className="px-6 pb-6 flex justify-end">
      <Link
        href={next.href}
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:underline focus-visible:outline-hidden transition-colors"
      >
        {next.label} →
      </Link>
    </div>
  );
};
