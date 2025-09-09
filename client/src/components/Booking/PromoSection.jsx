export default function PromoSection({ promo, setPromo, appliedPromo, handleApplyPromo }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm text-brand-muted mb-2">Promo code</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Enter code"
          className="flex-1 rounded-lg border border-brand-border bg-brand-card px-3 py-2"
        />
        <button
          onClick={handleApplyPromo}
          className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium hover:bg-brand-highlight transition"
        >
          Apply
        </button>
      </div>
      {appliedPromo && (
        <p className="mt-1 text-sm text-green-500">Applied: {appliedPromo}</p>
      )}
    </div>
  );
}
