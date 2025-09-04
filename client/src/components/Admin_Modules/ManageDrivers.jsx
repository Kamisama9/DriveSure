import { useEffect, useState } from "react";

const ManageDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [filterType, setFilterType] = useState("pan_card");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const driversPerPage = 12;

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
    <div className="p-4">
      {/* Filter UI */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded bg-gray-300 text-gray-700"
        >
          <option value="pan card">PAN</option>
          <option value="aadhar card">Aadhaar</option>
          <option value="driver license">Driver License</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded w-full bg-white text-black placeholder-gray-400"
        />

        <button
          onClick={fetchData}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentDrivers.map((driver) => (
          <li key={driver.id} className="p-4 border rounded bg-white shadow text-black">
            <h3 className="font-bold text-lg mb-1">{driver.full_name}</h3>
            <p><strong>License:</strong> {driver.driver_license}</p>
            <p><strong>Expiry:</strong> {driver.driver_license_expiry}</p>
            <p><strong>PAN:</strong> {driver.pan_card}</p>
            <p><strong>Aadhaar:</strong> {driver.aadhar_card}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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