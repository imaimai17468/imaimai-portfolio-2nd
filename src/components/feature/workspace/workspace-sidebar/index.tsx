"use client";

import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ComponentMetadata } from "@/data/workspace/component-metadata";
import { Search } from "lucide-react";

interface WorkspaceSidebarProps {
  components: ComponentMetadata[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function WorkspaceSidebar({
  components,
  selectedId,
  onSelectComponent,
  searchQuery,
  onSearchChange,
}: WorkspaceSidebarProps) {
  // カテゴリごとにグループ化
  const groupedComponents = components.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, ComponentMetadata[]>,
  );

  return (
    <Sidebar className="border-r border-[hsl(var(--workspace-border-subtle))]">
      <SidebarContent>
        {/* 検索ボックス */}
        <SidebarGroup>
          <SidebarGroupLabel>Search Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="relative px-3">
              <Search className="absolute left-5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* コンポーネントリスト */}
        {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categoryComponents.map((component) => (
                  <SidebarMenuItem key={component.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectComponent(component.id)}
                      isActive={selectedId === component.id}
                      tooltip={component.description}
                    >
                      <span>{component.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
