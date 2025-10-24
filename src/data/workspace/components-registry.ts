import Hyperspeed from "@/blocks/Backgrounds/Hyperspeed/Hyperspeed";
import type { ComponentCategory, ComponentMetadata, ComponentRegistry } from "./component-metadata";
import { hyperspeedCodeExamples, hyperspeedProps, hyperspeedUsageExamples } from "./examples/hyperspeed-examples";

/**
 * コンポーネントレジストリ
 * 新しいコンポーネントを追加する際は、このオブジェクトに追加してください
 */
export const componentsRegistry: ComponentRegistry = {
  hyperspeed: {
    id: "hyperspeed",
    name: "Hyperspeed",
    category: "Backgrounds",
    description:
      "Three.jsを使用した高性能な3D道路アニメーションエフェクト。カスタマイズ可能なディストーションとライティング。",
    tags: ["3D", "Animation", "Background", "Three.js", "WebGL"],
    component: Hyperspeed,
    defaultProps: {},
    props: hyperspeedProps,
    codeExamples: hyperspeedCodeExamples,
    usageExamples: hyperspeedUsageExamples,
    version: "1.0.0",
    author: "imaimai17468",
    createdAt: "2024-12-18",
    updatedAt: "2024-12-18",
    sourceFile: "/src/blocks/Backgrounds/Hyperspeed/Hyperspeed.tsx",
    dependencies: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing"],
    previewConfig: {
      containerHeight: "500px",
      backgroundColor: "#000000",
      centered: false,
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
