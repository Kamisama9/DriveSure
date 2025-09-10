// src/components/Driver_Modules/Trips.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/trips")
      .then((res) => setTrips(res.data.trips))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading your trips…</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {trips.map((t) => (
        <div
          key={t.tripId}
          className="bg-white shadow-lg rounded-lg p-6 space-y-2"
        >
          <h2 className="text-xl font-semibold">Trip ID: {t.tripId}</h2>
          <p>
            <span className="font-medium">Rider:</span> {t.riderName}
          </p>
          <p>
            <span className="font-medium">From:</span> {t.pickup_location}
          </p>
          <p>
            <span className="font-medium">To:</span> {t.dropoff_location}
          </p>
          <p>
            <span className="font-medium">Start:</span>{" "}
            {new Date(t.start_time).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">End:</span>{" "}
            {new Date(t.end_time).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Distance:</span> {t.distance_km} km
          </p>
          <p>
            <span className="font-medium">Fare:</span> ₹{t.fare}
          </p>
          <p>
            <span className="font-medium">Status:</span> {t.status}
          </p>
        </div>
      ))}
      {trips.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          No trips found.
        </div>
      )}
    </div>
  );
}
export default DriverTrips;