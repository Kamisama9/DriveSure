import { useEffect, useState, useCallback } from "react";
import RiderCards from "./RiderCards";

const filterOptions = [
  { label: "Email", value: "email" },
  { label: "Phone Number", value: "phone_number" },
];

const ManageRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const openRider = (rider) => setSelectedRider(rider);
  const closeRider = () => setSelectedRider(null);
  const [riders, setRiders] = useState([]);
  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ridersPerPage = 7;

  useEffect(() => {
    if (selectedRider) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedRider]);


  const fetchRiders = useCallback(async () => {
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
  }, [searchTerm, filterType]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  // Pagination logic
  const indexOfLastRider = currentPage * ridersPerPage;
  const indexOfFirstRider = indexOfLastRider - ridersPerPage;
  const currentRiders = riders.slice(indexOfFirstRider, indexOfLastRider);
  const totalPages = Math.ceil(riders.length / ridersPerPage);

  return (
    <div className="p-4 flex flex-col h-full min-h-[500px] pb-20 no-scrollbar relative">
      {/* Filter UI */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2 py-2 rounded bg-gray-300 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
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
          onClick={fetchRiders}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <ul className="space-y-7 flex-grow pb-20">
        {currentRiders.map((rider) => (
          <li
            key={rider.id}
            onClick={() => openRider(rider)}
            className="p-2 border text-black rounded bg-white shadow cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <strong>{rider.first_name} {rider.last_name}</strong><br />
                Email: {rider.email}<br />
                Phone: {rider.phone_number}
              </div>
              <span className="opacity-50 group-hover:opacity-100 transition">
                {/* small chevron icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </span>
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
              className={`px-3 py-1 rounded min-w-[2rem] ${currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedRider && (
        <RiderCards rider={selectedRider} onClose={closeRider} />
      )}
    </div>
  );
};

export default ManageRiders;



