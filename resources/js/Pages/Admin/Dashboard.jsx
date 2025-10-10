import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminStatCard from '@/Components/Admin/AdminStatCard';
import AdminAlertBadge from '@/Components/Admin/AdminAlertBadge';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({
    stats,
    recentTransactions,
    recentUsers,
    recentOrders,
    pendingKyc,
    systemHealth,
    revenueData
}) {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'security',
            message: `${stats.failed_login_attempts || 0} failed login attempts in the last hour`,
            severity: (stats.failed_login_attempts || 0) > 10 ? 'high' : 'medium',
            time: 'Just now'
        },
        {
            id: 2,
            type: 'compliance',
            message: `${stats.pending_kyc} KYC applications waiting for review`,
            severity: stats.pending_kyc > 10 ? 'high' : 'medium',
            time: '5 minutes ago'
        },
        {
            id: 3,
            type: 'transaction',
            message: `${stats.pending_transactions} pending transactions require approval`,
            severity: stats.pending_transactions > 5 ? 'medium' : 'low',
            time: '10 minutes ago'
        }
    ]);

    const dismissAlert = (alertId) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
    };

    const calculateTrend = (current, previous) => {
        if (!previous || previous === 0) return null;
        const percentage = ((current - previous) / previous * 100).toFixed(1);
        return {
            direction: percentage > 0 ? 'up' : 'down',
            value: Math.abs(percentage)
        };
    };

    return (
        <AdminLayout title="Admin Dashboard">
            {/* System Health Banner */}
            {systemHealth && systemHealth.status !== 'healthy' && (
                <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <span className="text-2xl mr-3 flex-shrink-0">⚠️</span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-red-900 text-sm sm:text-base">System Health Alert</h3>
                            <p className="text-xs sm:text-sm text-red-700 mt-1">{systemHealth.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Alerts</h3>
                        <span className="text-xs text-gray-500">{alerts.length} active</span>
                    </div>
                    <div className="p-3 sm:p-4 space-y-3">
                        {alerts.map((alert) => (
                            <AdminAlertBadge
                                key={alert.id}
                                alert={alert}
                                onDismiss={dismissAlert}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <AdminStatCard
                    title="Total Users"
                    value={stats.total_users}
                    icon="👥"
                    color="blue"
                    subtitle={`${stats.active_users} active`}
                    trend={calculateTrend(stats.total_users, stats.previous_total_users)}
                />
                <AdminStatCard
                    title="24h Volume"
                    value={`$${(stats.total_volume_24h / 1000000).toFixed(2)}M`}
                    icon="📊"
                    color="purple"
                    subtitle="Trading volume"
                    trend={calculateTrend(stats.total_volume_24h, stats.previous_volume_24h)}
                />
                <AdminStatCard
                    title="Total Transactions"
                    value={stats.total_transactions}
                    icon="💳"
                    color="green"
                    subtitle={`${stats.pending_transactions} pending`}
                    trend={calculateTrend(stats.total_transactions, stats.previous_transactions)}
                />
                <AdminStatCard
                    title="Active Orders"
                    value={stats.active_orders}
                    icon="📋"
                    color="indigo"
                    subtitle="Open positions"
                />
            </div>

            {/* Secondary Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <AdminStatCard
                    title="Total Revenue"
                    value={`$${(stats.total_revenue / 1000).toFixed(1)}K`}
                    icon="💰"
                    color="green"
                    subtitle="Platform fees"
                    trend={calculateTrend(stats.total_revenue, stats.previous_revenue)}
                />
                <AdminStatCard
                    title="Pending KYC"
                    value={stats.pending_kyc}
                    icon="🔍"
                    color="yellow"
                    subtitle="Verification queue"
                />
                <AdminStatCard
                    title="Pending Approvals"
                    value={stats.pending_transactions}
                    icon="⏳"
                    color="orange"
                    subtitle="Requires action"
                />
                <AdminStatCard
                    title="System Status"
                    value={systemHealth?.status || 'Healthy'}
                    icon="✅"
                    color={systemHealth?.status === 'healthy' ? 'green' : 'red'}
                    subtitle="All systems"
                />
            </div>

            {/* Quick Actions & Platform Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {stats.pending_transactions > 0 && (
                                <Link
                                    href="/admin/transactions"
                                    className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all shadow-sm text-center"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">Review Pending Transactions</span>
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm flex-shrink-0 ml-2">
                                            {stats.pending_transactions}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {stats.pending_kyc > 0 && (
                                <Link
                                    href="/admin/kyc"
                                    className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all shadow-sm text-center"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">Process KYC Applications</span>
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm flex-shrink-0 ml-2">
                                            {stats.pending_kyc}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            <Link
                                href="/admin/users"
                                className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all shadow-sm text-center"
                            >
                                Manage Users
                            </Link>
                            <Link
                                href="/admin/reports"
                                className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all shadow-sm text-center"
                            >
                                Generate Reports
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Platform Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs sm:text-sm text-gray-600">New Users (24h)</span>
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">{stats.new_users_24h || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs sm:text-sm text-gray-600">Completed Trades (24h)</span>
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">{stats.completed_trades_24h || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs sm:text-sm text-gray-600">Total Wallets</span>
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">{stats.total_wallets || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs sm:text-sm text-gray-600">Average Order Value</span>
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                    ${stats.avg_order_value ? parseFloat(stats.avg_order_value).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        <Link
                            href="/admin/transactions"
                            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                            {recentTransactions.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${transaction.status === 'completed' ? 'bg-green-500' :
                                            transaction.status === 'pending' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                {transaction.user?.name || 'Unknown'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {transaction.type} • {transaction.cryptocurrency?.symbol}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-2 flex-shrink-0">
                                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                                            {parseFloat(transaction.amount).toFixed(4)}
                                        </div>
                                        <div className={`text-xs capitalize ${transaction.status === 'completed' ? 'text-green-600' :
                                            transaction.status === 'pending' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {transaction.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-3xl sm:text-4xl mb-2">💳</div>
                                    <div className="text-sm">No recent transactions</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Users</h3>
                        <Link
                            href="/admin/users"
                            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                            {recentUsers.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-2 flex-shrink-0">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentUsers.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-3xl sm:text-4xl mb-2">👥</div>
                                    <div className="text-sm">No recent users</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}