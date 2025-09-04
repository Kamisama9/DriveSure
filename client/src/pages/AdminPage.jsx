import { useState } from "react";
import AdminSideBar from "../components/Admin_Modules/Sidebar";
import ManageRiders from "../components/Admin_Modules/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/ManageDrivers";

const AdminPage = () => {
  const [selection, setSelection] = useState(null); // default

  return (
    <div className="font-sans min-h-screen flex flex-col md:flex-row h-[100vh] bg-white">
      <AdminSideBar onSelect={setSelection} />
      <main className="bg-gray-100 flex-1 p-4 md:p-6 overflow-y-auto">
        {selection === "riderBoard" && <ManageRiders />}
        {selection === "driverBoard" && <ManageDrivers />}
      </main>
    </div>
  );
};

export default AdminPage;