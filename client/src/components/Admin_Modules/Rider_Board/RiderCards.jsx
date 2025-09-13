import { useState, useEffect } from "react";
import { formatDateSafe, toMySQLFromDate } from '../Utils/DateUtil';
import { toast, Bounce } from 'react-toastify';

const RiderCards = ({ rider, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
    role_description: "",
    status: "active",
    created_at: "",
    updated_at: ""
  });

  useEffect(() => {
    if (rider) {
      setFormData({
        phone_number: rider.phone_number || "",
        city: rider.city || "",
        state: rider.state || "",
        role_description: rider.role_description || "",
        status: rider.status || "active",
        created_at: rider.created_at || "",
        updated_at: rider.updated_at || ""
      });
    }
  }, [rider]);

  if (!rider) return null;

  const stop = (e) => e.stopPropagation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedAtMySQL = toMySQLFromDate(new Date(), { asUTC: true, withMs: true });
      const response = await fetch(`http://localhost:3005/riders/${rider.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rider,
          phone_number: formData.phone_number,
          city: formData.city,
          state: formData.state,
          role_description: formData.role_description,
          status: formData.status,
          created_at: formData.created_at,
          updated_at: updatedAtMySQL
        }),
      });

      if (response.ok) {
        toast.success('Rider updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
        setIsEditing(false);
        setFormData(prev => ({ ...prev, updated_at: updatedAtMySQL }));
        if (onRefresh) onRefresh();
      } else {
        toast.error('Failed to update rider', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error updating rider:', error);
      toast.error('Error updating rider', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="mb-3">Are you sure you want to delete this rider?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    closeToast();
                    resolve(true);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    closeToast();
                    resolve(false);
                  }}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          closeButton: false,
          theme: "light",
          transition: Bounce,
          style: {
            alignItems: 'flex-start'
          }
        }
      );
    });

    const shouldDelete = await confirmDelete;
    if (!shouldDelete) return;

    try {
      const response = await fetch(`http://localhost:3005/riders/${rider.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to delete rider', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      toast.success('Rider deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      if (onRefresh) {
        onRefresh();
      }
      onClose();
    } catch (error) {
      console.error('Error deleting rider:', error);
      toast.error('Error deleting rider', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={stop}
      >
        <div className="p-6">
          {/* <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button> */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 inline-flex items-center justify-center
                            h-11 w-11 rounded-full cursor-pointer
                            text-gray-600 hover:text-blue-700 hover:bg-gray-100
                            ring-2 ring-transparent ring-offset-white
                            transition-colors duration-150 ease-out"
          >
            <span className="pointer-events-none text-2xl leading-none text-black">x</span>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Rider Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Fixed Fields */}

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <div className="text-gray-900 text-sm">{rider.email}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
              <div className="text-gray-900 text-sm">{rider.first_name}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
              <div className="text-gray-900 text-sm">{rider.last_name}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Middle Name</label>
              <div className="text-gray-900 text-sm">{rider.middle_name || "N/A"}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <div className="text-gray-900 text-sm">{rider.role}</div>
            </div>

            {/* Editable Fields */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                />
              ) : (
                <div className="text-gray-900 text-sm">{formData.phone_number}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                />
              ) : (
                <div className="text-gray-900 text-sm">{formData.city}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                />
              ) : (
                <div className="text-gray-900 text-sm">{formData.state}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Role Description</label>
              {isEditing ? (
                <input
                  type="text"
                  name="role_description"
                  value={formData.role_description}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                />
              ) : (
                <div className="text-gray-900 text-sm">{formData.role_description}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              ) : (
                <div className="text-gray-900 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${formData.status === 'active' ? 'bg-green-100 text-green-800' :
                    formData.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      formData.status === 'deleted' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {formData.status}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Verified</label>
              <div className="text-gray-900 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${formData.is_email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {formData.is_email_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Verified</label>
              <div className="text-gray-900 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${formData.is_phone_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {formData.is_phone_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
              <div className="text-gray-900 text-sm">
                {formatDateSafe(formData.created_at, {
                  locale: 'en-IN',
                  timeZone: 'Asia/Kolkata',
                  variant: 'datetime',
                  fallback: '—',
                  assumeUTCForMySQL: true,
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">Updated At</label>
              <div className="text-gray-900 text-sm">
                {formatDateSafe(formData?.updated_at, {
                  locale: 'en-IN',
                  timeZone: 'Asia/Kolkata',
                  variant: 'datetime',
                  fallback: '—',
                  assumeUTCForMySQL: true,
                })}
              </div>
            </div>

          </div>


          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderCards;