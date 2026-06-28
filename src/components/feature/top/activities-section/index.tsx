import { ExternalLink } from "lucide-react";
import Link from "next/link";

const ACTIVITIES = [
  { title: "しずかなインターネット", url: "https://sizu.me/imaimai17468" },
  { title: "Zenn", url: "https://zenn.dev/imaimai17468" },
  { title: "LAPRAS", url: "https://lapras.com/public/imaimai17468" },
];

export const ActivitiesSection: React.FC = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-sm text-muted-foreground tracking-wider mb-6">
        ACTIVITIES
      </h2>
      <ul className="space-y-3">
        {ACTIVITIES.map((activity) => (
          <li key={activity.url}>
            <Link
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-sm text-foreground/80"
            >
              {activity.title}
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
