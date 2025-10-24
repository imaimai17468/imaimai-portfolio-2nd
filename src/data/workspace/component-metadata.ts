/**
 * コンポーネントメタデータの型定義
 */

import type { ComponentType } from "react";

/**
 * Props定義
 */
export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  description: string;
}

/**
 * コード例
 */
export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: "tsx" | "jsx" | "typescript" | "javascript";
}

/**
 * 使用例
 */
export interface UsageExample {
  title: string;
  description: string;
  code: string;
  preview?: ComponentType; // オプション: ライブプレビューコンポーネント
}

/**
 * コンポーネントカテゴリ
 */
export type ComponentCategory =
  | "Backgrounds"
  | "Animations"
  | "UI Elements"
  | "Layouts"
  | "Effects"
  | "Forms"
  | "Navigation"
  | "Other";

/**
 * プレビュー設定
 */
export interface PreviewConfig {
  containerHeight?: string; // 例: '500px', '100vh'
  backgroundColor?: string;
  padding?: string;
  centered?: boolean;
}

/**
 * コンポーネントメタデータ
 */
export interface ComponentMetadata {
  id: string; // 一意の識別子 (例: 'hyperspeed')
  name: string; // 表示名 (例: 'Hyperspeed')
  category: ComponentCategory;
  description: string;
  tags: string[];

  // ショーケースするコンポーネント
  component: ComponentType<Record<string, unknown>>;
  defaultProps?: Record<string, unknown>;

  // ドキュメント
  props: PropDefinition[];
  codeExamples: CodeExample[];
  usageExamples: UsageExample[];

  // メタデータ
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;

  // ソース情報
  sourceFile: string; // ソースファイルへのパス
  dependencies: string[]; // 必要な依存関係

  // プレビュー設定
  previewConfig?: PreviewConfig;
}

/**
 * コンポーネントレジストリ
 */
export interface ComponentRegistry {
  [componentId: string]: ComponentMetadata;
}
