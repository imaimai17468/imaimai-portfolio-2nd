"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentMetadata } from "@/data/workspace/component-metadata";
import { Copy } from "lucide-react";
import { useState } from "react";

interface WorkspaceContentProps {
  component: ComponentMetadata;
  activeTab: "preview" | "code" | "examples" | "props";
  onTabChange: (tab: "preview" | "code" | "examples" | "props") => void;
}

export function WorkspaceContent({ component, activeTab, onTabChange }: WorkspaceContentProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const Component = component.component;

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">{component.name}</h1>
        <p className="mt-2 text-muted-foreground">{component.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {component.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* タブナビゲーション */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as "preview" | "code" | "examples" | "props")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
        </TabsList>

        {/* プレビュー */}
        <TabsContent value="preview" className="mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="relative bg-[hsl(var(--workspace-preview))]"
                style={{
                  height: component.previewConfig?.containerHeight || "500px",
                  backgroundColor: component.previewConfig?.backgroundColor || undefined,
                }}
              >
                <Component {...(component.defaultProps || {})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* コード */}
        <TabsContent value="code" className="mt-6">
          <div className="space-y-4">
            {component.codeExamples.map((example, index) => (
              <Card key={`code-${example.title}-${index}`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 z-10"
                      onClick={() => handleCopy(example.code, index)}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </Button>
                    <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-sm">
                      <code className="text-[#d4d4d4]">{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 使用例 */}
        <TabsContent value="examples" className="mt-6">
          <div className="space-y-4">
            {component.usageExamples.map((example, index) => (
              <Card key={`example-${example.title}-${index}`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 z-10"
                      onClick={() => handleCopy(example.code, index + 100)}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedIndex === index + 100 ? "Copied!" : "Copy"}
                    </Button>
                    <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-sm">
                      <code className="text-[#d4d4d4]">{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Props */}
        <TabsContent value="props" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-semibold">Name</th>
                      <th className="p-2 text-left font-semibold">Type</th>
                      <th className="p-2 text-left font-semibold">Default</th>
                      <th className="p-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {component.props.map((prop) => (
                      <tr key={prop.name} className="border-b last:border-0">
                        <td className="p-2 font-mono text-sm">
                          {prop.name}
                          {prop.required && <span className="ml-1 text-red-500">*</span>}
                        </td>
                        <td className="p-2 font-mono text-sm text-muted-foreground">{prop.type}</td>
                        <td className="p-2 font-mono text-sm text-muted-foreground">
                          {prop.defaultValue?.toString() || "-"}
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
