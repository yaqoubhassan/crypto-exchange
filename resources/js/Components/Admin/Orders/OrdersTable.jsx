import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { getStatusBadge, getSideBadge, formatCurrency, formatDateShort } from './orderUtils';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';

export default function OrdersTable({
  orders,
  selectedOrders,
  onSelectAll,
  onSelectOrder,
  onViewOrder,
  onShowToast
}) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApproveClick = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowApproveModal(true);
  };

  const handleRejectClick = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = () => {
    if (!selectedOrder) return;

    setProcessing(true);
    router.post(`/admin/orders/${selectedOrder.id}/approve`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setShowApproveModal(false);
        onShowToast('Order approved successfully!', 'success');
        setSelectedOrder(null);
      },
      onError: (errors) => {
        onShowToast(errors.message || 'Failed to approve order', 'error');
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const handleRejectConfirm = () => {
    if (!selectedOrder) return;

    if (!rejectReason.trim()) {
      onShowToast('Please provide a reason for rejecting this order', 'error');
      return;
    }

    setProcessing(true);
    router.post(`/admin/orders/${selectedOrder.id}/reject`, {
      reason: rejectReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowRejectModal(false);
        onShowToast('Order rejected successfully!', 'success');
        setSelectedOrder(null);
        setRejectReason('');
      },
      onError: (errors) => {
        onShowToast(errors.message || 'Failed to reject order', 'error');
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const handleCloseApproveModal = () => {
    if (!processing) {
      setShowApproveModal(false);
      setSelectedOrder(null);
    }
  };

  const handleCloseRejectModal = () => {
    if (!processing) {
      setShowRejectModal(false);
      setSelectedOrder(null);
      setRejectReason('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.data && orders.data.length > 0 ? (
                orders.data.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewOrder(order)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => onSelectOrder(order.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-indigo-600 font-mono text-sm font-medium">
                        #{order.order_id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {order.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {order.base_currency?.icon || '💰'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {order.base_currency?.symbol || 'N/A'}/
                          {order.quote_currency?.symbol || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSideBadge(order.side)}`}>
                        {order.side === 'buy' ? '📈' : '📉'} {order.side}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.quantity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        @ ${formatCurrency(order.price || 0)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDateShort(order.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </button>
                        {order.status === 'pending' && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={(e) => handleApproveClick(order, e)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium"
                              title="Approve Order"
                            >
                              ✓
                            </button>
                            <button
                              onClick={(e) => handleRejectClick(order, e)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                              title="Reject Order"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Orders will appear here once users place them
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {orders.links && orders.links.length > 3 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{orders.from || 0}</span> to{' '}
                <span className="font-medium">{orders.to || 0}</span> of{' '}
                <span className="font-medium">{orders.total || 0}</span> results
              </div>
              <div className="flex flex-wrap gap-2">
                {orders.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${link.active
                      ? 'bg-indigo-600 text-white'
                      : link.url
                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={handleCloseApproveModal}
        onConfirm={handleApproveConfirm}
        title="Approve & Fill Order"
        message={selectedOrder ? `Are you sure you want to approve and fill this ${selectedOrder.side} order for ${selectedOrder.quantity} ${selectedOrder.base_currency?.symbol}? This will execute the order and update user wallets.` : ''}
        confirmText="Approve & Fill"
        type="success"
        loading={processing}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={handleCloseRejectModal}
        onConfirm={handleRejectConfirm}
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
    </>
  );
}