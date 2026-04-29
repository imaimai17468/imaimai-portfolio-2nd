type EducationEntryProps = {
  school: string;
  program: string;
  period: string;
  notes: readonly string[];
};

export const EducationEntry = ({
  school,
  program,
  period,
  notes,
}: EducationEntryProps) => (
  <div className="border-l-2 border-border pl-4 py-2">
    <div className="flex items-start justify-between gap-4 mb-1">
      <h3 className="text-foreground font-medium">{school}</h3>
      <span className="text-muted-foreground text-xs shrink-0">{period}</span>
    </div>
    <p className="text-muted-foreground text-sm mb-2">{program}</p>
    <ul className="flex flex-col gap-1">
      {notes.map((note) => (
        <li key={note} className="text-muted-foreground text-sm">
          <span className="text-accent-soft mr-2">{"~"}</span>
          {note}
        </li>
      ))}
    </ul>
  </div>
);
