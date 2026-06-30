import Image from "next/image";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section className="px-6 py-16">
      <div className="flex items-start gap-4">
        <Image
          src="/frog_large.png"
          alt="imaimai17468"
          width={48}
          height={48}
          className="flex-shrink-0"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-foreground">imaimai17468</h1>
          <p className="text-sm text-muted-foreground">Engineer</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <Link
          href="https://x.com/imaimai17468"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          X
        </Link>
        <Link
          href="https://github.com/imaimai17468"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </Link>
        <Link
          href="https://sizu.me/imaimai17468"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Blog
        </Link>
        <Link
          href="https://zenn.dev/imaimai17468"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Zenn
        </Link>
      </div>
    </section>
  );
};
