import { Autocomplete } from "@react-google-maps/api";

export default function InputSection({
  isLoaded,
  fromText,
  toText,
  setFromText,
  setToText,
  fromAutoRef,
  toAutoRef,
  onFromPlaceChanged,
  onToPlaceChanged,
  handleUseCurrent,
  handleSwap,
  recent,
  handleRecentClick,
  setLastFocused,
}) {
  return (
    <div className="mb-4">
      <h2 className="text-sm text-brand-muted mb-2">Trip Details</h2>
      <div className="space-y-2">
        {/* From */}
        <div className="relative">
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (fromAutoRef.current = ac)}
              onPlaceChanged={onFromPlaceChanged}
            >
              <input
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                onFocus={() => setLastFocused("from")}
                placeholder="From"
                className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
              />
            </Autocomplete>
          ) : (
            <input
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              placeholder="From"
              className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
            />
          )}
          <button
            onClick={handleUseCurrent}
            className="absolute right-2 top-2 text-xs px-2 py-1 rounded bg-brand-accent hover:bg-brand-highlight"
          >
            Use Current
          </button>
        </div>

        {/* To */}
        <div className="relative">
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (toAutoRef.current = ac)}
              onPlaceChanged={onToPlaceChanged}
            >
              <input
                value={toText}
                onChange={(e) => setToText(e.target.value)}
                onFocus={() => setLastFocused("to")}
                placeholder="To"
                className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
              />
            </Autocomplete>
          ) : (
            <input
              value={toText}
              onChange={(e) => setToText(e.target.value)}
              placeholder="To"
              className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
            />
          )}
          <button
            onClick={handleSwap}
            className="absolute right-2 top-2 text-xs px-2 py-1 rounded bg-brand-accent hover:bg-brand-highlight"
          >
            Swap
          </button>
        </div>
      </div>

      {/* Recent Places */}
      {recent?.length > 0 && (
        <div className="mt-3">
          <h3 className="text-sm text-brand-muted mb-1">Recent</h3>
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
      )}
    </div>
  );
}
