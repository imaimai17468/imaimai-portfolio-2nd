import { ExternalLink } from "lucide-react";
import Link from "next/link";

const PRODUCTS = [
  { title: "Osampo", url: "https://osampo.vercel.app" },
  { title: "ツウキンプレイス", url: "https://tsuukin-place.com" },
  {
    title: "Contrast Color Palette",
    url: "https://contrast-color-palette.vercel.app",
  },
  {
    title: "Digital Agency Icons",
    url: "https://digital-agency-icons-docs.vercel.app",
  },
  { title: "imaimai UI", url: "https://imaimai-ui.vercel.app" },
  {
    title: "木更津高専単位カウンター",
    url: "https://credits-counter-fo-knct.vercel.app",
  },
];

export const ProductsSection: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted-foreground tracking-wider mb-6">
        PRODUCTS
      </h2>
      <ul className="space-y-3">
        {PRODUCTS.map((product) => (
          <li key={product.url}>
            <Link
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-sm text-foreground/80"
            >
              {product.title}
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
