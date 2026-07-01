import { useBuildingStore } from "@/stores/buildingStore";

export function Inspector() {
  const wallCount = useBuildingStore((s) => s.walls.size);

  return (
    <aside className="flex h-full w-64 flex-col gap-3 border-l border-blue-night bg-bg-panel p-3">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
        Ispettore
      </h2>
      <div className="rounded border border-blue-night p-3 text-sm text-text-secondary">
        Nessuna selezione.
      </div>
      <div className="mt-auto font-mono text-xs text-text-secondary">
        Muri costruiti: <span className="text-text-primary">{wallCount}</span>
      </div>
    </aside>
  );
}
