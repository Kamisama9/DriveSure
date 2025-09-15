import React, { useState } from 'react';
import { ArrowLeft, Car, FileText, Clock, CheckCircle, XCircle, Eye, MessageSquare, User } from 'lucide-react';
import { toast } from 'react-toastify';

const VehicleVerificationCard = ({ 
  vehicle, 
  driver, 
  user, 
  verifications, 
  onBack, 
  onRefresh 
}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [verificationToReject, setVerificationToReject] = useState(null);

  // Get vehicle verifications
  const vehicleVerifications = verifications.filter(v => 
    v.entity_type === "vehicle" && v.entity_id === vehicle.id
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
          Back to Driver Details
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vehicle.vehicle_type}
                </h1>
                <p className="text-gray-600">{vehicle.rc_number}</p>
                <p className="text-gray-600">{vehicle.color} • {vehicle.year}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Vehicle ID</div>
              <div className="font-semibold">{vehicle.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Owner Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-500">Name:</span>
            <div className="font-medium">{user?.first_name} {user?.last_name}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email:</span>
            <div className="font-medium">{user?.email}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Phone:</span>
            <div className="font-medium">{user?.phone_number}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Driver License:</span>
            <div className="font-medium">{driver?.driver_license}</div>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">RC Number:</span>
              <div className="font-medium">{vehicle.rc_number}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">PUC Number:</span>
              <div className="font-medium">{vehicle.puc_number || 'N/A'}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Insurance Policy:</span>
              <div className="font-medium">{vehicle.insurance_policy_number || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">RC Book:</span>
              {getStatusBadge(
                vehicleVerifications.find(v => v.verification_type === 'rc')?.status || 'pending'
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">PUC Certificate:</span>
              {getStatusBadge(
                vehicleVerifications.find(v => v.verification_type === 'puc')?.status || 'pending'
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Insurance:</span>
              {getStatusBadge(
                vehicleVerifications.find(v => v.verification_type === 'insurance')?.status || 'pending'
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Documents:</span>
              <span className="font-medium">{vehicleVerifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Verified:</span>
              <span className="font-medium text-green-600">
                {vehicleVerifications.filter(v => v.status === 'verified').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending:</span>
              <span className="font-medium text-yellow-600">
                {vehicleVerifications.filter(v => v.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Documents */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Vehicle Documents</h3>
        
        {vehicleVerifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h4>
            <p className="text-gray-500">No verification documents have been submitted for this vehicle yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicleVerifications.map((verification) => (
              <div key={verification.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {getDocumentTypeName(verification.verification_type)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(verification.created_at).toLocaleDateString()}
                    </p>
                    {verification.reviewed_at && (
                      <p className="text-sm text-gray-500">
                        Reviewed: {new Date(verification.reviewed_at).toLocaleDateString()}
                      </p>
                    )}
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
        )}
      </div>

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

export default VehicleVerificationCard;
