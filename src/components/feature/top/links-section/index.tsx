import Link from "next/link";

const LINKS = [
  { label: "X", href: "https://x.com/imaimai17468" },
  { label: "GitHub", href: "https://github.com/imaimai17468" },
  { label: "Blog", href: "https://sizu.me/imaimai17468" },
  { label: "Zenn", href: "https://zenn.dev/imaimai17468" },
];

export const LinksSection: React.FC = () => {
  return (
    <section className="px-6 py-8">
      <h2 className="text-sm font-bold text-foreground mb-4">Links</h2>
      <ul className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground focus-visible:underline focus-visible:outline-hidden transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
