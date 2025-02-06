"use client";

import { useQueryState } from "nuqs";
import { BackgroundAnimation } from "./background-animation";
import { WORKS } from "./const";
import { Menu } from "./menu";

export const Works: React.FC = () => {
  const [work, setWork] = useQueryState("work", { defaultValue: WORKS[0].title });

  return (
    <div>
      <BackgroundAnimation currentWork={work} />
      <Menu work={work} setWork={setWork} />
    </div>
  );
};
