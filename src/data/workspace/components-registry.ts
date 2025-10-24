import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import type { ComponentType } from "react";
import type { ComponentCategory, ComponentMetadata, ComponentRegistry } from "./component-metadata";
import {
  multiSelectComboboxCodeExamples,
  multiSelectComboboxProps,
  multiSelectComboboxUsageExamples,
} from "./examples/multi-select-combobox-examples";

/**
 * コンポーネントレジストリ
 * 新しいコンポーネントを追加する際は、このオブジェクトに追加してください
 */
export const componentsRegistry: ComponentRegistry = {
  multiSelectCombobox: {
    id: "multiSelectCombobox",
    name: "Multi-Select Combobox",
    category: "UI Elements",
    description:
      "shadcn/uiベースのマルチセレクトコンボボックス。検索機能付きで、選択したアイテムはPill（バッジ）として表示され、個別に削除可能。",
    tags: ["Form", "Input", "Select", "Multi-Select", "Search", "shadcn/ui"],
    component: MultiSelectCombobox as unknown as ComponentType<unknown>,
    defaultProps: {
      options: [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "angular", label: "Angular" },
        { value: "svelte", label: "Svelte" },
        { value: "solid", label: "Solid" },
      ],
      selected: ["react", "vue"],
      onChange: () => {},
    },
    props: multiSelectComboboxProps,
    codeExamples: multiSelectComboboxCodeExamples,
    usageExamples: multiSelectComboboxUsageExamples,
    version: "1.0.0",
    author: "imaimai17468",
    createdAt: "2025-10-24",
    updatedAt: "2025-10-24",
    sourceFile: "/src/components/ui/multi-select-combobox.tsx",
    dependencies: ["lucide-react"],
    previewConfig: {
      containerHeight: "400px",
      centered: true,
    },
  },
};

/**
 * IDでコンポーネントを取得
 */
export const getComponentById = (id: string): ComponentMetadata | undefined => componentsRegistry[id];

/**
 * すべてのコンポーネントを取得
 */
export const getAllComponents = (): ComponentMetadata[] => Object.values(componentsRegistry);

/**
 * カテゴリでコンポーネントをフィルタ
 */
export const getComponentsByCategory = (category: ComponentCategory): ComponentMetadata[] =>
  getAllComponents().filter((comp) => comp.category === category);

/**
 * コンポーネントを検索
 */
export const searchComponents = (query: string): ComponentMetadata[] =>
  getAllComponents().filter(
    (comp) =>
      comp.name.toLowerCase().includes(query.toLowerCase()) ||
      comp.description.toLowerCase().includes(query.toLowerCase()) ||
      comp.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  );
