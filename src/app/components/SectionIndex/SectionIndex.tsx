import Link from "next/link";

type SectionItem = {
  id: string;
  label: string;
};

type SectionIndexProps = {
  sections: SectionItem[];
  activeId: string | null;
};

export const SectionIndex = ({ sections, activeId }: SectionIndexProps) => (
  <aside className="hidden md:flex flex-col sticky top-0 h-screen w-56 shrink-0 border-r border-border px-4 py-8 gap-1 overflow-y-auto">
    <p className="text-muted-foreground text-xs mb-4">{"// index"}</p>
    {sections.map((section) => (
      <Link
        key={section.id}
        href={`#${section.id}`}
        className={`text-xs py-1 px-2 rounded transition-colors ${
          activeId === section.id
            ? "text-accent border-l-2 border-accent pl-2"
            : "text-muted-foreground hover:text-foreground border-l-2 border-transparent pl-2"
        }`}
      >
        {section.label}
      </Link>
    ))}
  </aside>
);
