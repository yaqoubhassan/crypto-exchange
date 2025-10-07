import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function AdminHeader({ user, stats, selectedTimeframe, onTimeframeChange }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications] = useState([
        { id: 1, type: 'warning', message: 'High number of pending transactions', time: '5 min ago' },
        { id: 2, type: 'info', message: 'System backup completed', time: '1 hour ago' },
        { id: 3, type: 'success', message: 'KYC application approved', time: '2 hours ago' }
    ]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
            <div className="px-6 py-4">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-6">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">CE</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">CryptoExchange Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions & User */}
                    <div className="flex items-center space-x-4">
                        {/* Timeframe Selector */}
                        <div className="hidden md:block">
                            <select 
                                value={selectedTimeframe}
                                onChange={(e) => onTimeframeChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setShowNotifications(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div 
                                                    key={notif.id}
                                                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-2 h-2 mt-2 rounded-full ${
                                                            notif.type === 'warning' ? 'bg-yellow-500' :
                                                            notif.type === 'success' ? 'bg-green-500' :
                                                            'bg-blue-500'
                                                        }`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-900">{notif.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-gray-200">
                                            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">Administrator</div>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    
                                    <Dropdown.Link href={route('dashboard')}>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span>User Dashboard</span>
                                        </div>
                                    </Dropdown.Link>

                                    <Dropdown.Link href={route('profile.edit')}>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profile Settings</span>
                                        </div>
                                    </Dropdown.Link>

                                    <div className="border-t border-gray-100"></div>

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
            </div>
        </header>
    );
}