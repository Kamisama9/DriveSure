import { useEffect, useState } from "react";

const Booking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, openModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:4000/bookings" );
        const data = await response.json();
        console.log("Fetched bookings:", data);
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  //cors error fix
  useEffect(() => {
    if (modal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [modal]);


  const handleSearch = () => {
    return bookings.filter((booking) => {
      // Apply text search
      const matchesSearch = 
        booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropoff.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter;

      // Apply payment filter
      const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  };

  const filteredBookings = handleSearch();
  const paymentOptions = ["all", "paid", "pending", "refunded", "failed"];
  const statusOptions = ["all", "completed", "in_progress", "cancelled", "no_show"];

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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        >
          {
            statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "All" : opt.replace(/_/g, " ")}
              </option>
            ))
          }
        </select>

        {/* Payment Filter */}
        <label htmlFor="paymentFilter" className="text-sm text-gray-600">
          Payment
        </label>
        <select
          id="paymentFilter"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        >
          {
            paymentOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "All" : opt.replace(/_/g, " ")}
              </option>
            ))
          }
        </select>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded flex-grow bg-white text-black placeholder-gray-400 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
      />

      <button
        onClick={handleSearch}
        className="bg-[#ff4d30] text-white px-4 py-2 cursor-pointer rounded hover:bg-red-700 transition duration-300"
      >
        Search
      </button>
    </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <tbody>
            {filteredBookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="hover:bg-gray-50 cursor-pointer border-b border-gray-100" 
                onClick={() => {
                  setSelectedBooking(booking);
                  openModal(true);
                }}
              >
                <td className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">₹ {booking.fare || "0"}</span>
                          <span className="text-sm text-gray-600">{booking.payment_status === 'cash' ? 'Cash' : 'Online'}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          booking.booking_status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          booking.booking_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.booking_status.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(booking.created_at).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-400">{booking.id}</div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                          <p className="text-gray-700">{booking.pickup}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                          <p className="text-gray-700">{booking.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {
        modal&&<div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-128 md:w-150 max-h-[90vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-black">Booking Details</h2>
          {selectedBooking && (
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-medium text-gray-700">Pickup:</span> <span className="text-black">{selectedBooking.pickup}</span></div>
                  <div><span className="font-medium text-gray-700">Dropoff:</span> <span className="text-black">{selectedBooking.dropoff}</span></div>
                  <div><span className="font-medium text-gray-700">Status:</span> <span className="text-black capitalize">{selectedBooking.booking_status}</span></div>
                  <div><span className="font-medium text-gray-700">Created:</span> <span className="text-black">{new Date(selectedBooking.created_at).toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-medium text-gray-700">Payment Status:</span> <span className="text-black capitalize">{selectedBooking.payment_status}</span></div>
                  <div><span className="font-medium text-gray-700">Fare:</span> <span className="text-black">{selectedBooking.fare ? `$${selectedBooking.fare}` : "N/A"}</span></div>
                  <div><span className="font-medium text-gray-700">Distance:</span> <span className="text-black">{selectedBooking.distance ? `${selectedBooking.distance} km` : "N/A"}</span></div>
                </div>
              </div>
              {/* Driver Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-medium text-gray-700">Driver Name:</span> <span className="text-black">{selectedBooking.driver_name || "N/A"}</span></div>
                  <div><span className="font-medium text-gray-700">Driver Contact:</span> <span className="text-black">{selectedBooking.driver_contact || "N/A"}</span></div>
                </div>
            </div>
              {/* Vehicle Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-medium text-gray-700">Vehicle Model:</span> <span className="text-black">{selectedBooking.vehicle_model || "N/A"}</span></div>
                  <div><span className="font-medium text-gray-700">Vehicle Plate:</span> <span className="text-black">{selectedBooking.vehicle_plate || "N/A"}</span></div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => openModal(false)}
              className="bg-[#ff4d30] text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  );
}
export default Booking;