const SKILL_CATEGORIES = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C", "C++"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Solid", "Svelte", "Astro"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Hono"],
  },
  {
    label: "Infra",
    items: ["Supabase", "Cloudflare Workers"],
  },
  {
    label: "Tools",
    items: ["Git", "Figma"],
  },
];

export const SkillsSection: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted tracking-wider mb-8">SKILLS</h2>
      <div className="space-y-6">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.label}>
            <h3 className="text-xs text-muted tracking-wider uppercase mb-2">
              {category.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span key={item} className="text-sm text-background py-0.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
