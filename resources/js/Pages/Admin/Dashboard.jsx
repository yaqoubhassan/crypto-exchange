import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminDashboard({ 
    auth, 
    stats = {
        totalUsers: 1250,
        totalTransactions: 8945,
        totalVolume: 2500000,
        pendingApprovals: 23,
        activeOrders: 156,
        totalRevenue: 125000
    }, 
    recentTransactions = [],
    recentUsers = [],
    pendingKyc = [],
    systemAlerts = []
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
    
    const { data, setData, post, processing } = useForm({
        action: '',
        id: null,
        reason: ''
    });

    // Mock data for demonstration
    const mockTransactions = [
        { id: 1, user: 'john@example.com', type: 'deposit', amount: 1000, currency: 'USD', status: 'pending', created_at: '2024-01-15 10:30:00' },
        { id: 2, user: 'jane@example.com', type: 'withdrawal', amount: 0.5, currency: 'BTC', status: 'pending', created_at: '2024-01-15 09:15:00' },
        { id: 3, user: 'bob@example.com', type: 'trade', amount: 2500, currency: 'USD', status: 'completed', created_at: '2024-01-15 08:45:00' },
        { id: 4, user: 'alice@example.com', type: 'deposit', amount: 500, currency: 'EUR', status: 'pending', created_at: '2024-01-15 07:20:00' },
    ];

    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', kyc_status: 'verified', joined: '2024-01-10', last_login: '2024-01-15 10:30:00' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', kyc_status: 'pending', joined: '2024-01-12', last_login: '2024-01-15 09:15:00' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'suspended', kyc_status: 'verified', joined: '2024-01-08', last_login: '2024-01-14 16:45:00' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', kyc_status: 'rejected', joined: '2024-01-14', last_login: '2024-01-15 07:20:00' },
    ];

    const mockKycApplications = [
        { id: 1, user: 'jane@example.com', submitted: '2024-01-14', documents: 3, status: 'pending' },
        { id: 2, user: 'mike@example.com', submitted: '2024-01-13', documents: 2, status: 'pending' },
        { id: 3, user: 'sarah@example.com', submitted: '2024-01-12', documents: 4, status: 'under_review' },
    ];

    const mockAlerts = [
        { id: 1, type: 'security', message: 'Multiple failed login attempts detected for user john@example.com', severity: 'high', time: '5 minutes ago' },
        { id: 2, type: 'system', message: 'Database backup completed successfully', severity: 'info', time: '1 hour ago' },
        { id: 3, type: 'transaction', message: 'Large withdrawal request ($50,000) requires approval', severity: 'medium', time: '2 hours ago' },
        { id: 4, type: 'compliance', message: 'KYC verification queue has 15 pending applications', severity: 'medium', time: '3 hours ago' },
    ];

    const handleTransactionAction = (transactionId, action) => {
        setData({
            action: action,
            id: transactionId,
            reason: ''
        });
        
        post(route(`admin.transactions.${action}`, transactionId), {
            onSuccess: () => {
                // Handle success
                console.log(`Transaction ${action}d successfully`);
            }
        });
    };

    const StatCard = ({ title, value, icon, color = 'indigo', trend = null, subtitle = null }) => (
        <div className={`bg-white overflow-hidden shadow-lg rounded-xl border-l-4 border-${color}-500 hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`text-3xl text-${color}-600`}>{icon}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="text-2xl font-bold text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </dd>
                            {subtitle && (
                                <dd className="text-sm text-gray-600 mt-1">{subtitle}</dd>
                            )}
                            {trend && (
                                <dd className={`text-sm font-medium mt-1 ${
                                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {trend.direction === 'up' ? '↗' : '↘'} {trend.value}% vs last period
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

    const AlertBadge = ({ type, severity }) => {
        const colors = {
            security: 'red',
            system: 'blue',
            transaction: 'yellow',
            compliance: 'purple'
        };
        
        const severityColors = {
            high: 'red',
            medium: 'yellow',
            low: 'green',
            info: 'blue'
        };

        return (
            <div className="flex space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${colors[type]}-100 text-${colors[type]}-800`}>
                    {type}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${severityColors[severity]}-100 text-${severityColors[severity]}-800`}>
                    {severity}
                </span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Admin Dashboard
                    </h2>
                    <div className="flex items-center space-x-4">
                        <select 
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            🛡️ Admin Access
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* System Alerts */}
                    {mockAlerts.length > 0 && (
                        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">🚨 System Alerts</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {mockAlerts.slice(0, 3).map((alert) => (
                                    <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <AlertBadge type={alert.type} severity={alert.severity} />
                                            </div>
                                            <p className="text-sm text-gray-700">{alert.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon="👥"
                            color="blue"
                            trend={{ direction: 'up', value: 12.5 }}
                            subtitle="Active accounts"
                        />
                        <StatCard
                            title="Total Transactions"
                            value={stats.totalTransactions}
                            icon="💳"
                            color="green"
                            trend={{ direction: 'up', value: 8.3 }}
                            subtitle="All time"
                        />
                        <StatCard
                            title="Trading Volume"
                            value={`$${(stats.totalVolume / 1000000).toFixed(1)}M`}
                            icon="📊"
                            color="purple"
                            trend={{ direction: 'up', value: 15.7 }}
                            subtitle="24h volume"
                        />
                        <StatCard
                            title="Pending Approvals"
                            value={stats.pendingApprovals}
                            icon="⏳"
                            color="yellow"
                            subtitle="Requires attention"
                        />
                        <StatCard
                            title="Active Orders"
                            value={stats.activeOrders}
                            icon="🔄"
                            color="indigo"
                            subtitle="Open positions"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
                            icon="💰"
                            color="green"
                            trend={{ direction: 'up', value: 22.1 }}
                            subtitle="Platform fees"
                        />
                        <StatCard
                            title="KYC Pending"
                            value={mockKycApplications.length}
                            icon="📋"
                            color="orange"
                            subtitle="Verification queue"
                        />
                        <StatCard
                            title="System Status"
                            value="Operational"
                            icon="✅"
                            color="green"
                            subtitle="All systems normal"
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {[
                                    { id: 'overview', name: 'Overview', icon: '📊' },
                                    { id: 'transactions', name: 'Transactions', icon: '💳' },
                                    { id: 'users', name: 'Users', icon: '👥' },
                                    { id: 'kyc', name: 'KYC Verification', icon: '📋' },
                                    { id: 'reports', name: 'Reports', icon: '📈' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Activity Chart Placeholder */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Trading Activity</h3>
                                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">📊</div>
                                                <p className="text-gray-500">Trading volume chart would appear here</p>
                                                <p className="text-sm text-gray-400">Integration with charting library</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Quick Actions</h3>
                                        <div className="space-y-3">
                                            <Link
                                                href={route('admin.transactions')}
                                                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                                            >
                                                Review Pending Transactions ({stats.pendingApprovals})
                                            </Link>
                                            <Link
                                                href={route('admin.kyc')}
                                                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                                            >
                                                Process KYC Applications ({mockKycApplications.length})
                                            </Link>
                                            <Link
                                                href={route('admin.users')}
                                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                                            >
                                                Manage Users
                                            </Link>
                                            <button className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors">
                                                Generate Reports
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">💳 Transaction Management</h3>
                                        <div className="flex space-x-2">
                                            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                                                <option>All Types</option>
                                                <option>Deposits</option>
                                                <option>Withdrawals</option>
                                                <option>Trades</option>
                                            </select>
                                            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                                                <option>All Status</option>
                                                <option>Pending</option>
                                                <option>Approved</option>
                                                <option>Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {mockTransactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transaction.user}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                                                                transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {transaction.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transaction.amount} {transaction.currency}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(transaction.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {transaction.status === 'pending' && (
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleTransactionAction(transaction.id, 'approve')}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        disabled={processing}
                                                                    >
                                                                        ✅ Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleTransactionAction(transaction.id, 'reject')}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        disabled={processing}
                                                                    >
                                                                        ❌ Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">👥 User Management</h3>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                            />
                                            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                                                <option>All Status</option>
                                                <option>Active</option>
                                                <option>Suspended</option>
                                                <option>Pending</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {mockUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                user.kyc_status === 'verified' ? 'bg-green-100 text-green-800' :
                                                                user.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {user.kyc_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {user.joined}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(user.last_login).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                                    👁️ View
                                                                </button>
                                                                <button className="text-yellow-600 hover:text-yellow-900">
                                                                    {user.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KYC Tab */}
                        {activeTab === 'kyc' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">📋 KYC Verification Queue</h3>
                                    
                                    <div className="space-y-4">
                                        {mockKycApplications.map((application) => (
                                            <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{application.user}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Submitted: {application.submitted} • {application.documents} documents
                                                        </p>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {application.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                                            📄 Review Documents
                                                        </button>
                                                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                                            ✅ Approve
                                                        </button>
                                                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Generate Reports</h3>
                                        <div className="space-y-4">
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
                                                📊 Trading Volume Report
                                            </button>
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium">
                                                💰 Revenue Report
                                            </button>
                                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium">
                                                👥 User Activity Report
                                            </button>
                                            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium">
                                                🔒 Security Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Recent Reports</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">Monthly Trading Report</div>
                                                    <div className="text-sm text-gray-500">Generated 2 hours ago</div>
                                                </div>
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    📥 Download
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">User Registration Report</div>
                                                    <div className="text-sm text-gray-500">Generated yesterday</div>
                                                </div>
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    📥 Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
