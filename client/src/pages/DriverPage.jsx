// src/pages/DriverPage.jsx
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../store/store.js";
import Sidebar from "../components/Sidebar/Sidebar";
import DriverTrips from "../components/Driver_Modules/Trips.jsx";
import DriverBooking from "../components/Driver_Modules/DriverBookings";



const driverNavItems = [
 { id: 'bookings', label: 'My Bookings', icon: '📖' },
  { id: 'vehicles', label: 'Manage Vehicles', icon: '🚗' },
  { id: 'liveBookings', label: 'Live Bookings', icon: '📡' },
  { id: 'feedback', label: 'Feedback & Grievances', icon: '💬' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'account', label: 'Manage Account', icon: '⚙️' },
];

export default function DriverPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const setUser = useStore((s) => s.setUser);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout"); // calls your server’s /logout
      setUser(null); // clear client state
      navigate("/auth"); // send back to login
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  };

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

     {activeSection === 'bookings' && <DriverBooking />}
      {activeSection === 'vehicles' && <ManageVehicles />}
      {activeSection === 'liveBookings' && <LiveBookings />}
      {activeSection === 'feedback' && <Feedback />}
      {activeSection === 'verification' && <Verification />}
      {activeSection === 'account' && <ManageAccount />}
    </Sidebar>
  );
}
