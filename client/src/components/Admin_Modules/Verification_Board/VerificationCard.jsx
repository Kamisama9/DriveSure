import { toast } from 'react-toastify';
import { useState } from 'react';

const VerificationCard = ({ entity, onClose, onUpdateStatus }) => {
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, verificationId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  
  if (!entity) return null;

  const stop = (e) => e.stopPropagation();

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getVerificationTypeDisplay = (type) => {
    const typeMap = {
      aadhaar: 'Aadhaar Card',
      pan: 'PAN Card',
      driver_license: 'Driver License',
      rc: 'RC (Registration Certificate)',
      puc: 'PUC (Pollution Certificate)',
      insurance: 'Insurance Certificate'
    };
    return typeMap[type] || type;
  };

  const handleRejectClick = (verificationId) => {
    setRejectionModal({ isOpen: true, verificationId });
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await onUpdateStatus(rejectionModal.verificationId, 'rejected', rejectionReason);
      setRejectionModal({ isOpen: false, verificationId: null });
      setRejectionReason('');
      // Parent component already handles success notification - don't show duplicate toast
    } catch {
      toast.error('Failed to reject verification');
    }
  };

  const handleRejectCancel = () => {
    setRejectionModal({ isOpen: false, verificationId: null });
    setRejectionReason('');
    // Keep the verification card open - don't call onClose or any refresh
  };

  const handleStatusUpdate = async (verificationId, newStatus) => {
    try {
      await onUpdateStatus(verificationId, newStatus);
      // Parent component already handles success notification - don't show duplicate toast
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openDocument = (documentUrl) => {
    // TODO: Implement document viewing functionality
    console.log('View document:', documentUrl);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEntityTitle = () => {
    const entityTypeLabel = entity.entityType === "drivers" ? "Driver" : "Vehicle";
    const documentCount = entity.verifications.length;
    
    if (entity.entityType === "drivers") {
      return `${entityTypeLabel} Verifications - ${entity.entityDetails.aadhar_card || 'Unknown'} (${documentCount} Documents)`;
    } else {
      return `${entityTypeLabel} Verifications - ${entity.entityDetails.rc_number || 'Unknown'} (${entity.entityDetails.vehicle_type || 'Unknown'}) (${documentCount} Documents)`;
    }
  };

  // Show all verifications (no filtering needed)
  const filteredVerifications = entity.verifications;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto no-scrollbar relative ml-8"
        onClick={stop}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 inline-flex items-center justify-center
                            h-11 w-11 rounded-full cursor-pointer
                            text-gray-600 hover:text-red-700 hover:bg-gray-100
                            transition-colors duration-150 ease-out"
          >
            <span className="pointer-events-none text-2xl leading-none text-black">×</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{getEntityTitle()}</h2>
            <div className="text-sm text-gray-600">
              All Verifications: {filteredVerifications.length}
            </div>
          </div>

          {/* Entity Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {entity.entityType === "drivers" ? "Driver Details" : "Vehicle Details"}
            </h3>
            
            {entity.entityType === "drivers" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm">
                <div><span className="font-medium">Aadhaar:</span> {entity.entityDetails.aadhar_card}</div>
                <div><span className="font-medium">PAN:</span> {entity.entityDetails.pan_card}</div>
                <div><span className="font-medium">License:</span> {entity.entityDetails.driver_license}</div>
                <div><span className="font-medium">License Expiry:</span> {entity.entityDetails.driver_license_expiry}</div>
                <div><span className="font-medium">Created:</span> {formatDate(entity.entityDetails.created_at)}</div>
                <div><span className="font-medium">Updated:</span> {formatDate(entity.entityDetails.updated_at)}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm">
                <div><span className="font-medium">RC Number:</span> {entity.entityDetails.rc_number}</div>
                <div><span className="font-medium">Vehicle Type:</span> {entity.entityDetails.vehicle_type}</div>
                <div><span className="font-medium">PUC Number:</span> {entity.entityDetails.puc_number}</div>
                <div><span className="font-medium">PUC Expiry:</span> {entity.entityDetails.puc_expiry}</div>
                <div><span className="font-medium">Insurance Policy:</span> {entity.entityDetails.insurance_policy_number}</div>
                <div><span className="font-medium">Insurance Expiry:</span> {entity.entityDetails.insurance_expiry}</div>
              </div>
            )}
          </div>

          {/* Verification Requests */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Document Verifications
            </h3>
            
            <div className="grid gap-4">
              {filteredVerifications.map((verification) => (
                <div key={verification.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-lg flex items-center gap-2">
                        {getVerificationTypeDisplay(verification.verification_type)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(verification.status)}`}>
                          {verification.status.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Document: {verification.document_number}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {formatDate(verification.submitted_at)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => openDocument(verification.document_url)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
                    >
                      View Document
                    </button>
                    
                    {verification.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(verification.id, 'verified')}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClick(verification.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {verification.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(verification.id, 'pending')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition duration-200 text-sm font-medium"
                      >
                        Reset to Pending
                      </button>
                    )}
                  </div>

                  {/* Rejection Reason Display */}
                  {verification.rejection_reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{verification.rejection_reason}</p>
                    </div>
                  )}

                  {/* Document Info */}
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <span>File Type: {verification.document_mime}</span>
                      <span>Size: {(verification.document_size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVerifications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No verification requests found.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={stop}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Reject Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this verification:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none text-gray-800 bg-white placeholder-gray-500 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleRejectCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200 shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 font-medium shadow-lg"
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

export default VerificationCard;
