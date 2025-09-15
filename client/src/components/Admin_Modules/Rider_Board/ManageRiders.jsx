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
    <div className="p-6 flex flex-col h-full min-h-[500px] pb-20 no-scrollbar relative bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Rider Management
        </h1>
        <p className="text-gray-600 text-lg">Manage and monitor all registered riders</p>
      </div>

      {/* Filter UI */}
      <div className="bg-white/95 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col min-w-[160px]">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Filter by:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-grow min-w-[300px]">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Search:</label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by ${filterOptions.find(opt => opt.value === filterType)?.label}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={fetchRiders}
              className="px-8 py-3 mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {riders.length > 0 ? `Found ${riders.length} rider${riders.length !== 1 ? 's' : ''}` : 'No riders found'}
        </h2>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <ul className="space-y-4 flex-grow pb-32 mb-8">
        {currentRiders.map((rider) => (
          <li
            key={rider.id}
            onClick={() => openRider(rider)}
            className="group relative bg-white/90 backdrop-blur-sm p-6 border border-gray-200 rounded-2xl shadow-lg cursor-pointer 
                     transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300
                     transform hover:scale-[1.02] overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 rounded-2xl"></div>
            
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-grow">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-xl font-bold text-white">
                      {(rider.first_name?.[0] || '').toUpperCase()}{(rider.last_name?.[0] || '').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {rider.first_name} {rider.last_name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      rider.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
                      rider.status === 'suspended' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {rider.status === 'active' && '✅'}
                      {rider.status === 'suspended' && '⚠️'}
                      {rider.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-blue-500">📧</span>
                      <span className="font-medium">{rider.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-green-500">📱</span>
                      <span className="font-medium">{rider.phone_number}</span>
                    </div>
                    {rider.city && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-purple-500">🏙️</span>
                        <span className="font-medium">{rider.city}, {rider.state}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-indigo-500">👤</span>
                      <span className="font-medium capitalize">{rider.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow icon */}
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="transform group-hover:scale-110 transition-transform duration-300">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls - Enhanced styling */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-50 right-0 py-6 z-10 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md border-t border-gray-200">
          <div className="flex justify-center items-center space-x-3 overflow-x-auto px-4">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-xl min-w-[3rem] font-semibold transition-all duration-200 shadow-sm ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedRider && (
        <RiderCards rider={selectedRider} onClose={closeRider} onRefresh={fetchRiders} />
      )}
    </div>
  );
};

export default ManageRiders;



