import { Timeline } from "@/components/ui/timeline";

const data = [
  {
    title: "2024",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">section1</p>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">section2</p>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">section3</p>
      </div>
    ),
  },
];
export const History: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto font-light flex flex-col gap-16" aria-label="私のこれまで">
      <Timeline data={data} />
    </div>
  );
};
