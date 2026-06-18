import { ActivitiesSection } from "./activities-section";
import { CareerSection } from "./career-section";
import { HeroSection } from "./hero-section";
import { ProductsSection } from "./products-section";
import { ScopeCursor } from "./scope-cursor";
import { SymbolGridBackground } from "./symbol-grid-background";

export const Top: React.FC = () => {
  return (
    <>
      <ScopeCursor />
      <SymbolGridBackground />
      <div className="relative z-10 max-w-2xl mx-auto pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <HeroSection />
        <CareerSection />
        <ActivitiesSection />
        <ProductsSection />
      </div>
    </>
  );
};
