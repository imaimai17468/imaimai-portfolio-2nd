import { HistorySection } from "@/components/feature/top/history-section";
import { BlockPage } from "@/components/shared/block-page/BlockPage";

export default function Page() {
  return (
    <BlockPage blockKey="history">
      <HistorySection />
    </BlockPage>
  );
}
