import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';

export default function DashboardHeader({ user }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState(null);

  // Properly destructure notifications from props
  const { notifications = [], unreadCount = 0, flash } = usePage().props;

  // Show toast for flash messages
  useEffect(() => {
    if (flash?.success) {
      setToast({
        message: flash.success,
        type: 'success'
      });
    } else if (flash?.error) {
      setToast({
        message: flash.error,
        type: 'error'
      });
    }
  }, [flash]);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const markAsRead = (notificationId) => {
    router.post(`/notifications/${notificationId}/read`, {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const markAllAsRead = () => {
    router.post('/notifications/mark-all-read', {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const openClearModal = () => {
    setShowNotifications(false); // Close dropdown first
    setShowClearModal(true);
  };

  const clearAllNotifications = () => {
    setClearing(true);

    router.delete('/notifications/clear-all', {
      preserveScroll: true,
      preserveState: false, // Force reload to update notifications count
      onSuccess: () => {
        setShowClearModal(false);
        setShowNotifications(false);
        setClearing(false);
        setToast({
          message: 'All notifications cleared successfully!',
          type: 'success'
        });
      },
      onError: (errors) => {
        setClearing(false);
        setToast({
          message: errors?.message || 'Failed to clear notifications. Please try again.',
          type: 'error'
        });
      },
      onFinish: () => {
        setClearing(false);
      }
    });
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to link if exists
    if (notification.link) {
      router.visit(notification.link);
    }

    setShowNotifications(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[60] shadow-sm">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:pl-72 lg:pr-8">
          {/* Logo/Brand - Always visible */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block whitespace-nowrap">CryptoExchange</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-w-[calc(100vw-2rem)]">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      {notifications.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="flex-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1 px-2 rounded hover:bg-indigo-50 transition-colors"
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            onClick={openClearModal}
                            className="flex-1 text-xs text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
                              }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 text-2xl">
                                {notification.icon || '📢'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${notification.is_read ? 'text-gray-700' : 'text-gray-900'
                                    }`}>
                                    {notification.title}
                                  </p>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatTime(notification.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <div className="text-4xl mb-2">🔔</div>
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-200">
                      <Link
                        href="/notifications"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.email_verified_at ? (
                      <span className="text-green-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      'Not verified'
                    )}
                  </p>
                </div>
                <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/wallet"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Wallet
                      </Link>
                      <Link
                        href="/security"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Security
                      </Link>
                    </div>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Clear All Notifications Modal - High z-index to be above header */}
      <div className="relative z-[70]">
        <Modal show={showClearModal} onClose={() => !clearing && setShowClearModal(false)} maxWidth="md">
          <div className="p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🗑️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Clear All Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowClearModal(false)}
                disabled={clearing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={clearAllNotifications}
                disabled={clearing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {clearing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Clearing...
                  </div>
                ) : 'Clear All'}
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}