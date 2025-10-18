import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import KycStatsCards from '@/Components/Admin/Kyc/KycStatsCards';
import KycFilters from '@/Components/Admin/Kyc/KycFilters';
import KycTable from '@/Components/Admin/Kyc/KycTable';
import KycDocumentModal from '@/Components/Admin/Kyc/KycDocumentModal';
import KycRejectModal from '@/Components/Admin/Kyc/KycRejectModal';
import KycPagination from '@/Components/Admin/Kyc/KycPagination';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';
import Toast from '@/Components/Trading/Toast';

export default function KycIndex() {
  const { kycs, stats, filters, auth, flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast for flash messages
  useEffect(() => {
    if (flash?.success) {
      setToast({
        message: flash.success,
        type: 'success'
      });
    } else if (flash?.error) {
      setToast({
        message: flash.error,
        type: 'error'
      });
    }
  }, [flash]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.kyc'), {
      search: searchQuery,
      status: statusFilter,
    });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    router.get(route('admin.kyc'), {
      search: searchQuery,
      status: status,
    });
  };

  const handleApprove = (kycId) => {
    setSelectedKyc(kycs.data.find(k => k.id === kycId));
    setShowApproveModal(true);
  };

  const confirmApprove = () => {
    setProcessing(true);
    router.post(route('admin.kyc.approve', selectedKyc.id), {}, {
      onSuccess: () => {
        setToast({
          message: 'KYC approved successfully!',
          type: 'success'
        });
        setShowApproveModal(false);
        setSelectedKyc(null);
      },
      onError: () => {
        setToast({
          message: 'Failed to approve KYC',
          type: 'error'
        });
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const openRejectModal = (kyc) => {
    setSelectedKyc(kyc);
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setToast({
        message: 'Please provide a rejection reason',
        type: 'error'
      });
      return;
    }

    setProcessing(true);
    router.post(route('admin.kyc.reject', selectedKyc.id), {
      reason: rejectReason
    }, {
      onSuccess: () => {
        setToast({
          message: 'KYC rejected successfully!',
          type: 'success'
        });
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedKyc(null);
      },
      onError: () => {
        setToast({
          message: 'Failed to reject KYC',
          type: 'error'
        });
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const openDocumentModal = (kyc) => {
    setSelectedKyc(kyc);
    setShowDocumentModal(true);
  };

  return (
    <AdminLayout user={auth.user} title="KYC Verification Management">
      <Head title="KYC Management" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            KYC Verification Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage user identity verification submissions
          </p>
        </div>

        {/* Statistics Cards */}
        <KycStatsCards stats={stats} />

        {/* Filters and Search */}
        <KycFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={handleStatusFilter}
          onSearch={handleSearch}
        />

        {/* KYC List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <KycTable
            kycs={kycs.data}
            processing={processing}
            onViewDocuments={openDocumentModal}
            onApprove={handleApprove}
            onReject={openRejectModal}
          />

          {/* Pagination */}
          <KycPagination kycs={kycs} />
        </div>
      </div>

      {/* Document View Modal */}
      {showDocumentModal && (
        <KycDocumentModal
          kyc={selectedKyc}
          onClose={() => setShowDocumentModal(false)}
          onApprove={handleApprove}
          onReject={openRejectModal}
        />
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedKyc(null);
        }}
        onConfirm={confirmApprove}
        title="Approve KYC Verification"
        message={`Are you sure you want to approve the KYC verification for ${selectedKyc?.user?.name}? This will grant them full platform access.`}
        confirmText="Approve KYC"
        cancelText="Cancel"
        type="success"
        loading={processing}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <KycRejectModal
          kyc={selectedKyc}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          processing={processing}
          onReject={handleReject}
          onClose={() => {
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedKyc(null);
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}