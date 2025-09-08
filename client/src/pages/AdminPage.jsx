import { useState } from "react";
import AdminSideBar from "../components/Admin_Modules/Sidebar";
import ManageRiders from "../components/Admin_Modules/Rider_Board/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/Driver_Board/ManageDrivers";
import ManageFare from "../components/Admin_Modules/Fare_Board/ManageFare";

const AdminPage = () => {
  const [selection, setSelection] = useState(null); // default

  return (
    <div className="font-sans min-h-screen flex flex-col md:flex-row h-[100vh] bg-white">
      <AdminSideBar onSelect={setSelection} />
      <main className="bg-gray-100 flex-1 p-4 md:p-6 overflow-y-auto">
        {selection === "riderBoard" && <ManageRiders />}
        {selection === "driverBoard" && <ManageDrivers />}
        {selection === "fare" && <ManageFare/>}
      </main>
    </div>
  );
};

export default AdminPage;