import { useEffect, useState, useCallback } from "react";
import DriverCards from "./DriverCards";

const filterOptions = [
  { label: "PAN", value: "pan_card" },
  { label: "Aadhaar", value: "aadhar_card" },
  { label: "Driver License", value: "driver_license" },
];

const ManageDrivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const openDriver = (driver) => setSelectedDriver(driver);
  const closeDriver = () => setSelectedDriver("");
  const [drivers, setDrivers] = useState([]);
  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 9;

  useEffect(() => {
    if (selectedDriver) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedDriver]);


  const fetchData = useCallback(async () => {
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

    // Show all drivers, regardless of verification status
    const filteredDrivers =
      searchTerm.trim() === ""
        ? enrichedDrivers
        : enrichedDrivers.filter((driver) =>
          driver[filterType]?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    setDrivers(filteredDrivers);
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // Pagination
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(drivers.length / driversPerPage);

  return (
    <div className="p-6 flex flex-col h-full min-h-[500px] relative pb-32 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Driver Management
        </h1>
        <p className="text-gray-600 text-lg">Manage all drivers and their verification status</p>
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
              onClick={fetchData}
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
          {drivers.length > 0 ? `Found ${drivers.length} driver${drivers.length !== 1 ? 's' : ''}` : 'No drivers found'}
        </h2>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentDrivers.map((driver) => (
          <div
            key={driver.id}
            onClick={() => openDriver(driver)}
            className="group relative bg-white/90 backdrop-blur-sm p-6 border border-gray-200 rounded-2xl shadow-lg cursor-pointer 
                     transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300
                     transform hover:scale-[1.02] overflow-hidden min-h-[200px] flex flex-col"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 rounded-2xl"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header with Avatar and Name */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0 relative group">
                  {driver.profile_photo ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      <img 
                        src={driver.profile_photo} 
                        alt={driver.full_name}
                        className="w-full h-full object-cover"
                      />
                      {/* Download button overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download functionality placeholder
                            const link = document.createElement('a');
                            link.href = driver.profile_photo;
                            link.download = `${driver.full_name}_profile_photo.${driver.profile_photo_mime?.split('/')[1] || 'jpg'}`;
                            link.click();
                          }}
                          className="text-white hover:text-blue-200 transition-colors duration-200"
                          title="Download profile photo"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      <span className="text-xl font-bold text-white">
                        {driver.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'D'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                    {driver.full_name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {/* Dynamic verification status */}
                    {driver.is_aadhaar_verified && driver.is_pan_verified && driver.is_driver_license_verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        ✅ All Verified
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        {driver.is_aadhaar_verified && driver.is_pan_verified && driver.is_driver_license_verified === false && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            ⚠️ License Pending
                          </span>
                        )}
                        {(!driver.is_aadhaar_verified || !driver.is_pan_verified || !driver.is_driver_license_verified) && 
                         !(driver.is_aadhaar_verified && driver.is_pan_verified && driver.is_driver_license_verified === false) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            ❌ Docs Pending
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="space-y-3 flex-grow">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-500">🆔</span>
                  <span className="font-medium text-gray-600">License:</span>
                  <span className="text-gray-900 font-medium truncate">{driver.driver_license}</span>
                  <span className={`text-xs ${driver.is_driver_license_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {driver.is_driver_license_verified ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-orange-500">📅</span>
                  <span className="font-medium text-gray-600">Expiry:</span>
                  <span className="text-gray-900 font-medium">{driver.driver_license_expiry}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-purple-500">🏛️</span>
                  <span className="font-medium text-gray-600">PAN:</span>
                  <span className="text-gray-900 font-medium">{driver.pan_card}</span>
                  <span className={`text-xs ${driver.is_pan_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {driver.is_pan_verified ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-indigo-500">🏢</span>
                  <span className="font-medium text-gray-600">Aadhaar:</span>
                  <span className="text-gray-900 font-medium">{driver.aadhar_card}</span>
                  <span className={`text-xs ${driver.is_aadhaar_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {driver.is_aadhaar_verified ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              {(driver.email || driver.phone_number) && (
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  {driver.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-500">📧</span>
                      <span className="text-gray-600 truncate">{driver.email}</span>
                    </div>
                  )}
                  {driver.phone_number && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-500">📱</span>
                      <span className="text-gray-600">{driver.phone_number}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Arrow icon */}
              <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="transform group-hover:scale-110 transition-transform duration-300">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
          </div>
        ))}
      </div>

      {/* Spacer div for additional spacing between cards and pagination */}
      <div className="w-full h-32 sm:h-36 md:h-10 bg-transparent flex-shrink-0 min-h-[5rem]"></div>


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

      {selectedDriver && (
        <DriverCards Driver={selectedDriver} onClose={closeDriver} onRefresh={fetchData} />
      )}

    </div>
  );
};

export default ManageDrivers;
