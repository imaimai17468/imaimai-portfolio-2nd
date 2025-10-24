import type { CodeExample, PropDefinition, UsageExample } from "../component-metadata";

export const multiSelectComboboxProps: PropDefinition[] = [
  {
    name: "options",
    type: "MultiSelectOption[]",
    required: true,
    description: "選択可能なオプションの配列。各オプションはvalueとlabelを持つ",
  },
  {
    name: "selected",
    type: "string[]",
    required: true,
    description: "現在選択されているアイテムのvalue配列",
  },
  {
    name: "onChange",
    type: "(selected: string[]) => void",
    required: true,
    description: "選択状態が変更された時に呼ばれるコールバック関数",
  },
  {
    name: "placeholder",
    type: "string",
    required: false,
    defaultValue: "Select items...",
    description: "何も選択されていない時に表示されるプレースホルダー",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    required: false,
    defaultValue: "Search...",
    description: "検索入力欄のプレースホルダー",
  },
  {
    name: "className",
    type: "string",
    required: false,
    description: "コンポーネントのルート要素に適用される追加のCSSクラス",
  },
];

export const multiSelectComboboxCodeExamples: CodeExample[] = [
  {
    title: "基本的な使い方",
    description: "フルーツを選択できるシンプルなマルチセレクトコンボボックス",
    language: "tsx",
    code: `import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { useState } from 'react';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
];

export function FruitSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MultiSelectCombobox
      options={fruits}
      selected={selected}
      onChange={setSelected}
      placeholder="Select fruits..."
      searchPlaceholder="Search fruits..."
    />
  );
}`,
  },
  {
    title: "カスタムプレースホルダー",
    description: "プレースホルダーをカスタマイズした例",
    language: "tsx",
    code: `import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { useState } from 'react';

const technologies = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

export function TechSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MultiSelectCombobox
      options={technologies}
      selected={selected}
      onChange={setSelected}
      placeholder="技術スタックを選択..."
      searchPlaceholder="技術を検索..."
      className="max-w-md"
    />
  );
}`,
  },
  {
    title: "初期値を設定",
    description: "デフォルトで選択されているアイテムがある例",
    language: "tsx",
    code: `import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { useState } from 'react';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'astro', label: 'Astro' },
];

export function FrameworkSelector() {
  const [selected, setSelected] = useState<string[]>(['next', 'remix']);

  return (
    <MultiSelectCombobox
      options={frameworks}
      selected={selected}
      onChange={setSelected}
    />
  );
}`,
  },
];

export const multiSelectComboboxUsageExamples: UsageExample[] = [
  {
    title: "フォーム内で使用",
    description: "React Hook Formと組み合わせてフォームで使用する例",
    code: `<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <label htmlFor="skills" className="text-sm font-medium">
      スキルを選択
    </label>
    <MultiSelectCombobox
      options={skillOptions}
      selected={selectedSkills}
      onChange={setSelectedSkills}
      placeholder="スキルを選択..."
    />
  </div>
  <button type="submit">送信</button>
</form>`,
  },
  {
    title: "データフィルタリング",
    description: "選択したアイテムを使ってデータをフィルタリングする例",
    code: `const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

const filteredItems = items.filter(item =>
  selectedCategories.length === 0 ||
  selectedCategories.includes(item.category)
);

return (
  <div>
    <MultiSelectCombobox
      options={categoryOptions}
      selected={selectedCategories}
      onChange={setSelectedCategories}
      placeholder="カテゴリでフィルター..."
    />
    <div className="mt-4 space-y-2">
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  </div>
);`,
  },
];
