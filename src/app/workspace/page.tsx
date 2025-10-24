import { Workspace } from "@/components/feature/workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace | Component Showcase",
  description: "カスタムUIコンポーネントとエフェクトを閲覧・探索できます",
};

export default function WorkspacePage() {
  return <Workspace />;
}
