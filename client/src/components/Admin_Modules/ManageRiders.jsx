import { useEffect, useState } from "react";

const ManageRiders = () => {
    const [riders, setRiders] = useState([]);
    const [filterType, setFilterType] = useState("email");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ridersPerPage = 6;

    const fetchRiders = async () => {
        const response = await fetch("http://localhost:3005/riders");
        const data = await response.json();

        if (searchTerm.trim() === "") {
        setRiders(data);
        } else {
        const filtered = data.filter((rider) =>
            rider[filterType]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setRiders(filtered);
        }
        setCurrentPage(1); 
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    
    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchRiders();
        }
    }, [searchTerm]);

  // Pagination logic
  const indexOfLastRider = currentPage * ridersPerPage;
  const indexOfFirstRider = indexOfLastRider - ridersPerPage;
  const currentRiders = riders.slice(indexOfFirstRider, indexOfLastRider);
  const totalPages = Math.ceil(riders.length / ridersPerPage);

  return (
    <div className="p-4">
      {/* Filter UI */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700"
        >
          <option value="email">Email</option>
          <option value="phone number">Phone Number</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded w-full bg-white text-black placeholder-gray-400"
        />

        <button
          onClick={fetchRiders}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <ul className="space-y-2">
        {currentRiders.map((rider) => (
          <li key={rider.id} className="p-2 border text-black rounded bg-white shadow">
            <strong>{rider.first_name} {rider.last_name}</strong><br />
            Email: {rider.email}<br />
            Phone: {rider.phone_number}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
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

export default ManageRiders;