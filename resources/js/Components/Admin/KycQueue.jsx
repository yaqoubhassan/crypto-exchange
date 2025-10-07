import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function KycQueue({ applications }) {
    const [processing, setProcessing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = async (kycId) => {
        if (processing) return;
        
        setProcessing(kycId);
        
        try {
            const response = await fetch(route('admin.kyc.approve', kycId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            if (response.ok) {
                router.reload({ only: ['pendingKyc'] });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async () => {
        if (!rejectReason || processing) return;
        
        setProcessing(selectedApp.id);
        
        try {
            const response = await fetch(route('admin.kyc.reject', selectedApp.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ reason: rejectReason })
            });

            if (response.ok) {
                setShowModal(false);
                setRejectReason('');
                setSelectedApp(null);
                router.reload({ only: ['pendingKyc'] });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setProcessing(null);
        }
    };

    const openRejectModal = (app) => {
        setSelectedApp(app);
        setShowModal(true);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">KYC Verification Queue</h3>
                    <p className="text-sm text-gray-600 mt-1">{applications.length} applications pending review</p>
                </div>
                
                <div className="p-6 space-y-4">
                    {applications.map((application) => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {application.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{application.user?.name}</h4>
                                            <p className="text-sm text-gray-500">{application.user?.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Full Name:</span>
                                            <span className="ml-2 text-gray-900 font-medium">
                                                {application.first_name} {application.last_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Document Type:</span>
                                            <span className="ml-2 text-gray-900 font-medium capitalize">
                                                {application.document_type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Nationality:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{application.nationality}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Submitted:</span>
                                            <span className="ml-2 text-gray-900 font-medium">
                                                {new Date(application.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            application.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            application.verification_status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {application.verification_status?.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-4">
                                    <button 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Documents
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(application.id)}
                                        disabled={processing === application.id}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        {processing === application.id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button 
                                        onClick={() => openRejectModal(application)}
                                        disabled={processing === application.id}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {applications.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-2">✅</div>
                            <div className="font-medium">No pending KYC applications</div>
                            <div className="text-sm mt-1">All verifications are up to date</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject KYC Application</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejecting {selectedApp?.user?.name}'s application:
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows="4"
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setRejectReason('');
                                    setSelectedApp(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason || processing}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Rejecting...' : 'Reject Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}