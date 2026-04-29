import { education } from "@/app/data/education";
import { EducationEntry } from "./EducationEntry";

export const Education = () => (
  <section id="05-education" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      05. education
    </h2>
    <div className="flex flex-col gap-6">
      {education.map((entry) => (
        <EducationEntry
          key={entry.school}
          school={entry.school}
          program={entry.program}
          period={entry.period}
          notes={entry.notes}
        />
      ))}
    </div>
  </section>
);
