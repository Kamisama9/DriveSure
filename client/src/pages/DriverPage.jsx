// src/pages/DriverPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../store/store.js";
import Sidebar from "../components/Sidebar/Sidebar";
import DriverTrips from "../components/Driver_Modules/Trips.jsx";

const driverNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "trips", label: "My Trips", icon: "🚗" },
  { id: "account", label: "Account", icon: "⚙️" },
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

      {activeSection === "dashboard" && <div>Driver Dashboard</div>}
      {activeSection === "trips" && <DriverTrips />}
      {activeSection === "account" && <div>Driver Account</div>}
    </Sidebar>
  );
}
