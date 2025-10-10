import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';

export default function AdminHeader({ user, stats, selectedTimeframe, onTimeframeChange, toggleSidebar, isCollapsed, toggleCollapse }) {
    const { notifications = [], unreadCount = 0, flash } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [toast, setToast] = useState(null);

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

    const handleNotificationClick = (notification) => {
        // Mark as read if not already read
        if (!notification.is_read) {
            router.post(`/notifications/${notification.id}/read`, {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }

        // Navigate to the link if it exists
        if (notification.link) {
            router.visit(notification.link);
        }

        setShowNotifications(false);
    };

    const handleViewAllNotifications = () => {
        router.visit('/notifications');
        setShowNotifications(false);
    };

    const markAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const openClearModal = () => {
        setShowClearModal(true);
    };

    const clearAllNotifications = () => {
        setClearing(true);

        router.delete('/notifications/clear-all', {
            preserveScroll: true,
            onSuccess: () => {
                setShowClearModal(false);
                setShowNotifications(false);
                setClearing(false);
                setToast({
                    message: 'All notifications cleared successfully!',
                    type: 'success'
                });
            },
            onError: () => {
                setClearing(false);
                setToast({
                    message: 'Failed to clear notifications. Please try again.',
                    type: 'error'
                });
            }
        });
    };

    const getNotificationIcon = (notification) => {
        if (notification.icon) return notification.icon;

        // Default icons based on type
        const icons = {
            transaction: '💳',
            order: '📋',
            kyc: '🔍',
            system: '⚙️',
            security: '🔒',
            user: '👤',
            warning: '⚠️',
            success: '✅',
            info: 'ℹ️',
        };

        return icons[notification.type] || '📢';
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
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Logo & Toggle */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <button
                                onClick={toggleCollapse}
                                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    )}
                                </svg>
                            </button>

                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>

                        {/* Right: Actions & User */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Timeframe Selector - Hidden on mobile */}
                            <div className="hidden md:block">
                                <select
                                    value={selectedTimeframe}
                                    onChange={(e) => onTimeframeChange(e.target.value)}
                                    className="w-40 sm:w-44 px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                >
                                    <option value="1h">Last Hour</option>
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                </select>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
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
                                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className="flex-shrink-0 text-2xl">
                                                                    {getNotificationIcon(notification)}
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
                                                <button
                                                    onClick={handleViewAllNotifications}
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                                >
                                                    View all notifications
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Quick Actions - Hidden on small mobile */}
                            <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-2 transition-colors">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left hidden lg:block">
                                                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">Administrator</div>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                        </div>

                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profile Settings</span>
                                        </Link>

                                        <Link
                                            href="/admin/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Admin Settings</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign Out</span>
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Timeframe Selector */}
                    <div className="md:hidden">
                        <select
                            value={selectedTimeframe}
                            onChange={(e) => onTimeframeChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Clear All Notifications Modal */}
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