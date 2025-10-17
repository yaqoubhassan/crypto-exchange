import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SupportShow({ auth, ticket }) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: responseData, setData: setResponseData, post: postResponse, processing: processingResponse, errors: responseErrors } = useForm({
    response: ''
  });

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

  const handleStatusChange = (newStatus) => {
    router.post(`/admin/support/${ticket.id}/status`, {
      status: newStatus
    }, {
      preserveScroll: true
    });
  };

  const handlePriorityChange = (newPriority) => {
    router.post(`/admin/support/${ticket.id}/priority`, {
      priority: newPriority
    }, {
      preserveScroll: true
    });
  };

  const handleResponse = (e) => {
    e.preventDefault();
    postResponse(`/admin/support/${ticket.id}/respond`, {
      onSuccess: () => {
        setResponseData('response', '');
        setShowResponseForm(false);
      }
    });
  };

  const handleDelete = () => {
    router.delete(`/admin/support/${ticket.id}`, {
      onSuccess: () => {
        router.visit('/admin/support');
      }
    });
  };

  const statusStyle = getStatusBadge(ticket.status);
  const priorityStyle = getPriorityBadge(ticket.priority);

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Ticket #{ticket.ticket_number}
          </h2>
          <Link
            href="/admin/support"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all tickets
          </Link>
        </div>
      }
    >
      <Head title={`Ticket #${ticket.ticket_number} - Admin`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Details Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
                      <div className="flex items-center space-x-3 text-indigo-100">
                        <span className="font-mono text-sm">{ticket.ticket_number}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.category}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon} {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${priorityStyle.dot} mr-1.5`}></span>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {ticket.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{ticket.user?.name}</h3>
                          <p className="text-sm text-gray-500">{ticket.user?.email}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments ({ticket.attachments.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ticket.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={`/storage/${attachment.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Response */}
                {ticket.admin_response && (
                  <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">Support Team Response</h3>
                            <p className="text-sm text-gray-500">
                              {ticket.resolver?.name} • {new Date(ticket.updated_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{ticket.admin_response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                {showResponseForm ? (
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <form onSubmit={handleResponse}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Response
                      </label>
                      <textarea
                        value={responseData.response}
                        onChange={(e) => setResponseData('response', e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Write your response to the user..."
                      />
                      {responseErrors.response && (
                        <p className="mt-1 text-sm text-red-600">{responseErrors.response}</p>
                      )}
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowResponseForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={processingResponse}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {processingResponse ? 'Sending...' : 'Send Response'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  !ticket.admin_response && (
                    <div className="p-6">
                      <button
                        onClick={() => setShowResponseForm(true)}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Respond to Ticket
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                      <p className="text-sm text-gray-500">
                        {ticket.user?.name} created this ticket
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(ticket.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {ticket.admin_response && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">Response Added</p>
                        <p className="text-sm text-gray-500">
                          {ticket.resolver?.name} responded to the ticket
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(ticket.updated_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {ticket.resolved_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">Ticket Resolved</p>
                        <p className="text-sm text-gray-500">
                          {ticket.resolver?.name} marked this as resolved
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(ticket.resolved_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

                {/* Status Actions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="space-y-2">
                    {['open', 'in_progress', 'resolved', 'closed'].map((status) => {
                      const style = getStatusBadge(status);
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={ticket.status === status}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${ticket.status === status
                            ? `${style.bg} ${style.text} cursor-not-allowed`
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span className="mr-2">{style.icon}</span>
                          {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Actions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Priority
                  </label>
                  <div className="space-y-2">
                    {['urgent', 'high', 'medium', 'low'].map((priority) => {
                      const style = getPriorityBadge(priority);
                      return (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(priority)}
                          disabled={ticket.priority === priority}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${ticket.priority === priority
                            ? `${style.bg} ${style.text} cursor-not-allowed`
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full ${style.dot} mr-2`}></span>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delete Action */}
                <div className="pt-6 border-t border-gray-200">
                  {showDeleteConfirm ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        Are you sure you want to delete this ticket? This action cannot be undone.
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Ticket Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ticket Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{ticket.ticket_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(ticket.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                  {ticket.resolved_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Resolved At</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(ticket.resolved_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* User Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-2xl">
                      {ticket.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{ticket.user?.name}</h4>
                    <p className="text-sm text-gray-500">{ticket.user?.email}</p>
                  </div>
                </div>
                <Link
                  href={`/admin/users/${ticket.user?.id}`}
                  className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium text-center block"
                >
                  View User Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}