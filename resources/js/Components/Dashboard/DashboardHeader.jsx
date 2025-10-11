import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';
import { useNotifications } from '@/Hooks/useNotifications';

export default function DashboardHeader({ user }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  const { flash } = usePage().props;

  // Use real-time notifications hook
  const {
    notifications,
    unreadCount,
    newNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestNotificationPermission,
  } = useNotifications();

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

  // Show new notification toast
  useEffect(() => {
    if (newNotification) {
      setToast({
        message: newNotification.title,
        description: newNotification.message,
        type: 'info',
        icon: newNotification.icon,
      });
    }
  }, [newNotification]);

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowPermissionBanner(true);
    }
  }, []);

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
  }, [user.profile_picture]);

  const handleLogout = () => {
    router.post(route('logout'));
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

  const openClearModal = () => {
    setShowNotifications(false);
    setShowClearModal(true);
  };

  const clearAllNotifications = () => {
    setClearing(true);
    clearAll();
    setShowClearModal(false);
    setClearing(false);
    setToast({
      message: 'All notifications cleared successfully!',
      type: 'success'
    });
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowPermissionBanner(false);
      setToast({
        message: 'Browser notifications enabled!',
        type: 'success'
      });
    }
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

  // Component for user avatar
  const UserAvatar = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
      xl: 'w-12 h-12 text-lg'
    };

    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${className}`}>
        {user.profile_picture && !imageError ? (
          <img
            src={`/storage/${user.profile_picture}`}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{user.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[60] shadow-sm">
        {/* Browser Notification Permission Banner */}
        {showPermissionBanner && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔔</span>
              <p className="text-sm font-medium">
                Enable browser notifications to get instant updates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Enable
              </button>
              <button
                onClick={() => setShowPermissionBanner(false)}
                className="px-3 py-1 text-white hover:bg-indigo-700 rounded-lg text-sm transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}

        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:pl-72 lg:pr-8">
          {/* Logo/Brand - Always visible */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">CryptoEx</span>
            </Link>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[32rem] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <p className="text-xs text-gray-600">{unreadCount} unread</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={openClearModal}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
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

                    {/* Footer */}
                    <div className="p-3 text-center border-t border-gray-200 bg-gray-50 rounded-b-xl">
                      <Link
                        href="/notifications"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={() => setShowNotifications(false)}
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
                <UserAvatar size="md" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.email_verified_at ? '✓ Verified' : 'Not verified'}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/security"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      🔒 Security
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      ⚙️ Settings
                    </Link>

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/trading"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Trade
              </Link>
              <Link
                href="/wallet"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Wallet
              </Link>
              <Link
                href="/orders"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Orders
              </Link>
              <Link
                href="/transactions"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Transactions
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Clear All Modal */}
      <Modal show={showClearModal} onClose={() => setShowClearModal(false)} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            Clear All Notifications?
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            This will permanently delete all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}. This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowClearModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={clearAllNotifications}
              disabled={clearing}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
            >
              {clearing ? 'Clearing...' : 'Clear All'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          description={toast.description}
          type={toast.type}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}