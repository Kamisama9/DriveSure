export default function RecentPlaces({ recent, handleRecentClick }) {
  if (!recent.length) return null;

  return (
    <div className="mb-4">
      <h2 className="text-sm text-brand-muted mb-2">Recent Places</h2>
      <div className="flex flex-wrap gap-2">
        {recent.map((place, i) => (
          <button
            key={i}
            onClick={() => handleRecentClick(place)}
            className="px-3 py-1 rounded-full border border-brand-border bg-brand-card text-sm hover:bg-brand-accent"
          >
            {place}
          </button>
        ))}
      </div>
    </div>
  );
}
