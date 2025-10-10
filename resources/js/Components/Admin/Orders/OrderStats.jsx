import React from 'react';

export default function OrderStats({ stats, orders }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.total || orders.total || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.pending || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Filled</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.filled || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {stats.cancelled || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              ${formatCurrency(stats.total_volume || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>
    </div>
  );
}