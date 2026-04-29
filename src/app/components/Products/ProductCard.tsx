import Link from "next/link";

type ProductCardProps = {
  name: string;
  url: string;
  description: string;
};

export const ProductCard = ({ name, url, description }: ProductCardProps) => (
  <div className="border border-border rounded-md p-4 bg-card hover:border-accent-soft transition-colors">
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-foreground transition-colors font-medium"
    >
      {name}
    </Link>
    <p className="text-muted-foreground text-sm mt-1">{description}</p>
  </div>
);
