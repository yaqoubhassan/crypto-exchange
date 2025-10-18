import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';
import { useNotifications } from '@/Hooks/useNotifications';

export default function DashboardHeader({ user, toggleSidebar, isCollapsed, toggleCollapse }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  const { flash } = usePage().props;

  const {
    notifications,
    unreadCount,
    newNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestNotificationPermission,
  } = useNotifications();

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

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowPermissionBanner(true);
    }
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [user.profile_picture]);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const handleNotificationClick = async (notification) => {
    console.log('🔔 Notification clicked:', notification);
    console.log('📊 Is read status:', notification.is_read);
    console.log('🔗 Action URL:', notification.action_url);
    console.log('🔗 Link:', notification.link);

    setShowNotifications(false);

    if (!notification.is_read) {
      console.log('📝 Marking notification as read...');
      try {
        await markAsRead(notification.id);
        console.log('✅ Successfully marked as read');
      } catch (error) {
        console.error('❌ Error marking as read:', error);
      }
    } else {
      console.log('ℹ️ Notification already read, skipping mark as read');
    }

    // ✅ FIXED: Support both action_url and link fields (like AdminHeader)
    const targetUrl = notification.action_url || notification.link;
    if (targetUrl) {
      console.log('🚀 Navigating to:', targetUrl);
      router.visit(targetUrl);
    } else {
      console.log('⚠️ No action_url or link found for notification');
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await clearAll();
      setShowClearModal(false);
      setToast({
        message: 'All notifications cleared',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to clear notifications',
        type: 'error'
      });
    } finally {
      setClearing(false);
    }
  };

  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
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
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderAvatar = () => {
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
        {!imageError && user.profile_picture ? (
          <img
            src={`/storage/${user.profile_picture}`}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
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
      <header className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm z-10">
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

        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Left side - Menu buttons */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>

            {/* Page title - visible on larger screens */}
            <h1 className="hidden md:block text-xl font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {notifications.length > 0 && (
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            onClick={() => setShowClearModal(true)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <div className="text-4xl mb-2">🔔</div>
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.slice(0, 10).map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full p-4 hover:bg-gray-50 transition text-left ${!notification.is_read ? 'bg-indigo-50' : ''
                                }`}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl flex-shrink-0">{notification.icon || '📢'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatTime(notification.created_at)}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200">
                        <Link
                          href="/notifications"
                          className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {renderAvatar()}
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
      </header>

      {/* Clear All Notifications Modal */}
      <Modal show={showClearModal} onClose={() => setShowClearModal(false)} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Clear All Notifications</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to clear all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowClearModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              disabled={clearing}
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
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