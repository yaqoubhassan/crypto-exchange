import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { getStatusBadge, getSideBadge, getTypeBadge, formatCurrency, formatDate } from './orderUtils';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';

export default function OrderDetailModal({ order, onClose, onStatusChange, onShowToast }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!order) return null;

  const canApprove = order.status === 'pending';
  const canCancel = ['pending', 'partial'].includes(order.status);
  const canModifyStatus = ['pending', 'partial'].includes(order.status);

  const handleApprove = () => {
    setProcessing(true);
    router.post(`/admin/orders/${order.id}/approve`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setShowApproveModal(false);
        onShowToast('Order approved and filled successfully!', 'success');
        onClose();
      },
      onError: (errors) => {
        onShowToast(errors.message || 'Failed to approve order', 'error');
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      onShowToast('Please provide a reason for rejecting this order', 'error');
      return;
    }

    setProcessing(true);
    router.post(`/admin/orders/${order.id}/reject`, {
      reason: rejectReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowRejectModal(false);
        onShowToast('Order rejected successfully!', 'success');
        onClose();
      },
      onError: (errors) => {
        onShowToast(errors.message || 'Failed to reject order', 'error');
      },
      onFinish: () => {
        setProcessing(false);
        setRejectReason('');
      }
    });
  };

  const handleStatusChangeConfirm = () => {
    if (!pendingStatus) return;

    setProcessing(true);
    router.post(`/admin/orders/${order.id}/status`, {
      status: pendingStatus
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowStatusChangeModal(false);
        onShowToast(`Order status updated to ${pendingStatus}`, 'success');
        onClose();
      },
      onError: (errors) => {
        onShowToast(errors.message || 'Failed to update status', 'error');
      },
      onFinish: () => {
        setProcessing(false);
        setPendingStatus(null);
      }
    });
  };

  const initiateStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setShowStatusMenu(false);
    setShowStatusChangeModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order ID and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm text-gray-600">Order ID</div>
                <div className="text-lg font-mono font-medium text-gray-900">
                  {order.order_id}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                {canModifyStatus && (
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      title="Change Status"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    {showStatusMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => initiateStatusChange('pending')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set to Pending
                        </button>
                        <button
                          onClick={() => initiateStatusChange('partial')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set to Partial
                        </button>
                        <button
                          onClick={() => initiateStatusChange('filled')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set to Filled
                        </button>
                        <button
                          onClick={() => initiateStatusChange('expired')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set to Expired
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Name</div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.user?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Email</div>
                  <div className="text-sm font-medium text-gray-900 break-all">
                    {order.user?.email || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Order Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Trading Pair</div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.base_currency?.symbol || 'N/A'}/
                    {order.quote_currency?.symbol || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Type</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeBadge(order.type)}`}>
                    {order.type}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Side</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSideBadge(order.side)}`}>
                    {order.side === 'buy' ? '📈' : '📉'} {order.side}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Time in Force</div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.time_in_force}
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price & Quantity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Quantity</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.quantity)} {order.base_currency?.symbol}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Price</div>
                  <div className="text-sm font-medium text-gray-900">
                    ${formatCurrency(order.price || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Filled Quantity</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.filled_quantity || 0)} {order.base_currency?.symbol}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Average Price</div>
                  <div className="text-sm font-medium text-gray-900">
                    ${formatCurrency(order.average_price || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Total Value</div>
                  <div className="text-sm font-medium text-gray-900">
                    ${formatCurrency((order.quantity * (order.price || 0)))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Fill Percentage</div>
                  <div className="text-sm font-medium text-gray-900">
                    {((order.filled_quantity / order.quantity) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Timestamps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Created At</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Updated At</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.updated_at)}
                  </div>
                </div>
                {order.expires_at && (
                  <div>
                    <div className="text-xs text-gray-600">Expires At</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(order.expires_at)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Admin Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.visit(`/admin/users/${order.user?.id}`)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  👤 View User Profile
                </button>

                {canApprove && (
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Approve & Fill Order
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ❌ Reject Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => !processing && setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve & Fill Order"
        message={`Are you sure you want to approve and fill this ${order?.side} order for ${order?.quantity} ${order?.base_currency?.symbol}? This will execute the order and update user wallets.`}
        confirmText="Approve & Fill"
        type="success"
        loading={processing}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => {
          if (!processing) {
            setShowRejectModal(false);
            setRejectReason('');
          }
        }}
        onConfirm={handleReject}
        title="Reject Order"
        message="Please provide a reason for rejecting this order. The user will be notified."
        confirmText="Confirm Rejection"
        type="danger"
        loading={processing}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason *
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={processing}
          />
        </div>
      </ConfirmationModal>

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusChangeModal}
        onClose={() => {
          if (!processing) {
            setShowStatusChangeModal(false);
            setPendingStatus(null);
          }
        }}
        onConfirm={handleStatusChangeConfirm}
        title="Change Order Status"
        message={`Are you sure you want to change this order's status to "${pendingStatus}"? The user will be notified of this change.`}
        confirmText="Change Status"
        type="warning"
        loading={processing}
      />
    </>
  );
}