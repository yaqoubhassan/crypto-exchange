import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.jsx';
import Toast from '@/Components/Trading/Toast';

export default function OrderShow({ order, transactions }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [toast, setToast] = useState(null);

  const { flash } = usePage().props;

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

  const handleCancelOrder = () => {
    setCanceling(true);
    router.post(`/orders/${order.id}/cancel`, {}, {
      onSuccess: () => {
        setShowCancelModal(false);
        setCanceling(false);

        // Show success toast
        setToast({
          message: 'Order cancelled successfully! Funds have been released to your wallet.',
          type: 'success'
        });
      },
      onError: (errors) => {
        const errorMessage = errors.message || 'Failed to cancel order. Please try again.';
        setCanceling(false);

        // Show error toast
        setToast({
          message: errorMessage,
          type: 'error'
        });
      },
      onFinish: () => {
        setCanceling(false);
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      partial: 'bg-blue-100 text-blue-800 border-blue-200',
      filled: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSideBadge = (side) => {
    return side === 'buy'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateProgress = () => {
    return ((parseFloat(order.filled_quantity) / parseFloat(order.quantity)) * 100).toFixed(2);
  };

  const calculateTotal = () => {
    const price = order.average_price || order.price || order.base_currency?.current_price || 0;
    return (parseFloat(order.quantity) * parseFloat(price)).toFixed(2);
  };

  const calculateFilled = () => {
    const price = order.average_price || order.price || order.base_currency?.current_price || 0;
    return (parseFloat(order.filled_quantity) * parseFloat(price)).toFixed(2);
  };

  const canCancel = ['pending', 'partial'].includes(order.status);

  return (
    <DashboardLayout>
      <Head title={`Order #${order.order_id}`} />

      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/orders" className="text-gray-500 hover:text-gray-700">
                Orders
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">#{order.order_id}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              View complete information about this order
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}
            <Link
              href="/orders"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Order Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Order Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="text-base font-medium text-gray-900">{order.order_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trading Pair</p>
                <p className="text-base font-medium text-gray-900">
                  {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Side</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSideBadge(order.side)}`}>
                  {order.side}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="text-base font-medium text-gray-900 capitalize">{order.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-base font-medium text-gray-900">
                  {order.price ? `$${parseFloat(order.price).toFixed(2)}` : 'Market Price'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Quantity</p>
                <p className="text-base font-medium text-gray-900">
                  {parseFloat(order.quantity).toFixed(8)} {order.base_currency?.symbol}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Filled Quantity</p>
                <p className="text-base font-medium text-gray-900">
                  {parseFloat(order.filled_quantity).toFixed(8)} {order.base_currency?.symbol}
                </p>
              </div>
            </div>

            {order.average_price && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Fill Price</p>
                <p className="text-base font-medium text-gray-900">
                  ${parseFloat(order.average_price).toFixed(2)}
                </p>
              </div>
            )}

            {order.filled_quantity > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Fill Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{calculateProgress()}% filled</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${calculateTotal()}
                  </p>
                </div>
                {order.filled_quantity > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Filled Value</p>
                    <p className="text-xl font-bold text-green-600">
                      ${calculateFilled()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created At</p>
                  <p className="text-base font-medium text-gray-900">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-base font-medium text-gray-900">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            </div>

            {order.expires_at && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Expires At</p>
                <p className="text-base font-medium text-gray-900">{formatDate(order.expires_at)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Order Type</p>
              <p className="text-2xl font-bold capitalize">{order.type}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Trade Side</p>
              <p className="text-2xl font-bold uppercase">{order.side}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Pair</p>
              <p className="text-xl font-bold">
                {order.base_currency?.symbol}/{order.quote_currency?.symbol}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Status</p>
              <p className="text-xl font-bold capitalize">{order.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Transactions */}
      {transactions && transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Related Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">Trades executed as part of this order</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(transaction.amount).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.price ? parseFloat(transaction.price).toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? Any locked funds will be released back to your wallet.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{order.order_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">{order.type} {order.side}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium text-gray-900">
                  {(parseFloat(order.quantity) - parseFloat(order.filled_quantity)).toFixed(8)} {order.base_currency?.symbol}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {canceling ? 'Canceling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  );
}