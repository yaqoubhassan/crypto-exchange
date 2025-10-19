import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AIChatbot from '@/Components/Support/AIChatbot';

export default function ContactSupport({ auth, tickets }) {
  const [showForm, setShowForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: '',
    attachments: []
  });

  const categories = [
    { value: 'account', label: 'Account & Login', icon: '👤' },
    { value: 'trading', label: 'Trading Issues', icon: '💹' },
    { value: 'wallet', label: 'Wallet & Payments', icon: '💰' },
    { value: 'technical', label: 'Technical Support', icon: '🔧' },
    { value: 'security', label: 'Security Concerns', icon: '🔐' },
    { value: 'other', label: 'Other', icon: '📋' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'gray', description: 'General inquiry' },
    { value: 'medium', label: 'Medium', color: 'blue', description: 'Issue affecting usage' },
    { value: 'high', label: 'High', color: 'orange', description: 'Significant problem' },
    { value: 'urgent', label: 'Urgent', color: 'red', description: 'Critical issue' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/support', {
      onSuccess: () => {
        reset();
        setShowForm(false);
      }
    });
  };

  // Handle escalation from AI chat to support ticket
  const handleEscalateToTicket = (chatHistory) => {
    // Pre-fill the ticket form with chat context
    const chatContext = chatHistory
      .filter(msg => msg.type === 'user')
      .map(msg => msg.text)
      .join('\n');

    setData('message', `Chat History:\n${chatContext}\n\n---\nAdditional Details:`);
    setShowAIChat(false);
    setShowForm(true);
  };

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

  return (
    <DashboardLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Contact Support
        </h2>
      }
    >
      <Head title="Contact Support" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">Get help from our support team</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showForm ? 'Cancel' : 'New Ticket'}
            </button>
          </div>

          {/* Quick Help Cards */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* AI Chat Card - Enhanced */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 shadow-sm border-2 border-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full -mr-12 -mt-12 opacity-50"></div>
                <div className="relative">
                  <div className="text-3xl mb-3">💬</div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    AI Live Chat
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Instant
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Get instant answers from our AI assistant</p>
                  <button
                    onClick={() => setShowAIChat(true)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm flex items-center justify-center shadow-md"
                  >
                    Start AI Chat
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Help Center Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
                <p className="text-sm text-gray-600 mb-4">Browse FAQs and guides</p>
                <Link
                  href="/help"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                >
                  Visit Help Center
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Email Support Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">support@cryptoexchange.com</p>
                <a
                  href="mailto:support@cryptoexchange.com"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                >
                  Send Email
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* New Ticket Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Support Ticket</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={data.subject}
                    onChange={(e) => setData('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setData('category', category.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${data.category === category.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-medium text-gray-900">{category.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setData('priority', priority.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${data.priority === priority.value
                          ? `border-${priority.color}-600 bg-${priority.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="font-medium text-gray-900">{priority.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{priority.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describe your issue in detail..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  <p className="mt-2 text-sm text-gray-500">Minimum 10 characters</p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">
                      <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
                        Click to upload
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          onChange={(e) => setData('attachments', Array.from(e.target.files))}
                        />
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB (max 3 files)</p>
                  </div>
                  {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Tickets</h2>
              <p className="text-sm text-gray-600 mt-1">Track and manage your support requests</p>
            </div>

            {tickets.data && tickets.data.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {tickets.data.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-mono text-sm text-gray-500">
                            #{ticket.ticket_number}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {ticket.category}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/support/tickets/${ticket.id}`}
                        className="ml-4 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets yet</h3>
                <p className="text-gray-600 mb-6">Try our AI chat for instant help, or create a ticket if you need assistance</p>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Start AI Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {showAIChat && (
        <AIChatbot
          onClose={() => setShowAIChat(false)}
          onEscalateToTicket={handleEscalateToTicket}
        />
      )}
    </DashboardLayout>
  );
}