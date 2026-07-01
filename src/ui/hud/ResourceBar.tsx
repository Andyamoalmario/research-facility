const PLACEHOLDER_RESOURCES = [
  { label: "Budget", value: "—", accent: "text-green-monitor" },
  { label: "Energia", value: "—", accent: "text-yellow-warning" },
  { label: "Personale", value: "—", accent: "text-text-primary" },
  { label: "Allarme", value: "Nessuno", accent: "text-text-secondary" },
];

export function ResourceBar() {
  return (
    <header className="flex h-12 items-center gap-6 border-b border-blue-night bg-bg-panel px-4">
      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
        Base di Ricerca
      </span>
      <div className="flex flex-1 items-center gap-6">
        {PLACEHOLDER_RESOURCES.map((r) => (
          <div key={r.label} className="flex items-baseline gap-2 font-mono text-sm">
            <span className="text-text-secondary">{r.label}</span>
            <span className={r.accent}>{r.value}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
