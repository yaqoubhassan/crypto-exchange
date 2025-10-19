import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function OrdersIndex({ orders }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSide, setFilterSide] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    router.get('/orders', {
      status: filterStatus,
      side: filterSide,
      type: filterType,
    });
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterSide('all');
    setFilterType('all');
    router.get('/orders');
  };

  const handleRowClick = (orderId) => {
    router.visit(`/orders/${orderId}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      partial: 'bg-blue-100 text-blue-800 border-blue-300',
      rejected: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getSideBadge = (side) => {
    return side === 'buy'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  const getSideIcon = (side) => {
    return side === 'buy' ? '📈' : '📉';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <Head title="My Orders" />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage your trading orders</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 mb-6 ${showFilters ? 'block' : 'hidden sm:block'}`}>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="partial">Partial</option>
                <option value="rejected">Rejected</option>
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
                <option value="all">Buy & Sell</option>
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
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
                  Side
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {orders.data && orders.data.length > 0 ? (
                orders.data.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getSideIcon(order.side)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_id.substring(0, 8)}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {order.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                      </div>
                      {order.price && (
                        <div className="text-xs text-gray-500">
                          ${parseFloat(order.price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSideBadge(order.side)}`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {parseFloat(order.quantity).toFixed(6)}
                      </div>
                      {order.filled_quantity > 0 && (
                        <div className="text-xs text-gray-500">
                          {((order.filled_quantity / order.quantity) * 100).toFixed(0)}% filled
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(order.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your orders will appear here once you start trading
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
                Showing <span className="font-medium">{orders.from || 0}</span> to{' '}
                <span className="font-medium">{orders.to || 0}</span> of{' '}
                <span className="font-medium">{orders.total || 0}</span> results
              </div>
              <div className="flex gap-2">
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.data && orders.data.length > 0 ? (
          orders.data.map((order) => (
            <div
              key={order.id}
              onClick={() => handleRowClick(order.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getSideIcon(order.side)}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      #{order.order_id.substring(0, 8)}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Side</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${getSideBadge(order.side)}`}>
                    {order.side.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-sm font-medium text-gray-900 capitalize mt-1">
                    {order.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {parseFloat(order.quantity).toFixed(6)}
                  </div>
                </div>
                {order.price && (
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      ${parseFloat(order.price).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar for Partial Fills */}
              {order.filled_quantity > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Filled</span>
                    <span>{((order.filled_quantity / order.quantity) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${(order.filled_quantity / order.quantity) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <span>{formatDate(order.created_at)}</span>
                <span>{formatTime(order.created_at)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              Your orders will appear here once you start trading
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {orders.links && orders.links.length > 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-700 text-center mb-3">
              Showing <span className="font-medium">{orders.from || 0}</span> to{' '}
              <span className="font-medium">{orders.to || 0}</span> of{' '}
              <span className="font-medium">{orders.total || 0}</span> results
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
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
        )}
      </div>
    </DashboardLayout>
  );
}