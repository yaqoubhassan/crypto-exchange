import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminStatCard from '@/Components/Admin/AdminStatCard';
import AdminAlertBadge from '@/Components/Admin/AdminAlertBadge';
import TransactionsTable from '@/Components/Admin/TransactionsTable';
import UsersTable from '@/Components/Admin/UsersTable';
import KycQueue from '@/Components/Admin/KycQueue';

export default function AdminDashboard({ 
    auth, 
    stats,
    recentTransactions,
    recentUsers,
    recentOrders,
    pendingKyc,
    systemHealth,
    revenueData
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
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
        <>
            <Head title="Admin Dashboard" />

            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Sidebar - Full height with independent scroll */}
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Right side container - Header + Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Professional Header - Sticky */}
                    <AdminHeader 
                        user={auth.user}
                        stats={stats}
                        selectedTimeframe={selectedTimeframe}
                        onTimeframeChange={setSelectedTimeframe}
                    />

                    {/* Main Content Area - Scrollable independently */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        
                        {/* System Health Banner */}
                        {systemHealth && systemHealth.status !== 'healthy' && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">⚠️</span>
                                    <div>
                                        <h3 className="font-medium text-red-900">System Health Alert</h3>
                                        <p className="text-sm text-red-700">{systemHealth.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Alerts Section */}
                        {alerts.length > 0 && activeTab === 'overview' && (
                            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                                    <span className="text-xs text-gray-500">{alerts.length} active alerts</span>
                                </div>
                                <div className="p-4 space-y-3">
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

                        {/* Overview Tab - Statistics */}
                        {activeTab === 'overview' && (
                            <>
                                {/* Main Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

                                {/* Quick Actions & Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Quick Actions */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                            <div className="space-y-3">
                                                {stats.pending_transactions > 0 && (
                                                    <button
                                                        onClick={() => setActiveTab('transactions')}
                                                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-between"
                                                    >
                                                        <span>Review Pending Transactions</span>
                                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                                                            {stats.pending_transactions}
                                                        </span>
                                                    </button>
                                                )}
                                                {stats.pending_kyc > 0 && (
                                                    <button
                                                        onClick={() => setActiveTab('kyc')}
                                                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm flex items-center justify-between"
                                                    >
                                                        <span>Process KYC Applications</span>
                                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                                                            {stats.pending_kyc}
                                                        </span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setActiveTab('users')}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm"
                                                >
                                                    Manage Users
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('reports')}
                                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-sm"
                                                >
                                                    Generate Reports
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Platform Statistics */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-600">New Users (24h)</span>
                                                    <span className="font-semibold text-gray-900">{stats.new_users_24h || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-600">Completed Trades (24h)</span>
                                                    <span className="font-semibold text-gray-900">{stats.completed_trades_24h || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-600">Total Wallets</span>
                                                    <span className="font-semibold text-gray-900">{stats.total_wallets || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-600">Average Order Value</span>
                                                    <span className="font-semibold text-gray-900">
                                                        ${stats.avg_order_value ? parseFloat(stats.avg_order_value).toFixed(2) : '0.00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent Transactions */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                                            <button
                                                onClick={() => setActiveTab('transactions')}
                                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                            >
                                                View all →
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {recentTransactions.slice(0, 5).map((transaction) => (
                                                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-2 h-2 rounded-full ${
                                                                transaction.status === 'completed' ? 'bg-green-500' :
                                                                transaction.status === 'pending' ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}></div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {transaction.user?.name || 'Unknown'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {transaction.type} • {transaction.cryptocurrency?.symbol}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {parseFloat(transaction.amount).toFixed(4)}
                                                            </div>
                                                            <div className={`text-xs capitalize ${
                                                                transaction.status === 'completed' ? 'text-green-600' :
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
                                                        No recent transactions
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Users */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                                            <button
                                                onClick={() => setActiveTab('users')}
                                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                            >
                                                View all →
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {recentUsers.slice(0, 5).map((user) => (
                                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                user.is_active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
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
                                                        No recent users
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <TransactionsTable transactions={recentTransactions} />
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <UsersTable users={recentUsers} />
                        )}

                        {/* KYC Tab */}
                        {activeTab === 'kyc' && (
                            <KycQueue applications={pendingKyc} />
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                                    <div className="text-center py-8 text-gray-500">
                                        Orders management interface
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
                                        <div className="space-y-3">
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                                Trading Volume Report
                                            </button>
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                                Revenue Report
                                            </button>
                                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                                User Activity Report
                                            </button>
                                            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                                Security Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}