import { useEffect, useState, useCallback } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../Utils/DateUtil";

const VehicleCards = ({ ownerId, onClose }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3007/vehicles?owner_id=${ownerId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles');
            }

            const data = await response.json();
            // API returns array directly, not wrapped in vehicles property
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    }, [ownerId]);

    useEffect(() => {
        if (ownerId) {
            fetchVehicles();
        }
    }, [ownerId, fetchVehicles]);

    const getVehicleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'sedan':
                return '🚗';
            case 'suv':
                return '🚙';
            case 'bike':
                return '🏍️';
            case 'auto':
                return '🛺';
            default:
                return '🚗';
        }
    };

    const VehicleDetailModal = ({ vehicle, onClose }) => {
        if (!vehicle) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[60] p-4 py-8 overflow-y-auto no-scrollbar" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Header - Fixed */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">{getVehicleIcon(vehicle.vehicle_type)}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold capitalize">{vehicle.vehicle_type} Details</h2>
                                    <p className="text-blue-100 font-mono text-sm">{vehicle.rc_number}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Verification Status Cards */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verification Status
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg border-2 transition-all ${vehicle.is_rc_verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="text-center">
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${vehicle.is_rc_verified ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {vehicle.is_rc_verified ? (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-gray-800 text-xs mb-1">Registration Certificate</h4>
                                        <p className={`text-xs font-medium ${vehicle.is_rc_verified ? 'text-green-700' : 'text-red-700'}`}>
                                            {vehicle.is_rc_verified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg border-2 transition-all ${vehicle.is_puc_verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="text-center">
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${vehicle.is_puc_verified ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {vehicle.is_puc_verified ? (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-gray-800 text-xs mb-1">Pollution Under Control</h4>
                                        <p className={`text-xs font-medium ${vehicle.is_puc_verified ? 'text-green-700' : 'text-red-700'}`}>
                                            {vehicle.is_puc_verified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg border-2 transition-all ${vehicle.is_insurance_verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="text-center">
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${vehicle.is_insurance_verified ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {vehicle.is_insurance_verified ? (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-gray-800 text-xs mb-1">Vehicle Insurance</h4>
                                        <p className={`text-xs font-medium ${vehicle.is_insurance_verified ? 'text-green-700' : 'text-red-700'}`}>
                                            {vehicle.is_insurance_verified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Vehicle Information */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Vehicle Information
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">Vehicle Type</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{getVehicleIcon(vehicle.vehicle_type)}</span>
                                            <span className="font-semibold text-gray-900 capitalize text-sm">{vehicle.vehicle_type}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">RC Number</span>
                                        <span className="font-mono font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{vehicle.rc_number}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">PUC Number</span>
                                        <span className="font-mono font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{vehicle.puc_number}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-medium text-gray-600 text-sm">Insurance Policy</span>
                                        <span className="font-mono font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{vehicle.insurance_policy_number}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Important Dates */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Important Dates
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">PUC Expiry</span>
                                        <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{formatDateSafe(vehicle.puc_expiry)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">Insurance Expiry</span>
                                        <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{formatDateSafe(vehicle.insurance_expiry)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-600 text-sm">Created At</span>
                                        <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{formatDateSafe(vehicle.created_at)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-medium text-gray-600 text-sm">Last Updated</span>
                                        <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded text-sm">{formatDateSafe(vehicle.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-6 border border-blue-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">🚗</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Driver Vehicles</h2>
                            <p className="text-sm text-gray-600">Manage vehicle information and verification status</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                        title="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="text-blue-600 text-lg">🚗</span>
                            </div>
                        </div>
                        <span className="ml-4 text-gray-600 font-medium">Loading vehicles...</span>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-4 animate-bounce">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Found</h3>
                        <p className="text-gray-500">This driver hasn't registered any vehicles yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Found {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>
                                <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                                <span className="text-sm text-gray-500">Click on any card for details</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => setSelectedVehicle(vehicle)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-2xl">{getVehicleIcon(vehicle.vehicle_type)}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 capitalize">{vehicle.vehicle_type}</h3>
                                                <p className="text-sm text-gray-500 font-mono">{vehicle.rc_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            {vehicle.is_rc_verified && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                    RC ✓
                                                </span>
                                            )}
                                            {vehicle.is_puc_verified && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                                                    PUC ✓
                                                </span>
                                            )}
                                            {vehicle.is_insurance_verified && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
                                                    INS ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">PUC Expires:</span>
                                            <span className="text-sm text-gray-900 font-medium">{formatDateSafe(vehicle.puc_expiry)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">Insurance Expires:</span>
                                            <span className="text-sm text-gray-900 font-medium">{formatDateSafe(vehicle.insurance_expiry)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">Verification Status:</span>
                                            <div className="flex space-x-1">
                                                <div className={`w-3 h-3 rounded-full ${vehicle.is_rc_verified ? 'bg-green-500' : 'bg-red-400'}`} title="RC Verification"></div>
                                                <div className={`w-3 h-3 rounded-full ${vehicle.is_puc_verified ? 'bg-green-500' : 'bg-red-400'}`} title="PUC Verification"></div>
                                                <div className={`w-3 h-3 rounded-full ${vehicle.is_insurance_verified ? 'bg-green-500' : 'bg-red-400'}`} title="Insurance Verification"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
                                            <span>View Full Details</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {selectedVehicle && (
                <VehicleDetailModal
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                />
            )}
        </>
    );
};

export default VehicleCards;
