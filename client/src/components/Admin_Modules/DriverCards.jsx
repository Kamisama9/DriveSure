import { useEffect, useState } from "react";
import { formatDateSafe, toMySQLFromDate } from "./DateUtil";
import VehicleCards from './VehicleCards';

const DriverCards = ({ Driver, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState(null);
    const [showVehicles, setShowVehicles] = useState(false);

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
    }, [Driver]);

    useEffect(() => {
        if (!Driver?.user_id) {
            setUser(null);
            setUserError("Missing driver.user_id");
            return;
        }

        const ac = new AbortController();

        (async () => {
            try {
                setUserLoading(true);
                setUserError(null);

                const res = await fetch(`http://localhost:3006/users/${Driver.user_id}`, {
                    signal: ac.signal
                });
                if (!res.ok) throw new Error(`Failed to load user: ${res.status}`);
                const u = await res.json();

                setUser(u);
                setFormData({
                    phone_number: s(u.phone_number),
                    city: s(u.city),
                    state: s(u.state),
                    role_description: s(u.role_description),
                    status: s(u.status || "active"),
                    created_at: s(u.created_at),
                    updated_at: s(u.updated_at)
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setUserError(err.message || "Failed to load user");
                }
            } finally {
                setUserLoading(false);
            }
        })();

        return () => ac.abort();
    }, [Driver?.user_id]);

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
                alert("Failed to update user");
                return;
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
            setFormData((prev) => ({ ...prev, updated_at: updatedAtMySQL }));
            setIsEditing(false);
            alert("Driver (user profile) updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user");
        }
    };

    // Delete the driver record (KYC) only
    const handleDelete = async () => {
        if (!Driver?.id) return;
        if (!window.confirm("Are you sure you want to delete this driver?")) return;

        try {
            const res = await fetch(`http://localhost:3006/drivers/${Driver.id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                alert("Failed to delete driver");
                return;
            }

            alert("Driver deleted successfully!");
            onClose?.();
        } catch (error) {
            console.error("Error deleting driver:", error);
            alert("Error deleting driver");
        }
    };


    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="p-6">
                    {!showVehicles &&
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
                            <span className="pointer-events-none text-2xl leading-none">✕</span>
                        </button>
                    }

                    <div className="relative h-full">
                        <div className={showVehicles ? "hidden" : "block"}>
                            <div className="p-6">

                                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                                    Driver Details
                                </h2>

                                {/* Loading / Error banners */}
                                {userLoading && (
                                    <div className="mb-4 rounded-md bg-blue-50 text-blue-700 px-3 py-2 text-sm">
                                        Loading user…
                                    </div>
                                )}
                                {userError && (
                                    <div className="mb-4 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                                        {userError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Email
                                        </label>
                                        <div className="text-gray-900 text-sm">{user?.email || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            First Name
                                        </label>
                                        <div className="text-gray-900 text-sm">{user?.first_name || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Last Name
                                        </label>
                                        <div className="text-gray-900 text-sm">{user?.last_name || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Middle Name
                                        </label>
                                        <div className="text-gray-900 text-sm">{user?.middle_name ?? "N/A"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Role
                                        </label>
                                        <div className="text-gray-900 text-sm">{user?.role || "—"}</div>
                                    </div>

                                    {/* Driver KYC (read-only) */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Aadhaar Card
                                        </label>
                                        <div className="text-gray-900 text-sm">{driverMeta.aadhar_card || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            PAN Card
                                        </label>
                                        <div className="text-gray-900 text-sm">{driverMeta.pan_card || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Driver License
                                        </label>
                                        <div className="text-gray-900 text-sm">{driverMeta.driver_license || "—"}</div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            License Expiry
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            {formatDateSafe(driverMeta.driver_license_expiry, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "date",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </div>
                                    </div>


                                    {/* Aadhaar Verified (pill badge) */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Aadhaar Verified
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${driverMeta.is_aadhaar_verified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {driverMeta.is_aadhaar_verified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* PAN Verified (pill badge) */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            PAN Verified
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${driverMeta.is_pan_verified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {driverMeta.is_pan_verified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* License Verified (pill badge) */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            License Verified
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${driverMeta.is_driver_license_verified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {driverMeta.is_driver_license_verified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* User Timestamps (stored as MySQL strings in formData) */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            User Created At
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            {formatDateSafe(formData.created_at, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "datetime",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            User Updated At
                                        </label>
                                        <div className="text-gray-900 text-sm">
                                            {formatDateSafe(formData.updated_at, {
                                                locale: "en-IN",
                                                timeZone: "Asia/Kolkata",
                                                variant: "datetime",
                                                fallback: "—",
                                                assumeUTCForMySQL: true,
                                            })}
                                        </div>
                                    </div>

                                    {/* Editable User Fields */}
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                                            />
                                        ) : (
                                            <div className="text-gray-900 text-sm">{formData.phone_number || "—"}</div>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            City
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                                            />
                                        ) : (
                                            <div className="text-gray-900 text-sm">{formData.city || "—"}</div>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            State
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                                            />
                                        ) : (
                                            <div className="text-gray-900 text-sm">{formData.state || "—"}</div>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Role Description
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="role_description"
                                                value={formData.role_description}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full p-2 text-sm text-black border border-gray-300 rounded focus:border-black focus:outline-none"
                                            />
                                        ) : (
                                            <div className="text-gray-900 text-sm">
                                                {formData.role_description || "—"}
                                            </div>
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
                                                <option value="deleted">Deleted</option>
                                            </select>
                                        ) : (
                                            <div className="text-gray-900 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${formData.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : formData.status === 'suspended'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : formData.status === 'deleted'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {formData.status || '—'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between items-center mt-4">

                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setShowVehicles(true)}
                                            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            View Vehicles
                                        </button>
                                    )}


                                    {/* Right-aligned button group */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing((v) => !v)}
                                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                                        >
                                            {isEditing ? "Cancel" : "Edit"}
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={!isEditing}
                                            className={`px-4 py-2 rounded text-white ${isEditing
                                                ? "bg-indigo-600 hover:bg-indigo-700"
                                                : "bg-indigo-300 cursor-not-allowed"
                                                }`}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
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
    );



};

export default DriverCards;