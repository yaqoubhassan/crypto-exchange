import React, { useEffect, useState } from 'react';

export default function Toast({ message, description, type = 'info', icon, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✓',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '✕',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed top-20 right-4 z-[100] max-w-md w-full transform transition-all duration-300 ${isExiting
        ? 'translate-x-full opacity-0'
        : 'translate-x-0 opacity-100'
        }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border rounded-xl shadow-2xl p-4 flex items-start space-x-3 backdrop-blur-sm`}
      >
        <div className={`flex-shrink-0 w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center`}>
          <span className={`text-lg ${styles.iconColor}`}>{icon || styles.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${styles.text}`}>{message}</p>
          {description && (
            <p className={`text-xs ${styles.text} opacity-90 mt-1`}>{description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className={`h-1 ${styles.bg} rounded-b-xl overflow-hidden`}>
        <div
          className={`h-full ${styles.iconBg} transition-all ease-linear`}
          style={{
            width: '100%',
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>

      <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
    </div>
  );
}