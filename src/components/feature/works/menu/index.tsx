"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { WORKS } from "../const";

export const Menu: React.FC = () => {
  const [work, setWork] = useQueryState("work", { defaultValue: WORKS[0].title });

  return (
    <div className="fixed top-4 left-4 w-[200px]">
      <Select value={work ?? ""} onValueChange={(value) => setWork(value)}>
        <SelectTrigger className="text-sm font-thin">
          <SelectValue placeholder="Select a work" />
        </SelectTrigger>
        <SelectContent>
          {WORKS.map((work) => (
            <SelectItem key={work.title} value={work.title} className="text-sm font-thin">
              {work.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
