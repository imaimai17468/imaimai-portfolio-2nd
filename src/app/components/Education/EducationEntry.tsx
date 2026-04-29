type EducationEntryProps = {
  period: string;
  school: string;
  program: string;
  research: string;
  organization: string;
  projects: readonly string[];
  results: readonly string[];
  freelance: readonly string[];
};

export const EducationEntry = ({
  period,
  school,
  program,
  research,
  organization,
  projects,
  results,
  freelance,
}: EducationEntryProps) => (
  <div className="border-l-2 border-border pl-4 py-2">
    <div className="flex items-start justify-between gap-4 mb-1">
      <h3 className="text-foreground font-medium">{school}</h3>
      <span className="text-muted-foreground text-xs shrink-0">{period}</span>
    </div>
    <p className="text-muted-foreground text-sm mb-1">{program}</p>
    <p className="text-muted-foreground text-sm mb-3">
      <span className="text-accent-soft mr-2">{"~"}</span>
      {research}
    </p>
    <p className="text-muted-foreground text-sm mb-3">
      <span className="text-accent-soft mr-2">{"~"}</span>
      {organization}
    </p>
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-muted-foreground text-xs mb-1">projects</p>
        <ul className="flex flex-col gap-1">
          {projects.map((project) => (
            <li key={project} className="text-muted-foreground text-sm">
              <span className="text-accent-soft mr-2">{"~"}</span>
              {project}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-muted-foreground text-xs mb-1">results</p>
        <ul className="flex flex-col gap-1">
          {results.map((result) => (
            <li key={result} className="text-muted-foreground text-sm">
              <span className="text-accent-soft mr-2">{"~"}</span>
              {result}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-muted-foreground text-xs mb-1">freelance</p>
        <ul className="flex flex-col gap-1">
          {freelance.map((item) => (
            <li key={item} className="text-muted-foreground text-sm">
              <span className="text-accent-soft mr-2">{"~"}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
