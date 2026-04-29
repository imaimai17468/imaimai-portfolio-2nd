import Link from "next/link";
import { profile } from "@/app/data/profile";
import { socialLinks } from "@/app/data/links";

export const Hero = () => (
  <section id="01-hero" className="py-16 px-6">
    <div className="mb-6 text-muted-foreground text-sm">
      <span className="text-accent">{">"}</span> whoami
    </div>
    <h1 className="text-4xl font-bold text-foreground mb-2">
      <span className="text-accent">{"@"}</span>
      {profile.handle}
    </h1>
    <p className="text-muted-foreground mb-1">{profile.title}</p>
    <p className="text-muted-foreground text-sm mb-6">{profile.tagline}</p>
    <div className="border-l-2 border-border pl-4 mb-8 flex flex-col gap-3">
      {profile.bio.map((paragraph) => (
        <p key={paragraph} className="text-foreground text-sm leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="text-accent-soft mr-2">{"$"}</span>
        <span className="text-foreground">~/imaimai17468</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);
