import Link from "next/link";

export const SubPageNav: React.FC = () => {
  return (
    <div className="px-6 pt-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:underline focus-visible:outline-hidden transition-colors"
      >
        ← Index
      </Link>
    </div>
  );
};
