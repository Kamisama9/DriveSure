import { useEffect, useState } from "react";
import { formatDateSafe } from "./DateUtil";

const VehicleCards = ({ ownerId, onClose }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const s = (v) => (v == null ? "" : String(v));
  const cap = (v) => (s(v) ? s(v).charAt(0).toUpperCase() + s(v).slice(1) : "—");

  useEffect(() => {
    if (!ownerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3007/vehicles", { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to load vehicles: ${res.status}`);

        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : payload?.vehicles ?? [];

        const filtered = list.filter((v) => s(v.owner_id) === s(ownerId));
        setVehicles(filtered);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load vehicles");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [ownerId]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Vehicles</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-blue-400 hover:text-white hover:bg-blue-500 text-white text-sm"
          >
            Back
          </button>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="rounded bg-blue-50 text-blue-700 px-3 py-2 text-sm mb-3">
          Loading vehicles…
        </div>
      )}

      {error && (
        <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm mb-3">
          {error}
        </div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <div className="rounded bg-gray-50 text-gray-700 px-3 py-2 text-sm">
          No vehicles found for this driver.
        </div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <ul className="space-y-7 flex-grow">
          {vehicles.map((v) => (
            <li
              key={v.id}
              className="p-2 border text-black rounded bg-white shadow cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="leading-6">
                  <p className="truncate">
                    <span className="font-medium">Type:</span> {cap(v.vehicle_type)}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">RC:</span> {s(v.rc_number) || "—"}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">PUC:</span> {s(v.puc_number) || "—"}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">PUC Expiry:</span> {s(v.puc_expiry) || "—"}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">PUC Expiry:</span> {s(v.insurance_policy_number) || "—"}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">Insurance Expiry:</span>{" "}
                    {formatDateSafe(v.insurance_expiry, {
                      locale: "en-IN",
                      timeZone: "Asia/Kolkata",
                      variant: "date",
                      fallback: "—",
                      assumeUTCForMySQL: true,
                    })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VehicleCards;