import React from 'react';
import { Link } from '@inertiajs/react';

export default function SupportTicketsWidget({ tickets, stats }) {
  const getStatusBadge = (status) => {
    const styles = {
      open: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '⚫' }
    };
    return styles[status] || styles.open;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return styles[priority] || styles.medium;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <p className="text-sm text-gray-600 mt-1">Recent support requests</p>
        </div>
        <Link
          href="/admin/support"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
        >
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.open || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Open</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.in_progress || 0}</p>
          <p className="text-xs text-gray-600 mt-1">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.resolved || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Resolved</p>
        </div>
      </div>

      {/* Recent Tickets */}
      {tickets && tickets.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {tickets.slice(0, 5).map((ticket) => {
            const statusStyle = getStatusBadge(ticket.status);
            return (
              <Link
                key={ticket.id}
                href={`/admin/support/${ticket.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">
                        #{ticket.ticket_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ticket.user?.name} • {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm text-gray-600">No support tickets yet</p>
        </div>
      )}
    </div>
  );
}