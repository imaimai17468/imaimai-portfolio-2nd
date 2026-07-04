import { ProjectsSection } from "@/components/feature/top/projects-section";
import { BlockPage } from "@/components/shared/block-page/BlockPage";

export default function Page() {
  return (
    <BlockPage blockKey="projects">
      <ProjectsSection />
    </BlockPage>
  );
}
