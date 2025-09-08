export default function VehicleCard({ id, name, eta, selected, onSelect, children }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition
        ${selected ? "bg-brand-accent/60 ring-2 ring-brand-highlight" : "bg-brand-card hover:bg-brand-accent"}
        border border-brand-border text-left`}
    >
      <div className="shrink-0 p-2 rounded-lg bg-black/40 text-white">{children}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-brand-muted">{eta}</p>
        </div>
      </div>
    </button>
  );
}
