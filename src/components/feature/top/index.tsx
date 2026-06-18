import { AboutSection } from "./about-section";
import { ActivitiesSection } from "./activities-section";
import { HeroSection } from "./hero-section";
import { ProductsSection } from "./products-section";

export const Top: React.FC = () => {
  return (
    <div className="relative bg-zinc-950">
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <ProductsSection />
    </div>
  );
};
