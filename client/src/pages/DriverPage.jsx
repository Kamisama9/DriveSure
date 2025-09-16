// src/pages/DriverPage.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ManageAccount from "../components/Rider_Modules/ManageAccount.jsx";
import ManageVehicles from "../components/Driver_Modules/Vehicles/ManageVehicles.jsx";
import Bookings from "../components/common/Bookings/Bookings.jsx";

const driverNavItems = [
	{ id: "bookings", label: "My Bookings", icon: "📖" },
	{ id: "vehicles", label: "Manage Vehicles", icon: "🚗" },
	{ id: "liveBookings", label: "Live Bookings", icon: "📡" },
	{ id: "feedback", label: "Feedback & Grievances", icon: "💬" },
	{ id: "verification", label: "Verification", icon: "✅" },
	{ id: "account", label: "Manage Account", icon: "⚙️" },
];
const DriverPage = () => {
	const [activeSection, setActiveSection] = useState("bookings");

	return (
		<Sidebar
			activeSection={activeSection}
			setActiveSection={setActiveSection}
			navItems={driverNavItems}
		>
			{activeSection === "bookings" && <Bookings />}
			{activeSection === "vehicles" && <ManageVehicles />}
			{activeSection === "liveBookings" && <LiveBookings />}
			{activeSection === "feedback" && <Feedback />}
			{activeSection === "verification" && <Verification />}
			{activeSection === "account" && <ManageAccount />}
		</Sidebar>
	);
};

export default DriverPage;
