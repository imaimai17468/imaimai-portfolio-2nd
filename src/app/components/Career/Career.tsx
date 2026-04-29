import { career } from "@/app/data/career";
import { CareerEntry } from "./CareerEntry";

export const Career = () => (
  <section id="04-career" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      04. career
    </h2>
    <div className="flex flex-col gap-6">
      {career.map((entry) => (
        <CareerEntry
          key={entry.company}
          company={entry.company}
          role={entry.role}
          period={entry.period}
          highlights={entry.highlights}
          talks={entry.talks}
        />
      ))}
    </div>
  </section>
);
