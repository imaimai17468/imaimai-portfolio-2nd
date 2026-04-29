import { career } from "@/app/data/career";
import { CareerEntry } from "./CareerEntry";

export const Career = () => (
  <div className="flex flex-col gap-6">
    <h3 className="text-muted-foreground text-xs">
      <span className="text-accent">{"~ "}</span>
      career
    </h3>
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
);
