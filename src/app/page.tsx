import { Suspense } from "react";
import { HeroSection } from "@/components/feature/top/hero-section";

export default function Page() {
  return (
    <Suspense>
      <HeroSection />
    </Suspense>
  );
}
