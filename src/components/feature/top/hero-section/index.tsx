import Image from "next/image";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section className="flex items-start gap-4 px-6 py-8">
      <Image
        src="/frog_large.png"
        alt="imaimai17468"
        width={48}
        height={48}
        className="flex-shrink-0"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold text-foreground">imaimai17468</h1>
        <div className="flex items-center gap-3">
          <Link
            href="https://x.com/imaimai17468"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground"
            aria-label="X (Twitter)"
          >
            X
          </Link>
          <Link
            href="https://github.com/imaimai17468"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground"
            aria-label="GitHub"
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
};
