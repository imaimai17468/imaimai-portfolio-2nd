import { skills } from "@/app/data/skills";

export const Skills = () => (
  <section id="06-skills" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      06. skills
    </h2>
    <ul className="flex flex-wrap gap-3">
      {skills.map((skill) => (
        <li
          key={skill}
          className="text-muted-foreground text-sm border border-border rounded px-3 py-1"
        >
          <span className="text-accent-soft mr-1">{"~"}</span>
          {skill}
        </li>
      ))}
    </ul>
  </section>
);
