import { useState } from 'react';
import Booking from "../components/Rider_Modules/Booking";
import Sidebar from "../components/Sidebar/Sidebar";
import Feedback from "../components/Rider_Modules/Feedback"

const riderNavItems = [
  { id: 'myBooking', label: 'My Bookings', icon: '📖' },
  { id: 'bookCab', label: 'Book a Cab', icon: '🚕' },
  { id: 'grievances', label: 'Grievances', icon: '💬' },
  { id: 'account', label: 'Manage Account', icon: '⚙️' },
];


const RiderPage=()=>{
  const [activeSection, setActiveSection] = useState('myBooking');
    return (
   
<Sidebar activeSection={activeSection} setActiveSection={setActiveSection} navItems={riderNavItems}>
      {activeSection === 'myBooking' && <Booking />}
      {activeSection === 'bookCab' && <Cab />} 
      {activeSection === 'grievances' && <Feedback />}
      {activeSection === 'account' && <Profile />} 
    </Sidebar>
    )
}

export default RiderPage;