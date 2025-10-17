import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SupportIndex({ auth, tickets, stats, filters }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [activeFilters, setActiveFilters] = useState({
    status: filters.status || 'all',
    priority: filters.priority || 'all',
    category: filters.category || 'all'
  });

  const handleFilter = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);

    router.get('/admin/support', {
      ...newFilters,
      search: searchQuery
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/support', {
      ...activeFilters,
      search: searchQuery
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

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
      low: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
    };
    return styles[priority] || styles.medium;
  };

  const statCards = [
    { label: 'Total Tickets', value: stats.total, color: 'indigo', icon: '📊' },
    { label: 'Open', value: stats.open, color: 'blue', icon: '🔵' },
    { label: 'In Progress', value: stats.in_progress, color: 'yellow', icon: '🟡' },
    { label: 'Resolved', value: stats.resolved, color: 'green', icon: '🟢' }
  ];

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Support Tickets Management
        </h2>
      }
    >
      <Head title="Support Tickets - Admin" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tickets, users, or ticket numbers..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  value={activeFilters.status}
                  onChange={(e) => handleFilter('status', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={activeFilters.priority}
                  onChange={(e) => handleFilter('priority', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Category Filter */}
                <select
                  value={activeFilters.category}
                  onChange={(e) => handleFilter('category', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="account">Account</option>
                  <option value="trading">Trading</option>
                  <option value="wallet">Wallet</option>
                  <option value="technical">Technical</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>

                {/* Reset Filters */}
                {(activeFilters.status !== 'all' || activeFilters.priority !== 'all' || activeFilters.category !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveFilters({ status: 'all', priority: 'all', category: 'all' });
                      setSearchQuery('');
                      router.get('/admin/support');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {tickets.data && tickets.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.data.map((ticket) => {
                        const statusStyle = getStatusBadge(ticket.status);
                        const priorityStyle = getPriorityBadge(ticket.priority);

                        return (
                          <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-mono text-sm text-indigo-600 font-medium">
                                  #{ticket.ticket_number}
                                </span>
                                <span className="text-sm font-medium text-gray-900 mt-1">
                                  {ticket.subject}
                                </span>
                                <span className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {ticket.message}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {ticket.user?.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {ticket.user?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {ticket.user?.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {ticket.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                                <span className={`w-2 h-2 rounded-full ${priorityStyle.dot} mr-1.5`}></span>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                <span className="mr-1">{statusStyle.icon}</span>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(ticket.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/admin/support/${ticket.id}`}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                View
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {tickets.links && (
                  <div className="bg-white px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{tickets.from}</span> to{' '}
                        <span className="font-medium">{tickets.to}</span> of{' '}
                        <span className="font-medium">{tickets.total}</span> tickets
                      </div>
                      <div className="flex space-x-2">
                        {tickets.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${link.active
                              ? 'bg-indigo-600 text-white'
                              : link.url
                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600">
                  {searchQuery || activeFilters.status !== 'all' || activeFilters.priority !== 'all' || activeFilters.category !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'No support tickets have been created yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}