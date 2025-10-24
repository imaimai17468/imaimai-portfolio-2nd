"use client";

import { getAllComponents, getComponentById, searchComponents as searchFn } from "@/data/workspace/components-registry";
import { useMemo, useState } from "react";

type TabType = "preview" | "code" | "examples" | "props";

/**
 * Workspaceの状態管理フック
 */
export function useWorkspace(initialComponentId?: string) {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(initialComponentId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("preview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // すべてのコンポーネント
  const allComponents = useMemo(() => getAllComponents(), []);

  // フィルタされたコンポーネント
  const filteredComponents = useMemo(() => {
    let results = allComponents;

    if (searchQuery) {
      results = searchFn(searchQuery);
    }

    if (selectedCategory) {
      results = results.filter((comp) => comp.category === selectedCategory);
    }

    return results;
  }, [allComponents, searchQuery, selectedCategory]);

  // 選択されているコンポーネント
  const selectedComponent = useMemo(
    () => (selectedComponentId ? getComponentById(selectedComponentId) : null),
    [selectedComponentId],
  );

  return {
    // 状態
    selectedComponentId,
    selectedComponent,
    searchQuery,
    selectedCategory,
    activeTab,
    sidebarCollapsed,
    allComponents,
    filteredComponents,

    // アクション
    setSelectedComponentId,
    setSearchQuery,
    setSelectedCategory,
    setActiveTab,
    setSidebarCollapsed,
  };
}
