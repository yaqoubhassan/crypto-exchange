import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, stats, recentTransactions, recentUsers }) {
    const StatCard = ({ title, value, icon, color = 'indigo' }) => (
        <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 border-${color}-500`}>
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`text-2xl text-${color}-600`}>{icon}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Admin Dashboard
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Admin Access
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={stats.total_users}
                            icon="👥"
                            color="blue"
                        />
                        <StatCard
                            title="Active Users"
                            value={stats.active_users}
                            icon="✅"
                            color="green"
                        />
                        <StatCard
                            title="Pending Transactions"
                            value={stats.pending_transactions}
                            icon="⏳"
                            color="yellow"
                        />
                        <StatCard
                            title="24h Volume"
                            value={`$${parseFloat(stats.total_volume_24h || 0).toFixed(2)}`}
                            icon="📈"
                            color="purple"
                        />
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Transactions"
                            value={stats.total_transactions}
                            icon="💳"
                            color="indigo"
                        />
                        <StatCard
                            title="Active Orders"
                            value={stats.active_orders}
                            icon="📋"
                            color="cyan"
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.total_orders}
                            icon="📊"
                            color="gray"
                        />
                        <StatCard
                            title="Pending KYC"
                            value={stats.pending_kyc}
                            icon="🔍"
                            color="red"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/admin/transactions"
                                    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-colors"
                                >
                                    <div className="text-blue-600 text-2xl mb-2">💳</div>
                                    <div className="font-medium text-blue-900">Manage Transactions</div>
                                    <div className="text-sm text-blue-600">Review and approve transactions</div>
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 transition-colors"
                                >
                                    <div className="text-green-600 text-2xl mb-2">👥</div>
                                    <div className="font-medium text-green-900">User Management</div>
                                    <div className="text-sm text-green-600">View and manage users</div>
                                </Link>
                                <Link
                                    href="/admin/kyc"
                                    className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors"
                                >
                                    <div className="text-yellow-600 text-2xl mb-2">🔍</div>
                                    <div className="font-medium text-yellow-900">KYC Verification</div>
                                    <div className="text-sm text-yellow-600">Review KYC applications</div>
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition-colors"
                                >
                                    <div className="text-purple-600 text-2xl mb-2">📋</div>
                                    <div className="font-medium text-purple-900">Order Management</div>
                                    <div className="text-sm text-purple-600">Monitor trading orders</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Transactions */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                                    <Link
                                        href="/admin/transactions"
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        transaction.status === 'completed' ? 'bg-green-500' :
                                                        transaction.status === 'pending' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {transaction.user?.name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {transaction.type} • {transaction.cryptocurrency?.symbol}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {parseFloat(transaction.amount).toFixed(8)}
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
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            No recent transactions
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
                                    <Link
                                        href="/admin/users"
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            No recent users
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}