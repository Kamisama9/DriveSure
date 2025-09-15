import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe, toMySQLFromDate } from "../Utils/DateUtil";
import VehicleCards from "./VehicleCards";

const DriverCards = ({ Driver, onClose, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState(null);
    const [showVehicles, setShowVehicles] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [driverMeta, setDriverMeta] = useState({
        id: "",
        user_id: "",
        aadhar_card: "",
        pan_card: "",
        driver_license: "",
        driver_license_expiry: "",
        is_aadhaar_verified: false,
        is_pan_verified: false,
        is_driver_license_verified: false,
        created_at: "",
        updated_at: ""
    });

    const [formData, setFormData] = useState({
        phone_number: "",
        city: "",
        state: "",
        role_description: "",
        status: "active",
        created_at: "",
        updated_at: ""
    });

    const s = (v) => (v == null ? "" : String(v));

    useEffect(() => {
        if (!Driver) return;

        setDriverMeta({
            id: s(Driver.id),
            user_id: s(Driver.user_id),
            aadhar_card: s(Driver.aadhar_card),
            pan_card: s(Driver.pan_card),
            driver_license: s(Driver.driver_license),
            driver_license_expiry: s(Driver.driver_license_expiry),
            is_aadhaar_verified: !!Driver.is_aadhaar_verified,
            is_pan_verified: !!Driver.is_pan_verified,
            is_driver_license_verified: !!Driver.is_driver_license_verified,
            created_at: s(Driver.created_at),
            updated_at: s(Driver.updated_at)
        });

        if (Driver.user_id) {
            setUserLoading(true);
            setUserError(null);

            fetch(`http://localhost:3006/users/${Driver.user_id}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
                    return res.json();
                })
                .then((userData) => {
                    setUser(userData);
                    setFormData({
                        phone_number: s(userData.phone_number),
                        city: s(userData.city),
                        state: s(userData.state),
                        role_description: s(userData.role_description),
                        status: s(userData.status) || "active",
                        created_at: s(userData.created_at),
                        updated_at: s(userData.updated_at)
                    });
                })
                .catch((err) => setUserError(err.message))
                .finally(() => setUserLoading(false));
        }
    }, [Driver]);

    if (!Driver) return null;

    const stop = (e) => e.stopPropagation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        if (!user || !Driver?.user_id) return;

        try {
            const updatedAtMySQL = toMySQLFromDate(new Date(), { asUTC: true, withMs: false });

            const payload = {
                ...user,
                phone_number: formData.phone_number,
                city: formData.city,
                state: formData.state,
                role_description: formData.role_description,
                status: formData.status,
                created_at: formData.created_at,
                updated_at: updatedAtMySQL
            };

            const res = await fetch(`http://localhost:3006/users/${Driver.user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                toast.error("Failed to update user", {
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

            const updatedUser = await res.json();
            setUser(updatedUser);
            setFormData((prev) => ({ ...prev, updated_at: updatedAtMySQL }));
            setIsEditing(false);

            toast.success("Driver updated successfully!", {
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

            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating driver", {
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

    const handleDelete = async () => {
        setIsDeleting(true);
        
        const confirmDelete = new Promise((resolve) => {
            toast.warn(
                ({ closeToast }) => (
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <p className="mb-3">Are you sure you want to delete this driver?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        closeToast();
                                        resolve(true);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 hover:shadow-lg transition-colors duration-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        closeToast();
                                        resolve(false);
                                    }}
                                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 hover:shadow-lg transition-colors duration-200"
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
        setIsDeleting(false);
        
        if (!shouldDelete) return;

        try {
            const res = await fetch(`http://localhost:3006/drivers/${Driver.id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                toast.error("Failed to delete driver", {
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

            toast.success("Driver deleted successfully!", {
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

            if (onRefresh) onRefresh();
            onClose();

        } catch (error) {
            console.error("Error deleting driver:", error);
            toast.error("Error deleting driver", {
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
            className="fixed inset-0 z-50 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar relative transform transition-all duration-300 scale-100 hover:scale-[1.01]"
                onClick={stop}
            >
                <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50">
                    {!showVehicles && (
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 inline-flex items-center justify-center
                                    h-12 w-12 rounded-full cursor-pointer bg-white shadow-lg border border-gray-200
                                    text-gray-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200
                                    ring-2 ring-transparent ring-offset-white
                                    transition-all duration-200 ease-out transform hover:scale-110"
                        >
                            <span className="pointer-events-none text-xl font-medium leading-none">✕</span>
                        </button>
                    )}

                    <div className="relative h-full">
                        <div className={showVehicles ? "hidden" : "block"}>
                            
                            <div className="text-center mb-8">
                                <div className="relative inline-flex items-center justify-center group">
                                    {Driver?.profile_photo ? (
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg">
                                            <img 
                                                src={Driver.profile_photo} 
                                                alt={Driver.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Download button overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Download functionality placeholder
                                                        const link = document.createElement('a');
                                                        link.href = Driver.profile_photo;
                                                        link.download = `${Driver.full_name}_profile_photo.${Driver.profile_photo_mime?.split('/')[1] || 'jpg'}`;
                                                        link.click();
                                                    }}
                                                    className="text-white hover:text-blue-200 transition-colors duration-200"
                                                    title="Download profile photo"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                                            <span className="text-3xl text-white font-bold">
                                                {Driver?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'D'}
                                            </span>
                                        </div>
                                    )}
                                    {Driver?.profile_photo && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-lg">
                                            📷
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {Driver?.full_name || 'Driver'}
                                </h2>
                                <p className="text-gray-600 mt-2 text-lg">{user?.email || 'Loading...'}</p>
                                <div className="flex justify-center mt-3">
                                    {driverMeta.is_aadhaar_verified && driverMeta.is_pan_verified && driverMeta.is_driver_license_verified ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                                            ✅ All Documents Verified
                                        </span>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            {driverMeta.is_aadhaar_verified && driverMeta.is_pan_verified && !driverMeta.is_driver_license_verified && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    ⚠️ License Verification Pending
                                                </span>
                                            )}
                                            {(!driverMeta.is_aadhaar_verified || !driverMeta.is_pan_verified || !driverMeta.is_driver_license_verified) && 
                                             !(driverMeta.is_aadhaar_verified && driverMeta.is_pan_verified && !driverMeta.is_driver_license_verified) && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                                                    ❌ Document Verification Pending
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Loading / Error banners */}
                            {userLoading && (
                                <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 px-4 py-3 text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <span>🔄</span>
                                        <span>Loading user information...</span>
                                    </div>
                                </div>
                            )}
                            {userError && (
                                <div className="mb-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <span>❌</span>
                                        <span>{userError}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Fixed User Fields */}
                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">Email</label>
                                    <div className="text-gray-900 font-medium text-base">{user?.email || "—"}</div>
                                </div>

                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">First Name</label>
                                    <div className="text-gray-900 font-medium text-base">{user?.first_name || "—"}</div>
                                </div>

                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">Last Name</label>
                                    <div className="text-gray-900 font-medium text-base">{user?.last_name || "—"}</div>
                                </div>

                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">Middle Name</label>
                                    <div className="text-gray-900 font-medium text-base">{user?.middle_name || "—"}</div>
                                </div>

                                <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200 hover:border-purple-300">
                                    <label className="block text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 group-hover:text-purple-700">Role</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                            {user?.role || "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* Driver KYC Documents */}
                                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
                                    <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 group-hover:text-green-700">Aadhaar Card</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            🏢 {driverMeta.aadhar_card || "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
                                    <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 group-hover:text-green-700">PAN Card</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            🏛️ {driverMeta.pan_card || "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
                                    <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 group-hover:text-green-700">Driver License</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            🆔 {driverMeta.driver_license || "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200 hover:border-orange-300">
                                    <label className="block text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2 group-hover:text-orange-700">License Expiry</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            📅 {formatDateSafe(driverMeta.driver_license_expiry, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "date",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Verification Status Cards */}
                                <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                                    <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 group-hover:text-indigo-700">Aadhaar Verified</label>
                                    <div className="text-gray-900 font-medium text-base">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${driverMeta.is_aadhaar_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                            {driverMeta.is_aadhaar_verified ? '✅ Verified' : '❌ Not Verified'}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                                    <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 group-hover:text-indigo-700">PAN Verified</label>
                                    <div className="text-gray-900 font-medium text-base">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${driverMeta.is_pan_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                            {driverMeta.is_pan_verified ? '✅ Verified' : '❌ Not Verified'}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                                    <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 group-hover:text-indigo-700">License Verified</label>
                                    <div className="text-gray-900 font-medium text-base">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${driverMeta.is_driver_license_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                            {driverMeta.is_driver_license_verified ? '✅ Verified' : '❌ Not Verified'}
                                        </span>
                                    </div>
                                </div>

                                {/* Editable Fields */}
                                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                    <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium text-base flex items-center">
                                            <span className="inline-flex items-center">
                                                📱 {formData.phone_number}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                    <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">City</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium text-base flex items-center">
                                            <span className="inline-flex items-center">
                                                🏙️ {formData.city}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                    <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">State</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium text-base flex items-center">
                                            <span className="inline-flex items-center">
                                                📍 {formData.state}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                    <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">Role Description</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="role_description"
                                            value={formData.role_description}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium text-base">{formData.role_description}</div>
                                    )}
                                </div>

                                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
                                    <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 group-hover:text-green-700">Status</label>
                                    {isEditing ? (
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-base font-medium text-black bg-white border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                        >
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    ) : (
                                        <div className="text-gray-900 font-medium text-base">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${formData.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                formData.status === 'suspended' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                    formData.status === 'deleted' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                                }`}>
                                                {formData.status === 'active' && '✅'}
                                                {formData.status === 'suspended' && '⚠️'}
                                                {formData.status === 'deleted' && '❌'}
                                                {formData.status}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Timestamp Fields */}
                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">User Created At</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            🗓️ {formatDateSafe(formData.created_at, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "datetime",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">User Updated At</label>
                                    <div className="text-gray-900 font-medium text-base flex items-center">
                                        <span className="inline-flex items-center">
                                            🔄 {formatDateSafe(formData.updated_at, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "datetime",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-6 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleUpdate}
                                            className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                                                     hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 
                                                     shadow-lg hover:shadow-xl flex items-center space-x-2"
                                        >
                                            <span>💾</span>
                                            <span>Save Changes</span>
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="group relative bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-xl font-semibold text-base
                                                     hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200 
                                                     shadow-lg hover:shadow-xl flex items-center space-x-2"
                                        >
                                            <span>❌</span>
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                                                     hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 
                                                     shadow-lg hover:shadow-xl flex items-center space-x-2"
                                        >
                                            <span>✏️</span>
                                            <span>Edit Driver</span>
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                                                     hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 
                                                     shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
                                        >
                                            <span>🗑️</span>
                                            <span>Delete Driver</span>
                                        </button>
                                        <button
                                            onClick={() => setShowVehicles(true)}
                                            className="group relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                                                     hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 
                                                     shadow-lg hover:shadow-xl flex items-center space-x-2"
                                        >
                                            <span>🚗</span>
                                            <span>View Vehicles</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {showVehicles && (
                            <div className="block">
                                <VehicleCards
                                    ownerId={driverMeta.id || Driver.id}
                                    onClose={() => setShowVehicles(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverCards;
