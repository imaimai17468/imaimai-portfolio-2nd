import { SectionIndexContainer } from "./components/SectionIndex/SectionIndex.container";
import { Hero } from "./components/Hero/Hero";
import { Activities } from "./components/Activities/Activities";
import { Products } from "./components/Products/Products";
import { Career } from "./components/Career/Career";
import { Education } from "./components/Education/Education";
import { Skills } from "./components/Skills/Skills";
import { Talks } from "./components/Talks/Talks";
import { Footer } from "./components/Footer/Footer";

export default function Home() {
  return (
    <>
      <SectionIndexContainer />
      <main className="md:ml-56">
        <Hero />
        <div className="border-t border-border mx-6" />
        <Activities />
        <div className="border-t border-border mx-6" />
        <Products />
        <div className="border-t border-border mx-6" />
        <Career />
        <div className="border-t border-border mx-6" />
        <Education />
        <div className="border-t border-border mx-6" />
        <Skills />
        <div className="border-t border-border mx-6" />
        <Talks />
        <Footer />
      </main>
    </>
  );
}
