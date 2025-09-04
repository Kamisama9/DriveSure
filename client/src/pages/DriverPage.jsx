import { useState } from "react";
import DriverBooking from "../components/DriverModules/DriverBookings";
import Sidebar from "../components/Sidebar/sidebar";


const driverNavItems = [
  { id: 'bookings', label: 'My Bookings', icon: '📖' },
  { id: 'vehicles', label: 'Manage Vehicles', icon: '🚗' },
  { id: 'liveBookings', label: 'Live Bookings', icon: '📡' },
  { id: 'feedback', label: 'Feedback & Grievances', icon: '💬' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'account', label: 'Manage Account', icon: '⚙️' },
];


const DriverPage=()=>{
    const [activeSection, setActiveSection] = useState('dashboard');
    return (
    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} navItems={driverNavItems}>
      {activeSection === 'dashboard' && <DriverBooking />}
      {activeSection === 'orders' && <Feedback />}
      {activeSection === 'profile' && <Profile />}
    </Sidebar>
    )
}

export default DriverPage;