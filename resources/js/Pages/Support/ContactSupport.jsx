import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AIChatbot from '@/Components/Support/AIChatbot';
import Toast from '@/Components/Trading/Toast';

export default function ContactSupport({ auth, tickets }) {
  const [showForm, setShowForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toast, setToast] = useState(null);

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

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 3 files
    if (files.length > 3) {
      setToast({
        type: 'error',
        message: 'You can only upload up to 3 files'
      });
      return;
    }

    // Create file preview data
    const fileData = files.map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: getFileIcon(file.type)
    }));

    setSelectedFiles(fileData);
    setData('attachments', files);
  };

  // Get appropriate icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Remove a file from selection
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setData('attachments', newFiles.map(f => f.file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/support', {
      onSuccess: () => {
        reset();
        setSelectedFiles([]);
        setShowForm(false);
        setToast({
          type: 'success',
          message: 'Support ticket submitted successfully!'
        });
      },
      onError: () => {
        setToast({
          type: 'error',
          message: 'Failed to submit ticket. Please try again.'
        });
      }
    });
  };

  // Handle escalation from AI chat to support ticket
  const handleEscalateToTicket = (chatHistory) => {
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
    <DashboardLayout user={auth.user}>
      <Head title="Contact Support" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Support</h1>
              <p className="mt-1 text-sm text-gray-600">Get help or submit a support ticket</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowAIChat(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium text-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                AI Chat
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Ticket
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          {!showForm && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Open Tickets</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {tickets.data?.filter(t => t.status === 'open').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                      {tickets.data?.filter(t => t.status === 'in_progress').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-200 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {tickets.data?.filter(t => t.status === 'resolved').length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
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
                          onChange={handleFileChange}
                        />
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB (max 3 files)</p>
                  </div>
                  {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}

                  {/* File Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <span className="text-2xl">{file.preview}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove file"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedFiles([]);
                      reset();
                    }}
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
                        href={`/support/${ticket.id}`}
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