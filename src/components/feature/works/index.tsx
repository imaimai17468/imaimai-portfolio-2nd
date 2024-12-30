import { BackgroundAnimation } from "./background-animation";
import { WorksLayout } from "./layout";
import { Menu } from "./menu";

export const Works: React.FC = () => {
  return (
    <WorksLayout>
      <BackgroundAnimation />
      <Menu />
    </WorksLayout>
  );
};
