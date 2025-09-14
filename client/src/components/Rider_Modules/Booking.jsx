import { useEffect, useState } from "react";

const Booking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, openModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [driverDetails, setDriverDetails] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);

  // Function to fetch driver details
  const fetchDriverDetails = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3006/drivers/${driverId}`);
      const data = await response.json();
      console.log("Fetched driver details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching driver details:", error);
      return null;
    }
  };

  // Function to fetch vehicle details
  const fetchVehicleDetails = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:3007/vehicles/${vehicleId}`);
      const data = await response.json();
      console.log("Fetched vehicle details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      return null;
    }
  };


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
                onClick={async () => {
                  setSelectedBooking(booking);
                  
                  // Fetch driver and vehicle details
                  if (booking.driver_id) {
                    const driver = await fetchDriverDetails(booking.driver_id);
                    setDriverDetails(driver);
                  }
                  
                  if (booking.vehicle_id) {
                    const vehicle = await fetchVehicleDetails(booking.vehicle_id);
                    setVehicleDetails(vehicle);
                  }
                  
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
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] flex flex-col relative z-10">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
              <button
                onClick={() => openModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedBooking && (
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trip Details */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-lg border border-orange-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Trip Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-gray-500">Pickup Location</p>
                            <p className="text-gray-800">{selectedBooking.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-gray-500">Drop Location</p>
                            <p className="text-gray-800">{selectedBooking.dropoff}</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Distance</span>
                            <span className="font-medium text-gray-800">
                              {selectedBooking.distance ? `${selectedBooking.distance} km` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-semibold text-gray-800">₹{selectedBooking.fare || "0"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${
                            selectedBooking.payment_status === 'paid' ? 'text-green-600' :
                            selectedBooking.payment_status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {selectedBooking.payment_status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver and Vehicle Details */}
                  <div className="space-y-4">
                    {/* Driver Details */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Driver Details</h3>
                      {driverDetails ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{driverDetails.name || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">License</p>
                              <p className="font-medium text-gray-800">{driverDetails.driver_license || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                            <div>
                              <p className="text-gray-500">ID Verification</p>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${driverDetails.is_aadhaar_verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="font-medium text-gray-800">
                                  {driverDetails.is_aadhaar_verified ? 'Verified' : 'Not Verified'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">Rating</p>
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 font-medium text-gray-800">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Loading driver details...</p>
                      )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Details</h3>
                      {vehicleDetails ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500 text-sm">RC</p>
                              <p className="font-medium text-gray-800">{vehicleDetails.rc_number || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Type</p>
                              <p className="font-medium text-gray-800">{vehicleDetails.vehicle_type || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Insurance</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${vehicleDetails.is_insurance_verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <span className="text-sm font-medium text-gray-700">
                                    {vehicleDetails.is_insurance_verified ? 'Valid' : 'Invalid'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Pollution Check</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${vehicleDetails.is_puc_verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <span className="text-sm font-medium text-gray-700">
                                    {vehicleDetails.is_puc_verified ? 'Valid' : 'Invalid'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Loading vehicle details...</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status Bar */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedBooking.booking_status === 'completed' ? 'bg-green-500' :
                        selectedBooking.booking_status === 'cancelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-700 capitalize">{selectedBooking.booking_status.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedBooking.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => openModal(false)}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Booking;