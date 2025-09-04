import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
 
// --- Inline SVG Icons (no extra deps) ---
const IconBike = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path stroke="currentColor" strokeWidth="2" d="M5 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm14 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM7 12l4-6h3l-2 4h4l2 3M7 12l2 3" />
  </svg>
);
 
const IconAuto = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path stroke="currentColor" strokeWidth="2" d="M3 14v-1a3 3 0 0 1 3-3h7l3 2h2a3 3 0 0 1 3 3v2h-2l-1 2h-2l-1-2H7l-1 2H4l-1-2H2v-1" />
  </svg>
);
 
const IconCar = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path stroke="currentColor" strokeWidth="2" d="M5 16l-1 2H3a1 1 0 0 1-1-1v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3a1 1 0 0 1-1 1h-1l-1-2H5Z" />
    <circle cx="7" cy="17" r="1.5" fill="currentColor" />
    <circle cx="17" cy="17" r="1.5" fill="currentColor" />
  </svg>
);
 
// --- Uber-like dark map style ---
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#b3b3b3" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1d1d1d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1115" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
];
 
// --- Reusable vehicle card ---
function VehicleCard({ id, name, eta, price, selected, onSelect, children }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition
        ${selected ? "bg-brand-accent/60 ring-2 ring-brand-highlight" : "bg-brand-card hover:bg-brand-accent"}
        border border-brand-border text-left`}
    >
      <div className="shrink-0 p-2 rounded-lg bg-black/40 text-white">
        {children}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-brand-muted">{eta}</p>
        </div>
        <p className="text-sm text-brand-muted">{price}</p>
      </div>
    </button>
  );
}
 
const VEHICLES = [
  { id: "bike", name: "Bike", eta: "3 min", price: "₹45–60", icon: IconBike },
  { id: "auto", name: "Auto", eta: "5 min", price: "₹70–90", icon: IconAuto },
  { id: "cab",  name: "Cab",  eta: "6 min", price: "₹120–150", icon: IconCar  },
];
 
export default function Cab() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
    // If you later want Places Autocomplete:
    // libraries: ["places"],
  });
 
  // Inputs and selection state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("auto");
 
  // Location state
  const [center, setCenter] = useState(null);
  const [locationError, setLocationError] = useState("");
 
  // On mount, get current geolocation
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        // For UX, default 'From' to current location text
        setFrom("Current location");
      },
      (err) => {
        setLocationError(err.message || "Unable to get your location.");
        // Fallback: India centroid (generic)
        setCenter({ lat: 20.5937, lng: 78.9629 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);
 
  const mapOptions = useMemo(() => ({
    styles: darkMapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy",
  }), []);
 
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };
 
  const handleUseCurrent = () => {
    setFrom("Current location");
  };
 
  const handleConfirm = () => {
    // Stub: Integrate with backend or navigation to checkout
    alert(`Booking requested:\nFrom: ${from || "—"}\nTo: ${to || "—"}\nVehicle: ${selectedVehicle}`);
  };
 
  return (
    <div className="h-screen w-screen flex bg-black text-white">
      {/* Left Panel */}
      <aside className="w-[600px] max-w-full bg-brand-panel border-r border-brand-border p-5 overflow-y-auto">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold">Book your Ride</h1>
          <p className="text-sm text-brand-muted">Plan your ride—fast and simple</p>
        </header>
 
        {/* From / To Inputs */}
        <div className="space-y-3 mb-4">
          <div className="bg-brand-card rounded-2xl p-4 border border-brand-border">
            <label className="text-xs text-brand-muted block mb-1">From</label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-black/40 border border-brand-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-highlight"
                placeholder="Enter pickup"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <button
                className="px-3 py-2 rounded-lg bg-brand-accent border border-brand-border hover:bg-black/30 text-sm"
                onClick={handleUseCurrent}
              >
                Use current
              </button>
            </div>
 
            <div className="flex items-center justify-between mt-3">
              <div className="w-1/2 pr-1">
                <label className="text-xs text-brand-muted block mb-1">To</label>
                <input
                  className="w-[405px] bg-black/40 border border-brand-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-highlight"
                  placeholder="Enter destination"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <button
                onClick={handleSwap}
                className="ml-2 mt-6 px-3 py-2 rounded-lg bg-brand-accent border border-brand-border hover:bg-black/30 text-sm"
                title="Swap From/To"
              >
                ⇅
              </button>
            </div>
          </div>
        </div>
 
        {/* Vehicle Options */}
        <div className="mb-4">
          <h2 className="text-sm text-brand-muted mb-2">Choose a ride</h2>
          <div className="space-y-2">
            {VEHICLES.map(v => {
              const Icon = v.icon;
              return (
                <VehicleCard
                  key={v.id}
                  id={v.id}
                  name={v.name}
                  eta={v.eta}
                  price={v.price}
                  selected={selectedVehicle === v.id}
                  onSelect={setSelectedVehicle}
                >
                  <Icon className="w-6 h-6" />
                </VehicleCard>
              );
            })}
          </div>
        </div>
 
        {/* Price summary + Confirm */}
        <div className="sticky  bg-brand-panel pt-2">
          <div className="bg-brand-card border border-brand-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-brand-muted">Estimated fare</p>
                <p className="text-lg font-semibold">
                  {
                    {
                      bike: "₹55",
                      auto: "₹85",
                      cab: "₹140",
                    }[selectedVehicle]
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-muted">ETA</p>
                <p className="text-lg font-semibold">
                  {
                    {
                      bike: "3 min",
                      auto: "5 min",
                      cab: "6 min",
                    }[selectedVehicle]
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full bg-[#ff4d31] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
              disabled={!from || !to}
              title={!from || !to ? "Enter From and To" : "Confirm ride"}
            >
              Confirm {selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)}
            </button>
          </div>
          {!!locationError && (
            <p className="text-xs text-red-400 mt-2">Location: {locationError}</p>
          )}
        </div>
      </aside>
 
      {/* Right: Map */}
      <main className="flex-1 relative">
        {!isLoaded ? (
          <div className="absolute inset-0 grid place-items-center text-brand-muted">
            Loading map…
          </div>
        ) : loadError ? (
          <div className="absolute inset-0 grid place-items-center text-red-400">
            Failed to load Google Maps.
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center || { lat: 20.5937, lng: 78.9629 }}
            zoom={center ? 15 : 5}
            options={mapOptions}
          >
            {center && (
              <Marker
                position={center}
                // Simple custom marker color
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#10B981",
                  fillOpacity: 1,
                  strokeColor: "#0b0b0b",
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        )}
      </main>
    </div>
  );
}