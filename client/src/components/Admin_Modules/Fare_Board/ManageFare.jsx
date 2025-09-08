import { useState, useEffect, useCallback } from "react";

const ManageFare = () => {
  const [locationPricing, setLocationPricing] = useState([]);
  const [commissionStructure, setCommissionStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingCommission, setEditingCommission] = useState(null);

  const [newLocation, setNewLocation] = useState({
    city: "",
    state: "",
    price_per_km: ""
  });

  const fetchFareData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch location pricing
      const locationResponse = await fetch("http://localhost:3008/location_pricing");
      const locationData = await locationResponse.json();
      
      // Fetch commission structure
      const commissionResponse = await fetch("http://localhost:3008/commission_structure");
      const commissionData = await commissionResponse.json();
      
      setLocationPricing(locationData || []);
      setCommissionStructure(commissionData || []);
    } catch (error) {
      console.error("Error fetching fare data:", error);
      alert("Failed to fetch fare data. Make sure JSON server is running on port 3008");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFareData();
  }, [fetchFareData]);

  // Location Pricing Functions
  const handleLocationEdit = (location) => {
    setEditingLocation({ ...location });
  };

  const handleLocationSave = async () => {
    try {
      const response = await fetch(`http://localhost:3008/location_pricing/${editingLocation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingLocation,
          city: editingLocation.city.toLowerCase(),
          state: editingLocation.state.toLowerCase(),
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setLocationPricing(prev => 
          prev.map(loc => 
            loc.id === editingLocation.id 
              ? { ...editingLocation, city: editingLocation.city.toLowerCase(), state: editingLocation.state.toLowerCase() }
              : loc
          )
        );
        setEditingLocation(null);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location");
    }
  };

  const handleLocationCancel = () => {
    setEditingLocation(null);
  };

  const handleLocationDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`http://localhost:3008/location_pricing/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setLocationPricing(prev => prev.filter(loc => loc.id !== id));
        }
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location");
      }
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.city || !newLocation.state || !newLocation.price_per_km) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:3008/location_pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: newLocation.city.toLowerCase(),
          state: newLocation.state.toLowerCase(),
          price_per_km: parseFloat(newLocation.price_per_km),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const newLocationData = await response.json();
        setLocationPricing(prev => [...prev, newLocationData]);
        setNewLocation({ city: "", state: "", price_per_km: "" });
      }
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Failed to add location");
    }
  };

  // Commission Structure Functions
  const handleCommissionEdit = (commission) => {
    setEditingCommission({ ...commission });
  };

  const handleCommissionSave = async () => {
    try {
      const response = await fetch(`http://localhost:3008/commission_structure/${editingCommission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingCommission,
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setCommissionStructure(prev => 
          prev.map(comm => 
            comm.id === editingCommission.id ? editingCommission : comm
          )
        );
        setEditingCommission(null);
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      alert("Failed to update commission");
    }
  };

  const handleCommissionCancel = () => {
    setEditingCommission(null);
  };

  // Function to calculate commission based on fare amount
  const calculateCommission = (fareAmount) => {
    for (let tier of commissionStructure) {
      if (fareAmount >= tier.min_value && fareAmount <= tier.max_value) {
        return {
          percentage: tier.commission_percentage,
          amount: (fareAmount * tier.commission_percentage) / 100,
          tier: tier.description
        };
      }
    }
    return { percentage: 0, amount: 0, tier: 'No applicable tier' };
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading fare data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 pb-20">
      {/* Location Pricing Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Location Pricing</h2>
        
        {/* Add New Location Row */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-black">Add New Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="City"
              value={newLocation.city}
              onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
              className="px-3 py-2 border text-black border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <input
              type="text"
              placeholder="State"
              value={newLocation.state}
              onChange={(e) => setNewLocation(prev => ({ ...prev, state: e.target.value }))}
              className="px-3 py-2 border text-black border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price per KM"
              value={newLocation.price_per_km}
              onChange={(e) => setNewLocation(prev => ({ ...prev, price_per_km: e.target.value }))}
              className="px-3 py-2 border text-black border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
          <button
            onClick={handleAddLocation}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 font-medium"
          >
            Add Location
          </button>
        </div>

        {/* Location Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">City</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">State</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Price per KM (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locationPricing.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {editingLocation?.id === location.id ? (
                      <input
                        type="text"
                        value={editingLocation.city}
                        onChange={(e) => setEditingLocation(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="capitalize font-medium text-black">{location.city}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingLocation?.id === location.id ? (
                      <input
                        type="text"
                        value={editingLocation.state}
                        onChange={(e) => setEditingLocation(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="capitalize font-medium text-black">{location.state}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingLocation?.id === location.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingLocation.price_per_km}
                        onChange={(e) => setEditingLocation(prev => ({ ...prev, price_per_km: parseFloat(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="font-medium text-black">₹{location.price_per_km}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingLocation?.id === location.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleLocationSave}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 font-medium transition duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleLocationCancel}
                          className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLocationEdit(location)}
                          className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleLocationDelete(location.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 font-medium transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Structure Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Commission Structure</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Range Description</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Min Value (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Max Value (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Commission (%)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissionStructure.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {editingCommission?.id === commission.id ? (
                      <input
                        type="text"
                        value={editingCommission.description}
                        onChange={(e) => setEditingCommission(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="font-medium text-black">{commission.description}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingCommission?.id === commission.id ? (
                      <input
                        type="number"
                        value={editingCommission.min_value}
                        onChange={(e) => setEditingCommission(prev => ({ ...prev, min_value: parseFloat(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="font-medium text-black">₹{commission.min_value}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingCommission?.id === commission.id ? (
                      <input
                        type="number"
                        value={editingCommission.max_value}
                        onChange={(e) => setEditingCommission(prev => ({ ...prev, max_value: parseFloat(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="font-medium text-black">₹{commission.max_value}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingCommission?.id === commission.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingCommission.commission_percentage}
                        onChange={(e) => setEditingCommission(prev => ({ ...prev, commission_percentage: parseFloat(e.target.value) }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                      />
                    ) : (
                      <span className="font-medium text-black">{commission.commission_percentage}%</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingCommission?.id === commission.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCommissionSave}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 font-medium transition duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCommissionCancel}
                          className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCommissionEdit(commission)}
                        className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 font-medium transition duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Commission Calculator Demo */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Commission Calculator</h3>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare Amount (₹)
              </label>
              <input
                type="number"
                placeholder="Enter fare amount"
                className="px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-black"
                onChange={(e) => {
                  const amount = parseFloat(e.target.value);
                  if (amount && amount > 0) {
                    const result = calculateCommission(amount);
                    document.getElementById('commissionResult').innerHTML = `
                      <strong>Tier:</strong> ${result.tier}<br>
                      <strong>Commission Rate:</strong> ${result.percentage}%<br>
                      <strong>Commission Amount:</strong> ₹${result.amount.toFixed(2)}
                    `;
                  } else {
                    document.getElementById('commissionResult').innerHTML = '';
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                <div id="commissionResult" className="font-medium"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFare;
