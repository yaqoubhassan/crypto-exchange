import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.jsx';

export default function OrdersIndex({ orders, stats, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
  const [filterSide, setFilterSide] = useState(filters.side || 'all');
  const [filterType, setFilterType] = useState(filters.type || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const applyFilters = () => {
    router.get('/orders', {
      search: searchTerm,
      status: filterStatus,
      side: filterSide,
      type: filterType,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterSide('all');
    setFilterType('all');
    router.get('/orders', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setCancelingOrder(selectedOrder.id);
    try {
      await router.post(`/orders/${selectedOrder.id}/cancel`, {}, {
        onSuccess: () => {
          setShowCancelModal(false);
          setSelectedOrder(null);
        },
        onError: () => {
          alert('Failed to cancel order');
        },
        onFinish: () => {
          setCancelingOrder(null);
        }
      });
    } catch (error) {
      setCancelingOrder(null);
      alert('Error canceling order');
    }
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

  const getSideIcon = (side) => {
    return side === 'buy' ? '📈' : '📉';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (filled, total) => {
    return ((parseFloat(filled) / parseFloat(total)) * 100).toFixed(2);
  };

  return (
    <DashboardLayout>
      <Head title="Orders" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all your trading orders
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{stats.active}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">{stats.this_week}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search by order ID or currency pair..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>🎚️</span>
              <span>Filters</span>
            </button>

            {/* Search Button */}
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="filled">Filled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Side
                </label>
                <select
                  value={filterSide}
                  onChange={(e) => setFilterSide(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Sides</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                  <option value="stop_limit">Stop Limit</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table - Desktop */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.data && orders.data.length > 0 ? (
                orders.data.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getSideIcon(order.side)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.time_in_force || 'GTC'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSideBadge(order.side)}`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.price ? `$${parseFloat(order.price).toFixed(2)}` : 'Market'}
                      </div>
                      {order.average_price && (
                        <div className="text-xs text-gray-500">
                          Avg: ${parseFloat(order.average_price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parseFloat(order.quantity).toFixed(8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parseFloat(order.filled_quantity).toFixed(8)}
                      </div>
                      {order.status === 'partial' && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${calculateProgress(order.filled_quantity, order.quantity)}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {['pending', 'partial'].includes(order.status) ? (
                        <button
                          onClick={() => openCancelModal(order)}
                          disabled={cancelingOrder === order.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your order history will appear here
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} results
              </div>
              <div className="flex space-x-2">
                {orders.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1 rounded-md text-sm ${link.active
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.data && orders.data.length > 0 ? (
          orders.data.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <span className="text-3xl mr-3">{getSideIcon(order.side)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      #{order.order_id}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)} flex-shrink-0 ml-2`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type / Side</p>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-700 capitalize">{order.type}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getSideBadge(order.side)}`}>
                      {order.side}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.price ? `$${parseFloat(order.price).toFixed(2)}` : 'Market'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {parseFloat(order.quantity).toFixed(8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Filled</p>
                    <p className="text-sm font-medium text-gray-900">
                      {parseFloat(order.filled_quantity).toFixed(8)}
                    </p>
                  </div>
                </div>

                {order.status === 'partial' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${calculateProgress(order.filled_quantity, order.quantity)}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    {formatDate(order.created_at)}
                  </div>
                  {['pending', 'partial'].includes(order.status) && (
                    <button
                      onClick={() => openCancelModal(order)}
                      disabled={cancelingOrder === order.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              Your order history will appear here
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {orders.links && orders.links.length > 3 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 text-center mb-3">
              Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {orders.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => link.url && router.get(link.url)}
                  disabled={!link.url || link.active}
                  className={`px-3 py-1 rounded-md text-sm ${link.active
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
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-6">
              <div className="text-sm text-gray-600">Order ID:</div>
              <div className="font-medium text-gray-900">{selectedOrder?.order_id}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelingOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelingOrder ? 'Canceling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}