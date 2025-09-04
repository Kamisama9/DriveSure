import { useState } from "react";
import { bookings } from "../../data/booking";

export default function Booking() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter((booking) =>
    booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.booking_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by pickup, dropoff, status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border text-black border-black rounded-md"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white  border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border-b text-black">Pickup</th>
              <th className="text-left p-2 border-b text-black">Dropoff</th>
              <th className="text-left p-2 border-b text-black">Status</th>
              <th className="text-left p-2 border-b text-black">Payment</th>
              <th className="text-left p-2 border-b text-black">Fare</th>
              <th className="text-left p-2 border-b text-black">Distance</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="p-2 border-b text-black">{booking.pickup}</td>
                <td className="p-2 border-b text-black">{booking.dropoff}</td>
                <td className="p-2 border-b capitalize text-black">{booking.booking_status}</td>
                <td className="p-2 border-b capitalize text-black">{booking.payment_status}</td>
                <td className="p-2 border-b text-black">{booking.fare ? `$${booking.fare}` : "N/A"}</td>
                <td className="p-2 border-b text-black">{booking.distance ? `${booking.distance} km` : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

