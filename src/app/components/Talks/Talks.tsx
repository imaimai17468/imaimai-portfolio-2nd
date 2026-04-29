import { talks } from "@/app/data/talks";

export const Talks = () => (
  <section id="08-talks" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      08. talks
    </h2>
    <div className="flex flex-col gap-3">
      {talks.map((talk) => (
        <div
          key={talk.event}
          className="border border-border rounded-md p-4 bg-card"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-foreground font-medium">{talk.event}</p>
              <p className="text-muted-foreground text-sm mt-1">{talk.title}</p>
            </div>
            <span className="text-muted-foreground text-xs shrink-0">
              {talk.year}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
);
