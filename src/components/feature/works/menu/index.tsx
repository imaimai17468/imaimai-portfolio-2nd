"use client";
import { SnsLinkButton } from "@/components/parts/sns-link-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Calendar, User } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { WORKS } from "../const";

export const Menu: React.FC = () => {
  const [work, setWork] = useQueryState("work", { defaultValue: WORKS[0].title });
  const selectedWork = useMemo(() => WORKS.find((workItem) => workItem.title === work), [work]);

  return (
    <div>
      <div className="fixed top-4 left-4 w-[200px]">
        <Select value={work ?? ""} onValueChange={(value) => setWork(value)}>
          <SelectTrigger className="text-sm font-thin" aria-label="Select a work">
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
      <div className="p-2 sm:p-0 fixed bottom-4 sm:top-4 right-0 sm:right-4 font-light text-sm w-full sm:w-[300px] flex flex-col-reverse sm:flex-col gap-4">
        <div className="flex flex-col gap-2 bg-zinc-100/10 rounded-lg p-4 border border-zinc-100/10">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            {selectedWork?.people}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {selectedWork?.date}
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            {selectedWork?.role}
          </div>
          <div>{selectedWork?.description}</div>
        </div>
        <div>
          {selectedWork?.github && <SnsLinkButton href={selectedWork.github} type="github" />}
          {selectedWork?.url && <SnsLinkButton href={selectedWork.url} type="link" />}
          {selectedWork?.slide && <SnsLinkButton href={selectedWork.slide} type="slide" />}
        </div>
      </div>
    </div>
  );
};
