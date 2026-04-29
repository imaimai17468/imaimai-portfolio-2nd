import Link from "next/link";
import { activities } from "@/app/data/activities";

export const Activities = () => (
  <section id="02-activities" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      02. activities
    </h2>
    <div className="flex flex-col gap-3">
      {activities.map((item) => (
        <div
          key={item.name}
          className="border border-border rounded-md p-4 bg-card"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </Link>
              <p className="text-muted-foreground text-sm mt-1">
                {item.description}
              </p>
            </div>
            <span className="text-muted-foreground text-xs shrink-0">
              {">"}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
);
