import { useEffect, useState } from "react";

const filterOptions = [
  { label: "PAN", value: "pan_card" },
  { label: "Aadhaar", value: "aadhar_card" },
  { label: "Driver License", value: "driver_license" },
];

const ManageDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [filterType, setFilterType] = useState(filterOptions[0].value);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const driversPerPage = 9;

    const fetchData = async () => {
        const driversRes = await fetch("http://localhost:3006/drivers");
        const driversData = await driversRes.json();

        const enrichedDrivers = await Promise.all(
            driversData.map(async (driver) => {
            const userRes = await fetch(`http://localhost:3006/users/${driver.user_id}`);
            const userData = await userRes.json();

            return {
                ...driver,
                full_name: `${userData.first_name} ${userData.middle_name || ""} ${userData.last_name}`.trim(),
                email: userData.email,
                phone_number: userData.phone_number
            };
            })
        );

        const filteredDrivers =
            searchTerm.trim() === ""
            ? enrichedDrivers
            : enrichedDrivers.filter((driver) =>
                driver[filterType]?.toLowerCase().includes(searchTerm.toLowerCase())
                );

        setDrivers(filteredDrivers);
        setCurrentPage(1);
    };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchData();
    }
  }, [searchTerm]);

  // Pagination
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(drivers.length / driversPerPage);

  return (
    <div className="p-4 flex flex-col h-full min-h-[500px] relative pb-20">
      {/* Filter UI - keep as is */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        >
          {filterOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterOptions.find(opt => opt.value === filterType)?.label}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded flex-grow bg-white text-black placeholder-gray-400 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
        />

        <button
          onClick={fetchData}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Results - fixed height cards */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-grow">
        {currentDrivers.map((driver) => (
          <li key={driver.id} className="p-3 border rounded bg-white shadow text-black text-sm h-[140px] flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-bold text-base truncate">{driver.full_name}</h3>
            <div className="grid grid-cols-1 gap-y-0.5 mt-1">
              <p className="truncate"><span className="font-medium">License:</span> {driver.driver_license}</p>
              <p className="truncate"><span className="font-medium">Expiry:</span> {driver.driver_license_expiry}</p>
              <p className="truncate"><span className="font-medium">PAN:</span> {driver.pan_card}</p>
              <p className="truncate"><span className="font-medium">Aadhaar:</span> {driver.aadhar_card}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls - Fixed at bottom with gray background */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 fixed bottom-0 left-50 right-0 py-4 z-10 bg-gray-100 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded min-w-[2rem] ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDrivers;
