import { useState, useEffect } from "react";

const ManageAccount = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    phone_number: "",
    name: "",
    city: "",
    state: "",
    is_email_verified: false,
    is_phone_verified: false,
    role: "",
    status: "",
    created_at: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails=async() =>{
      try {
        const response = await fetch('http://localhost:3005/riders');
        const data=await response.json();
        setLoading(true);
        setUserDetails(data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUserDetails().finally(() => setLoading(false));  
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update logic
    userDetails.status = "Pending Verification";
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID - Read Only */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-sm font-mono text-gray-700">{userDetails.id}</p>
            </div>
            <div className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              {userDetails.status}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-red-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                {userDetails.is_email_verified && (
                  <span className="ml-2 text-xs text-green-600">✓ Verified</span>
                )}
              </label>
              <input
                type="email"
                value={userDetails.email}
                disabled
                className="w-full p-2 border rounded-md text-black bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
                {userDetails.is_phone_verified && (
                  <span className="ml-2 text-xs text-green-600">✓ Verified</span>
                )}
              </label>
              <input
                type="tel"
                value={userDetails.phone_number}
                disabled
                className="w-full p-2 border rounded-md text-black bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={userDetails.role}
                disabled
                className="w-full p-2 border rounded-md text-black bg-gray-100 cursor-not-allowed capitalize"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={userDetails.city}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, city: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-red-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={userDetails.state}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, state: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-red-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-sm text-gray-700">
                {new Date(userDetails.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                         transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;