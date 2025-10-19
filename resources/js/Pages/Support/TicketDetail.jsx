import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function TicketDetail({ auth, ticket }) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
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

  const handleCloseTicket = () => {
    setProcessing(true);
    router.post(route('support.close', ticket.id), {}, {
      onSuccess: () => {
        setShowCloseConfirm(false);
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canClose = ['open', 'in_progress'].includes(ticket.status);

  return (
    <DashboardLayout user={auth.user}>
      <Head title={`Ticket #${ticket.ticket_number}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/support" className="text-gray-500 hover:text-gray-700">
                    Support
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">#{ticket.ticket_number}</span>
                </li>
              </ol>
            </nav>
          </div>

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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-indigo-100">
                    Created on {formatDate(ticket.created_at)}
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {ticket.message}
                  </div>

                  {/* Attachments */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
                      <div className="space-y-2">
                        {ticket.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={`/storage/${attachment.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Response */}
                  {ticket.admin_response && (
                    <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">Admin Response</h3>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.admin_response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

                {canClose ? (
                  <div className="space-y-3">
                    {showCloseConfirm ? (
                      <>
                        <p className="text-sm text-gray-700 mb-3">
                          Are you sure you want to close this ticket?
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowCloseConfirm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCloseTicket}
                            disabled={processing}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
                          >
                            {processing ? 'Closing...' : 'Close Ticket'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowCloseConfirm(true)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      This ticket is {ticket.status === 'resolved' ? 'resolved' : 'closed'}
                    </p>
                  </div>
                )}
              </div>

              {/* Ticket Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {ticket.category}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(ticket.created_at)}
                    </dd>
                  </div>

                  {ticket.resolved_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Resolved</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(ticket.resolved_at)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Need More Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check our help center for instant answers to common questions.
                </p>
                <Link
                  href="/help"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Visit Help Center
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}