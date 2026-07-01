"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Index", href: "/" },
  { label: "History", href: "/history" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
];

export const Header: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <nav className="flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-colors focus-visible:underline focus-visible:outline-hidden ${
              pathname === item.href
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={toggleTheme}
        className="tap-target-44 flex items-center justify-center w-8 h-8 border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground focus-visible:ring-1 focus-visible:ring-foreground active:opacity-80 transition-colors"
        aria-label="Toggle theme"
      >
        {mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : ""}
      </button>
    </header>
  );
};
