import React from 'react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger', 'warning', 'success', 'info'
  loading = false,
  children
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: '⚠️',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      messageBg: 'bg-red-50 border-red-200'
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
      messageBg: 'bg-yellow-50 border-yellow-200'
    },
    success: {
      icon: '✓',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600 hover:bg-green-700',
      messageBg: 'bg-green-50 border-green-200'
    },
    info: {
      icon: 'ℹ',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      messageBg: 'bg-blue-50 border-blue-200'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className={`${styles.iconBg} rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0`}>
              <span className={`text-2xl ${styles.iconColor}`}>{styles.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {!loading && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {message && (
            <div className={`rounded-lg p-4 border ${styles.messageBg}`}>
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonBg}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}