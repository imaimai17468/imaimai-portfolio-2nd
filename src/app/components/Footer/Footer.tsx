import { profile } from "@/app/data/profile";

export const Footer = () => (
  <footer className="py-8 px-6 border-t border-border mt-8">
    <p className="text-muted-foreground text-sm">
      <span className="text-accent-soft">{"[ "}</span>
      {profile.handle}
      <span className="text-accent-soft">{" ]"}</span>
      <span className="ml-2 text-muted-foreground">
        {"─ built with Next.js + Tailwind"}
      </span>
    </p>
  </footer>
);
