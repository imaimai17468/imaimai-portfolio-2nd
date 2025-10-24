"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceContent } from "./workspace-content";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceProps {
  initialComponentId?: string;
}

export function Workspace({ initialComponentId }: WorkspaceProps) {
  const {
    selectedComponent,
    filteredComponents,
    selectedComponentId,
    searchQuery,
    activeTab,
    setSelectedComponentId,
    setSearchQuery,
    setActiveTab,
  } = useWorkspace(initialComponentId);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* サイドバー */}
        <WorkspaceSidebar
          components={filteredComponents}
          selectedId={selectedComponentId}
          onSelectComponent={(id) => {
            setSelectedComponentId(id);
            setActiveTab("preview"); // Reset to preview tab when selecting a component
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* メインコンテンツ */}
        <div className="flex flex-1 flex-col">
          {/* モバイル用トリガー */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background p-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Component Showcase</h2>
          </div>

          {/* コンテンツエリア */}
          {selectedComponent ? (
            <WorkspaceContent component={selectedComponent} activeTab={activeTab} onTabChange={setActiveTab} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Welcome to Workspace</h2>
                <p className="mt-2 text-muted-foreground">Select a component from the sidebar to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
