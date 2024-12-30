import { BackgroundAnimation } from "./background-animation";
import { WorksLayout } from "./layout";

export const Works: React.FC = () => {
  return (
    <WorksLayout>
      <BackgroundAnimation text="drei" backgroundImageSrc="/SurfaceImperfections003_1K_Normal.jpg" />
    </WorksLayout>
  );
};
