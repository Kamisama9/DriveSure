import { useState } from 'react';
import Booking from "../components/RiderModules/Booking";
import Sidebar from "../components/Sidebar/sidebar";
import Feedback from '../components/RiderModules/Feedback';

const RiderPage=()=>{
  const [activeSection, setActiveSection] = useState('dashboard');
    return (
    <Sidebar activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === 'dashboard' && <Booking />}
      {activeSection === 'orders' && <Feedback />}
      {activeSection === 'profile' && <Profile />}
    </Sidebar>
    )
}

export default RiderPage;