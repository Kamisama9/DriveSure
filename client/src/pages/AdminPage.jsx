import { useState } from "react";
import Sidebar from "../components/Sidebar/sidebar";

const adminNavItems = [
  { id: 'manageRider', label: 'Manage User/Rider', icon: '🧍' },
  { id: 'manageDriver', label: 'Manage User/Driver', icon: '🚕' },
  { id: 'manageVehicles', label: 'Manage User/Driver/Vehicles', icon: '🛠️' },
  { id: 'verifyDriver', label: 'Manage Verification/Driver', icon: '🧾' },
  { id: 'verifyVehicle', label: 'Manage Verification/Vehicle', icon: '🔍' },
  { id: 'feedback', label: 'Feedback & Grievances', icon: '💬' },
  { id: 'fare', label: 'Manage Fare', icon: '💰' },
];


const AdminPage=()=>{
    const [activeSection, setActiveSection] = useState('dashboard');
    return (
    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} navItems={adminNavItems}>
      {activeSection === 'dashboard' && <Booking />}
      {activeSection === 'orders' && <Feedback />}
      {activeSection === 'profile' && <Profile />}
    </Sidebar>
    )
}
export default AdminPage;