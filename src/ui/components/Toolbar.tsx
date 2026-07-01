"use client";

import { useBuildingStore } from "@/stores/buildingStore";
import type { BuildTool } from "@/stores/buildingStore";

interface ToolDefinition {
  id: BuildTool;
  label: string;
  hint: string;
}

const TOOLS: ToolDefinition[] = [
  { id: "none", label: "Seleziona", hint: "Trascina per muovere la camera" },
  { id: "wall", label: "Muro", hint: "Clicca e trascina per costruire" },
];

export function Toolbar() {
  const activeTool = useBuildingStore((s) => s.activeTool);
  const setTool = useBuildingStore((s) => s.setTool);

  return (
    <aside className="flex h-full w-56 flex-col gap-2 border-r border-blue-night bg-bg-panel p-3">
      <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-text-secondary">
        Costruzione
      </h2>
      {TOOLS.map((tool) => {
        const isActive = tool.id === activeTool;
        return (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`rounded border px-3 py-2 text-left transition-colors ${
              isActive
                ? "border-green-monitor bg-blue-night text-green-monitor"
                : "border-blue-night bg-transparent text-text-primary hover:border-blue-night-light"
            }`}
          >
            <div className="font-mono text-sm">{tool.label}</div>
            <div className="text-xs text-text-secondary">{tool.hint}</div>
          </button>
        );
      })}
    </aside>
  );
}
