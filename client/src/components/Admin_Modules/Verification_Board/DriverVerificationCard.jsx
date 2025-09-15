import React, { useState } from 'react';
import { ArrowLeft, User, FileText, Clock, CheckCircle, XCircle, Car, Eye, Download, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const DriverVerificationCard = ({ 
  driver, 
  user, 
  vehicles, 
  verifications, 
  onBack, 
  onVehicleClick, 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState("driver");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [verificationToReject, setVerificationToReject] = useState(null);

  // Get driver verifications
  const driverVerifications = verifications.filter(v => 
    v.entity_type === "driver" && v.entity_id === driver.id
  );

  // Get vehicle verifications
  const vehicleVerifications = verifications.filter(v => 
    v.entity_type === "vehicle" && vehicles.some(vehicle => vehicle.id === v.entity_id)
  );

  // Handle verification status update
  const handleStatusUpdate = async (verificationId, newStatus, reason = null) => {
    try {
      const updatePayload = {
        status: newStatus,
        reviewed_at: newStatus === 'pending' ? null : new Date().toISOString(),
        ...(reason && { rejection_reason: reason })
      };

      const response = await fetch(`http://localhost:4002/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statusMessage = newStatus === 'verified' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated';
      toast.success(`Verification ${statusMessage} successfully!`);
      
      // Refresh data
      if (onRefresh) {
        onRefresh();
      }
      
    } catch (error) {
      toast.error('Failed to update verification status');
      console.error('Error updating verification:', error);
    }
  };

  // Handle reject with reason
  const handleReject = (verification) => {
    setVerificationToReject(verification);
    setShowRejectionModal(true);
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    handleStatusUpdate(verificationToReject.id, 'rejected', rejectionReason);
    setShowRejectionModal(false);
    setRejectionReason('');
    setVerificationToReject(null);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>;
      case 'verified':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>;
      default:
        return null;
    }
  };

  // Get document type display name
  const getDocumentTypeName = (type) => {
    switch (type) {
      case 'aadhaar': return 'Aadhaar Card';
      case 'pan': return 'PAN Card';
      case 'driver_license': return 'Driver License';
      case 'rc': return 'RC Book';
      case 'puc': return 'PUC Certificate';
      case 'insurance': return 'Insurance Policy';
      default: return type;
    }
  };

  const DocumentViewer = ({ document, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-screen overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {getDocumentTypeName(document.verification_type)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {document.document_url && (
            <img
              src={document.document_url}
              alt={getDocumentTypeName(document.verification_type)}
              className="max-w-full h-auto"
            />
          )}
          <div className="mt-4 flex space-x-2">
            {document.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleStatusUpdate(document.id, 'verified');
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(document);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Driver List
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-black">{user?.email}</p>
                <p className="text-black">{user?.phone_number}</p>
              </div>
            </div>
            {/* <div className="text-right">
              <div className="text-sm text-gray-500">Driver ID</div>
              <div className="font-semibold">{driver.id}</div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-black text-lg font-semibold mb-4">Driver Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Aadhaar Card:</span>
              <div className="font-medium text-gray-800">{driver.aadhar_card}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">PAN Card:</span>
              <div className="font-medium text-gray-800">{driver.pan_card}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Driver License:</span>
              <div className="font-medium text-gray-800">{driver.driver_license}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-black text-lg font-semibold mb-4">Verification Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">Aadhaar:</span>
              {getStatusBadge(
                driverVerifications.find(v => v.verification_type === 'aadhaar')?.status || 'pending'
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">PAN:</span>
              {getStatusBadge(
                driverVerifications.find(v => v.verification_type === 'pan')?.status || 'pending'
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">License:</span>
              {getStatusBadge(
                driverVerifications.find(v => v.verification_type === 'driver_license')?.status || 'pending'
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg text-black font-semibold mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Documents:</span>
              <span className="font-medium text-gray-800">{driverVerifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Vehicles:</span>
              <span className="font-medium text-gray-800">{vehicles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending Reviews:</span>
              <span className="font-medium text-yellow-600">
                {driverVerifications.filter(v => v.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("driver")}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === "driver"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Driver Documents ({driverVerifications.length})
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === "vehicles"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Vehicles ({vehicles.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "driver" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {driverVerifications.map((verification) => (
            <div key={verification.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg text-gray-800 font-semibold">
                    {getDocumentTypeName(verification.verification_type)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(verification.created_at).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(verification.status)}
              </div>

              {verification.rejection_reason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Rejection Reason:</span>
                  </div>
                  <p className="text-sm text-red-700">{verification.rejection_reason}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDocument(verification)}
                  className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Document
                </button>
                
                {verification.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(verification.id, 'verified')}
                      className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(verification)}
                      className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => onVehicleClick(vehicle)}
              className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Car className="w-5 h-5 mr-2 text-blue-600" />
                    {vehicle.vehicle_type}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.rc_number}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Documents</div>
                  <div className="font-semibold">
                    {vehicleVerifications.filter(v => v.entity_id === vehicle.id).length}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Color:</span> {vehicle.color}
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Year:</span> {vehicle.year}
                </div>
              </div>

              <div className="mt-4 flex space-x-1">
                {['rc', 'puc', 'insurance'].map(docType => {
                  const verification = vehicleVerifications.find(v => 
                    v.entity_id === vehicle.id && v.verification_type === docType
                  );
                  return (
                    <div key={docType} className="w-2 h-2 rounded-full">
                      <div className={`w-full h-full rounded-full ${
                        verification?.status === 'verified' ? 'bg-green-400' :
                        verification?.status === 'rejected' ? 'bg-red-400' :
                        verification?.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Reject Verification</h3>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Please provide a clear reason for rejection..."
              />
            </div>
            <div className="p-4 border-t flex space-x-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setVerificationToReject(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVerificationCard;
