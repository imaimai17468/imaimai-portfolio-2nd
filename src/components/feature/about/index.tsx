import { ScrollCounts } from "@/components/parts/scroll-counts";
import { History } from "./history";
import { AboutLayout } from "./layout";
import { Profile } from "./profile";
import { Thanks } from "./thanks";

export const About: React.FC = () => {
  return (
    <AboutLayout>
      <Profile />
      <History />
      <Thanks />
      <ScrollCounts />
    </AboutLayout>
  );
};
