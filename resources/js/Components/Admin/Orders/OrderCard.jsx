import React from 'react';
import { router } from '@inertiajs/react';
import { getStatusBadge, getSideBadge, formatCurrency, formatDateShort } from './orderUtils';

export default function OrderCard({ order, onView, onSelect, isSelected, onShowToast }) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      onClick={() => onView(order)}
    >
      <div className="space-y-3">
        {/* Header: User & Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(order.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {order.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {order.user?.name || 'Unknown'}
              </div>
              <div className="text-xs text-gray-500">
                #{order.order_id.slice(-8)}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Trading Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Trading Pair</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-lg">{order.base_currency?.icon || '💰'}</span>
              <span className="font-medium text-gray-900">
                {order.base_currency?.symbol || 'N/A'}/
                {order.quote_currency?.symbol || 'N/A'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSideBadge(order.side)}`}>
              {order.side === 'buy' ? '📈' : '📉'} {order.side}
            </span>
          </div>
        </div>

        {/* Amount & Price */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Amount</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">
              {formatCurrency(order.quantity)}
            </div>
            <div className="text-xs text-gray-500">
              {order.base_currency?.symbol || 'N/A'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">
              ${formatCurrency(order.price || 0)}
            </div>
          </div>
        </div>

        {/* Footer: Date & Actions */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">
              {formatDateShort(order.created_at)}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(order);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
            >
              View Details →
            </button>
          </div>

          {/* Quick Actions for Pending Orders */}
          {order.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.post(`/admin/orders/${order.id}/approve`, {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                      onShowToast('Order approved successfully!', 'success');
                    },
                    onError: (errors) => {
                      onShowToast(errors.message || 'Failed to approve order', 'error');
                    }
                  });
                }}
                className="flex-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium hover:bg-green-100 transition-colors"
              >
                ✓ Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(order);
                }}
                className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition-colors"
              >
                ✕ Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}