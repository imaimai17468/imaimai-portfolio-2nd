import { education } from "@/app/data/education";
import { EducationEntry } from "./EducationEntry";

export const Education = () => (
  <div className="mt-10 flex flex-col gap-6">
    <h3 className="text-muted-foreground text-xs">
      <span className="text-accent">{"~ "}</span>
      education
    </h3>
    {education.map((entry) => (
      <EducationEntry
        key={entry.school}
        school={entry.school}
        program={entry.program}
        period={entry.period}
        research={entry.research}
        organization={entry.organization}
        projects={entry.projects}
        results={entry.results}
        freelance={entry.freelance}
      />
    ))}
  </div>
);
