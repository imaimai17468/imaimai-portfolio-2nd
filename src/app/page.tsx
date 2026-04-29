import { SectionIndexContainer } from "./components/SectionIndex/SectionIndex.container";
import { Hero } from "./components/Hero/Hero";
import { Activities } from "./components/Activities/Activities";
import { Products } from "./components/Products/Products";
import { Career } from "./components/Career/Career";
import { Education } from "./components/Education/Education";
import { Footer } from "./components/Footer/Footer";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl flex">
      <SectionIndexContainer />
      <main className="flex-1 mx-auto max-w-3xl">
        <Hero />
        <div className="border-t border-border mx-6" />
        <Activities />
        <div className="border-t border-border mx-6" />
        <Products />
        <div className="border-t border-border mx-6" />
        <section id="04-history" className="py-12 px-6">
          <h2 className="text-muted-foreground text-sm mb-6">
            <span className="text-accent">{"// "}</span>
            04. history
          </h2>
          <Career />
          <Education />
        </section>
        <Footer />
      </main>
    </div>
  );
}
