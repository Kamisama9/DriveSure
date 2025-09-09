/* global google */
import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

import VehicleCard from "./VehicleCard";
import MapView from "./MapView";
import PaymentSection from "./PaymentSection";
import PromoSection from "./PromoSection";
import InputSection from "./InputSection";

// ------------------ Icons ------------------
function IconBike(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5h13" />
      <path d="M12 6l-1.5 4h3z" />
    </svg>
  );
}

function IconAuto(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function IconCar(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

// ------------------ Constants ------------------
const VEHICLES = [
  { id: "bike", name: "Bike", icon: IconBike, base: 20, perKm: 8, eta: "2 min" },
  { id: "auto", name: "Auto", icon: IconAuto, base: 30, perKm: 12, eta: "4 min" },
  { id: "car", name: "Car", icon: IconCar, base: 50, perKm: 15, eta: "6 min" },
];

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1d1d1d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#eaeaea" }] },
];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function estimateFare(distance, vehicle) {
  if (!distance || !vehicle) return 0;
  const v = VEHICLES.find((x) => x.id === vehicle);
  return v.base + v.perKm * distance;
}

// ------------------ Component ------------------
export default function Booking() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // --- State ---
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [center, setCenter] = useState({ lat: 28.61, lng: 77.23 }); // default Delhi
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [payment, setPayment] = useState("cash");
  const [upiId, setUpiId] = useState("");
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [recent, setRecent] = useState([]);
  const [lastFocused, setLastFocused] = useState(null);
  const [directions, setDirections] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);

  // --- Refs ---
  const fromAutoRef = useRef(null);
  const toAutoRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(coords);
        setFromCoord(coords);
      });
    }
  }, []);

  useEffect(() => {
    if (fromCoord && toCoord && isLoaded) {
      const service = new google.maps.DirectionsService();
      service.route(
        { origin: fromCoord, destination: toCoord, travelMode: "DRIVING" },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
            const leg = result.routes[0].legs[0];
            setDistanceKm(leg.distance.value / 1000);
          }
        }
      );
    }
  }, [fromCoord, toCoord, isLoaded]);

  useEffect(() => {
    if (!fromCoord) return;
    const markers = [];
    for (let i = 0; i < 5; i++) {
      markers.push({
        lat: fromCoord.lat + (Math.random() - 0.5) * 0.01,
        lng: fromCoord.lng + (Math.random() - 0.5) * 0.01,
      });
    }
    setNearby(markers);
  }, [fromCoord]);

  // --- Handlers ---
  const onFromPlaceChanged = () => {
    const place = fromAutoRef.current.getPlace();
    if (place && place.geometry) {
      const loc = place.geometry.location;
      setFromCoord({ lat: loc.lat(), lng: loc.lng() });
      setFromText(place.formatted_address);
      addRecent(place.formatted_address);
    }
  };

  const onToPlaceChanged = () => {
    const place = toAutoRef.current.getPlace();
    if (place && place.geometry) {
      const loc = place.geometry.location;
      setToCoord({ lat: loc.lat(), lng: loc.lng() });
      setToText(place.formatted_address);
      addRecent(place.formatted_address);
    }
  };

  const handleUseCurrent = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setFromCoord(coords);
        setCenter(coords);
        setFromText("Current Location");
      });
    }
  };

  const handleSwap = () => {
    setFromText(toText);
    setToText(fromText);
    setFromCoord(toCoord);
    setToCoord(fromCoord);
  };

  const handleRecentClick = (place) => {
    if (lastFocused === "from") setFromText(place);
    else if (lastFocused === "to") setToText(place);
  };

  const handleApplyPromo = () => {
    if (promo) setAppliedPromo(promo);
  };

  const addRecent = (place) => {
    setRecent((prev) => {
      const updated = [place, ...prev.filter((p) => p !== place)];
      return updated.slice(0, 5);
    });
  };

  const fare = estimateFare(distanceKm, selectedVehicle);
  const finalFare = appliedPromo ? fare * 0.9 : fare; // 10% off promo

  // --- Map options ---
  const mapOptions = {
    styles: darkMapStyle,
    disableDefaultUI: true,
  };

  // --- UI ---
  return (
    <div className="h-auto w-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <aside className="md:w-[520px] w-full bg-brand-panel border-b md:border-b-0 md:border-r border-brand-border p-5 overflow-y-auto">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold">Book your Ride</h1>
          <p className="text-sm text-brand-muted">Plan your ride—fast and simple</p>
        </header>

        {/* From / To Inputs */}
        <InputSection
          isLoaded={isLoaded}
          fromText={fromText}
          toText={toText}
          setFromText={setFromText}
          setToText={setToText}
          fromAutoRef={fromAutoRef}
          toAutoRef={toAutoRef}
          onFromPlaceChanged={onFromPlaceChanged}
          onToPlaceChanged={onToPlaceChanged}
          handleUseCurrent={handleUseCurrent}
          handleSwap={handleSwap}
          recent={recent}
          handleRecentClick={handleRecentClick}
          setLastFocused={setLastFocused}
        />

        {/* Vehicles */}
        <div className="mb-4">
          <h2 className="text-sm text-brand-muted mb-2">Choose a ride</h2>
          <div className="space-y-2">
            {VEHICLES.map((v) => {
              const Icon = v.icon;
              return (
                <VehicleCard
                  key={v.id}
                  id={v.id}
                  name={v.name}
                  eta={v.eta}
                  selected={selectedVehicle === v.id}
                  onSelect={setSelectedVehicle}
                >
                  <Icon className="w-6 h-6" />
                </VehicleCard>
              );
            })}
          </div>
        </div>

        {/* Payment */}
        <PaymentSection
          payment={payment}
          setPayment={setPayment}
          upiId={upiId}
          setUpiId={setUpiId}
        />

        {/* Promo */}
        <PromoSection
          promo={promo}
          setPromo={setPromo}
          appliedPromo={appliedPromo}
          handleApplyPromo={handleApplyPromo}
        />

        {/* Fare + Confirm */}
        <div className="border-t border-brand-border  pt-4 mt-4">
          {selectedVehicle && distanceKm && (
            <p className="mb-2 text-brand-muted">
              Fare: {formatINR(finalFare)}{" "}
              {appliedPromo && <span className="text-green-500">(promo applied)</span>}
            </p>
          )}
          <button
            onClick={() => alert("Ride Confirmed 🚕")}
            disabled={!fromCoord || !toCoord || !selectedVehicle}
            className="w-full rounded-lg bg-brand-accent px-4 py-2 font-medium hover:bg-brand-highlight transition disabled:opacity-50"
          >
            Confirm Ride
          </button>
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative min-h-[320px]">
        <MapView
          isLoaded={isLoaded}
          loadError={loadError}
          center={center}
          mapOptions={mapOptions}
          fromCoord={fromCoord}
          toCoord={toCoord}
          directions={directions}
          nearby={nearby}
        />
      </main>
    </div>
  );
}
