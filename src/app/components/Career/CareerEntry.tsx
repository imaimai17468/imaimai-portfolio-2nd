type CareerEntryProps = {
  company: string;
  role: string;
  period: string;
  highlights: readonly string[];
};

export const CareerEntry = ({
  company,
  role,
  period,
  highlights,
}: CareerEntryProps) => (
  <div className="border-l-2 border-border pl-4 py-2">
    <div className="flex items-start justify-between gap-4 mb-1">
      <h3 className="text-foreground font-medium">{company}</h3>
      <span className="text-muted-foreground text-xs shrink-0">{period}</span>
    </div>
    <p className="text-muted-foreground text-sm mb-2">{role}</p>
    <ul className="flex flex-col gap-1">
      {highlights.map((item) => (
        <li key={item} className="text-muted-foreground text-sm">
          <span className="text-accent-soft mr-2">{"~"}</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);
