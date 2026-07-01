import Link from "next/link";

const PROJECTS = [
  { title: "wbsb", url: "https://wbsb.dev" },
  { title: "Osampo", url: "https://osampo.vercel.app" },
  { title: "ツウキンプレイス", url: "https://tsuukin-place.com" },
  {
    title: "Contrast Color Palette",
    url: "https://contrast-color-palette.vercel.app",
  },
  {
    title: "Digital Agency Icons",
    url: "https://digital-agency-icons-docs.vercel.app",
  },
  { title: "imaimai UI", url: "https://imaimai-ui.vercel.app" },
  {
    title: "木更津高専単位カウンター",
    url: "https://credits-counter-fo-knct.vercel.app",
  },
];

export const ProjectsSection: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted-foreground tracking-wider mb-6">
        PROJECTS
      </h2>
      <ul className="space-y-3">
        {PROJECTS.map((project) => (
          <li key={project.url}>
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-sm text-accent hover:text-accent-hover focus-visible:underline focus-visible:outline-hidden transition-colors"
            >
              {project.title}
              <span className="text-muted-foreground text-xs">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
