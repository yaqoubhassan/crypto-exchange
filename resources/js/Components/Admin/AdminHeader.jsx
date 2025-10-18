import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import UserAvatar from '@/Components/UserAvatar';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';
import { useNotifications } from '@/Hooks/useNotifications';

export default function AdminHeader({ user, stats, selectedTimeframe, onTimeframeChange, toggleSidebar, isCollapsed, toggleCollapse }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [toast, setToast] = useState(null);

    const { flash } = usePage().props;

    const {
        notifications,
        unreadCount,
        newNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        requestNotificationPermission
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

    // Show toast for new notifications
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

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // ✅ FIXED: Support both action_url and link fields
    const handleNotificationClick = async (notification) => {

        setShowNotifications(false);

        if (!notification.is_read) {
            try {
                await markAsRead(notification.id);
            } catch (error) {
                console.error('❌ Error marking as read:', error);
            }
        }

        const targetUrl = notification.action_url || notification.link;
        if (targetUrl) {
            router.visit(targetUrl);
        }
    };

    // ✅ Add logging to mark all as read
    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('❌ Error marking all as read:', error);
        }
    };

    const handleClearAll = async () => {
        setClearing(true);
        try {
            await clearAll();
            setShowClearModal(false);
            setShowNotifications(false);
            setToast({
                message: 'All notifications cleared',
                type: 'success'
            });
        } catch (error) {
            console.error('❌ Error clearing notifications:', error);
            setToast({
                message: 'Failed to clear notifications',
                type: 'error'
            });
        } finally {
            setClearing(false);
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

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            case 'info':
            default:
                return '📢';
        }
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Sidebar Toggle & Title */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            aria-label="Toggle sidebar"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Collapse sidebar"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="relative">
                                <select
                                    value={selectedTimeframe}
                                    onChange={(e) => onTimeframeChange(e.target.value)}
                                    className="w-40 sm:w-44 px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white cursor-pointer"
                                >
                                    <option value="1h">Last Hour</option>
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
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
                                                {notifications.length > 0 && (
                                                    <button
                                                        onClick={() => setShowClearModal(true)}
                                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors text-left ${!notification.is_read ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <span className="text-2xl flex-shrink-0">
                                                                {notification.icon || getNotificationIcon(notification.type)}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <p className={`text-sm font-medium ${notification.is_read ?
                                                                        'text-gray-700' : 'text-gray-900'
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
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <div className="text-4xl mb-2">🔔</div>
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>

                                        {notifications.length > 5 && (
                                            <div className="p-3 border-t border-gray-200">
                                                <Link
                                                    href={route('notifications.index')}
                                                    className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                                    onClick={() => setShowNotifications(false)}
                                                >
                                                    View All Notifications
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-2 transition-colors">
                                        <UserAvatar
                                            src={user.profile_picture}
                                            name={user.name}
                                            size="md"
                                        />
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">Admin</p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href="/admin/profile" className='flex items-center'>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href="/admin/settings" className='flex items-center'>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link href="/admin/security" className='flex items-center'>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Security
                                    </Dropdown.Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear All Notifications Modal */}
            <Modal show={showClearModal} onClose={() => setShowClearModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Clear All Notifications?
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        This will permanently delete all your notifications. This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowClearModal(false)}
                            disabled={clearing}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleClearAll}
                            disabled={clearing}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {clearing ? 'Clearing...' : 'Clear All'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Toast Notification */}
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