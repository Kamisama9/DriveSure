import { useEffect, useState, useCallback } from "react";
import DriverVerificationCard from "./DriverVerificationCard";
import VehicleVerificationCard from "./VehicleVerificationCard";
import { toast } from 'react-toastify';
import { Search, User, FileText, Clock, CheckCircle, XCircle, Car } from 'lucide-react';

const ManageVerifications = () => {
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState("drivers"); // "drivers" or "driver-details" or "vehicle-details"

  // Fetch all data from mock server
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, driversRes, vehiclesRes, verificationsRes] = await Promise.all([
        fetch("http://localhost:4002/users"),
        fetch("http://localhost:4002/drivers"),
        fetch("http://localhost:4002/vehicles"),
        fetch("http://localhost:4002/verifications")
      ]);

      const usersData = await usersRes.json();
      const driversData = await driversRes.json();
      const vehiclesData = await vehiclesRes.json();
      const verificationsData = await verificationsRes.json();

      setUsers(usersData);
      setDrivers(driversData);
      setVehicles(vehiclesData);
      setVerifications(verificationsData);
      setFilteredDrivers(driversData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enhanced search functionality
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredDrivers(drivers);
      return;
    }

    try {
      // Search across multiple fields
      const searchParams = new URLSearchParams();
      searchParams.append('q', query);

      // Try different endpoints based on query type
      let searchResults = [];
      
      // Check if it's an email pattern
      if (query.includes('@')) {
        const userRes = await fetch(`http://localhost:4002/users?email_like=${encodeURIComponent(query)}`);
        const matchingUsers = await userRes.json();
        const userIds = matchingUsers.map(user => user.id);
        searchResults = drivers.filter(driver => userIds.includes(driver.user_id));
      } 
      // Check if it's a phone pattern
      else if (query.match(/^\+?\d{10,13}$/)) {
        const userRes = await fetch(`http://localhost:4002/users?phone_number_like=${encodeURIComponent(query)}`);
        const matchingUsers = await userRes.json();
        const userIds = matchingUsers.map(user => user.id);
        searchResults = drivers.filter(driver => userIds.includes(driver.user_id));
      }
      // Check if it's a driver license pattern
      else if (query.match(/^DL/i)) {
        const driverRes = await fetch(`http://localhost:4002/drivers?driver_license_like=${encodeURIComponent(query)}`);
        searchResults = await driverRes.json();
      }
      // Check if it's an RC number pattern
      else if (query.match(/^RC/i)) {
        const vehicleRes = await fetch(`http://localhost:4002/vehicles?rc_number_like=${encodeURIComponent(query)}`);
        const matchingVehicles = await vehicleRes.json();
        const ownerIds = matchingVehicles.map(vehicle => vehicle.owner_id);
        searchResults = drivers.filter(driver => ownerIds.includes(driver.id));
      }
      // Default: search by name
      else {
        const userRes = await fetch(`http://localhost:4002/users?q=${encodeURIComponent(query)}`);
        const matchingUsers = await userRes.json();
        const userIds = matchingUsers.map(user => user.id);
        searchResults = drivers.filter(driver => userIds.includes(driver.user_id));
      }

      setFilteredDrivers(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const localSearch = drivers.filter(driver => {
        const user = users.find(u => u.id === driver.user_id);
        if (!user) return false;
        
        const searchStr = query.toLowerCase();
        return (
          user.first_name?.toLowerCase().includes(searchStr) ||
          user.last_name?.toLowerCase().includes(searchStr) ||
          user.email?.toLowerCase().includes(searchStr) ||
          user.phone_number?.includes(searchStr) ||
          driver.driver_license?.toLowerCase().includes(searchStr) ||
          driver.aadhar_card?.includes(searchStr) ||
          driver.pan_card?.toLowerCase().includes(searchStr)
        );
      });
      setFilteredDrivers(localSearch);
    }
  }, [drivers, users]);

  // Get verification counts for a driver
  const getDriverVerificationCounts = (driverId) => {
    const driverVerifications = verifications.filter(v => 
      v.entity_type === "driver" && v.entity_id === driverId
    );
    
    return {
      total: driverVerifications.length,
      pending: driverVerifications.filter(v => v.status === "pending").length,
      verified: driverVerifications.filter(v => v.status === "verified").length,
      rejected: driverVerifications.filter(v => v.status === "rejected").length
    };
  };

  // Get user details for a driver
  const getUserForDriver = (driver) => {
    return users.find(user => user.id === driver.user_id);
  };

  // Get vehicles for a driver
  const getDriverVehicles = (driverId) => {
    return vehicles.filter(vehicle => vehicle.owner_id === driverId);
  };

  // Handle driver card click
  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setCurrentView("driver-details");
  };

  // Handle vehicle view click
  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView("vehicle-details");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "vehicle-details") {
      setCurrentView("driver-details");
      setSelectedVehicle(null);
    } else {
      setCurrentView("drivers");
      setSelectedDriver(null);
    }
  };

  if (currentView === "driver-details" && selectedDriver) {
    return (
      <DriverVerificationCard
        driver={selectedDriver}
        user={getUserForDriver(selectedDriver)}
        vehicles={getDriverVehicles(selectedDriver.id)}
        verifications={verifications}
        onBack={handleBack}
        onVehicleClick={handleVehicleClick}
        onRefresh={fetchData}
      />
    );
  }

  if (currentView === "vehicle-details" && selectedVehicle) {
    return (
      <VehicleVerificationCard
        vehicle={selectedVehicle}
        driver={selectedDriver}
        user={getUserForDriver(selectedDriver)}
        verifications={verifications}
        onBack={handleBack}
        onRefresh={fetchData}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Management</h1>
        <p className="text-gray-600">Manage driver and vehicle verification requests</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, phone, DL, or RC number"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDrivers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === "verified").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : filteredDrivers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No drivers available.'}
            </p>
          </div>
        ) : (
          filteredDrivers.map((driver) => {
            const user = getUserForDriver(driver);
            const verificationCounts = getDriverVerificationCounts(driver.id);
            const driverVehicles = getDriverVehicles(driver.id);
            
            if (!user) return null;

            return (
              <div
                key={driver.id}
                onClick={() => handleDriverClick(driver)}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Driver Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone_number}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {verificationCounts.total} docs
                    </span>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">DL:</span> {driver.driver_license}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Vehicles:</span> {driverVehicles.length}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {verificationCounts.pending > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {verificationCounts.pending} pending
                      </span>
                    )}
                    {verificationCounts.verified > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {verificationCounts.verified} verified
                      </span>
                    )}
                    {verificationCounts.rejected > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {verificationCounts.rejected} rejected
                      </span>
                    )}
                  </div>
                  
                  {driverVehicles.length > 0 && (
                    <Car className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageVerifications;
