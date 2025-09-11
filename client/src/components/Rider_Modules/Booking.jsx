
import { useState } from "react";
import { bookings } from "../../data/booking";

const Booking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal,openModal]=useState(false);


  const filteredBookings = bookings.filter((booking) =>
    booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.booking_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  


  return (
    <div className="space-y-4">
      <div className={`${modal ? "opacity-50 pointer-events-none" : ""}`}>
       <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Status Filter */}
        <label htmlFor="statusFilter" className="text-sm text-gray-600">
          Status
        </label>
        <select
          id="statusFilter"
          // value={statusFilter}
          // onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        >
          {/* {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All" : opt.replace(/_/g, " ")}
            </option>
          ))} */}
        </select>

        {/* Payment Filter */}
        <label htmlFor="paymentFilter" className="text-sm text-gray-600">
          Payment
        </label>
        <select
          id="paymentFilter"
          // value={paymentFilter}
          // onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        >
          {/* {paymentOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All" : opt.replace(/_/g, " ")}
            </option> */}
          {/* ))} */}
        </select>

      <input
        type="text"
        // placeholder={`Search by ${filterOptions.find(opt => opt.value === filterType)?.label}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded flex-grow bg-white text-black placeholder-gray-400 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
      />

      <button
        // onClick={fetchRiders}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
      >
        Search
      </button>
    </div>

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
              <tr key={booking.id} className="hover:bg-gray-50" onClick={()=>openModal(true)}>
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
      {
        modal&&<div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4 text-black">Booking Details</h2>
          <p className="text-black">More details about the booking will go here.</p>
          <button
            onClick={() => openModal(false)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
      }
    </div>
  );
}
export default Booking;