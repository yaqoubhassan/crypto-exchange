import React from 'react';

export default function KycDocumentModal({ kyc, onClose, onApprove, onReject }) {
  if (!kyc) return null;

  const getDocumentTypeLabel = (type) => {
    const labels = {
      passport: 'Passport',
      driver_license: 'Driver License',
      national_id: 'National ID',
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                KYC Documents - {kyc.user?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Document Type: {getDocumentTypeLabel(kyc.document_type)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Personal Information */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.first_name} {kyc.last_name}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.date_of_birth}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.nationality}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.phone_number}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                <p className="text-gray-900 dark:text-white font-medium">
                  {kyc.address}, {kyc.city}, {kyc.state_province} {kyc.postal_code}, {kyc.country}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Document Number:</span>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.document_number}</p>
              </div>
            </div>
          </div>

          {/* Document Images */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Document Front</h4>
              <img
                src={`/storage/${kyc.document_front_image}`}
                alt="Document Front"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>

            {kyc.document_back_image && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Document Back</h4>
                <img
                  src={`/storage/${kyc.document_back_image}`}
                  alt="Document Back"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Selfie Verification</h4>
              <img
                src={`/storage/${kyc.selfie_image}`}
                alt="Selfie"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Action buttons for pending status */}
          {kyc.verification_status === 'pending' && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  onApprove(kyc.id);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Approve KYC
              </button>
              <button
                onClick={() => {
                  onClose();
                  onReject(kyc);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reject KYC
              </button>
            </div>
          )}

          {/* Show rejection reason if rejected */}
          {kyc.verification_status === 'rejected' && kyc.rejection_reason && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">Rejection Reason</h4>
              <p className="text-red-700 dark:text-red-300">{kyc.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}