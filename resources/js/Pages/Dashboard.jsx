import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import MarketOverview from '@/Components/Dashboard/MarketOverview';

export default function Dashboard({
    stats,
    portfolioDistribution,
    recentTransactions,
    topCryptos,
    wallets
}) {
    const StatCard = ({ title, value, icon, color, change }) => (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change !== undefined && (
                        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                        </p>
                    )}
                </div>
                <div className={`text-4xl opacity-80`}>{icon}</div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your portfolio today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Portfolio Value"
                    value={`$${parseFloat(stats.total_portfolio_value).toFixed(2)}`}
                    icon="💰"
                    color="green"
                    change={2.5}
                />
                <StatCard
                    title="Active Orders"
                    value={stats.active_orders}
                    icon="📋"
                    color="blue"
                />
                <StatCard
                    title="Total Transactions"
                    value={stats.total_transactions}
                    icon="💳"
                    color="purple"
                />
                <StatCard
                    title="Available Wallets"
                    value={stats.available_wallets}
                    icon="👛"
                    color="orange"
                />
            </div>

            {/* Market Overview Section - NEW! */}
            <div className="mb-8">
                <MarketOverview wallets={wallets} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Portfolio Distribution */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Portfolio Distribution</h2>
                            <Link href="/wallet" className="text-sm text-indigo-600 hover:text-indigo-700">
                                View all
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {portfolioDistribution.length > 0 ? (
                            <div className="space-y-4">
                                {portfolioDistribution.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {item.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.symbol}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">${parseFloat(item.value || 0).toFixed(2)}</p>
                                                <p className={`text-sm ${parseFloat(item.change_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {parseFloat(item.change_24h || 0) >= 0 ? '+' : ''}{parseFloat(item.change_24h || 0).toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Balance</span>
                                                <span className="font-medium text-gray-900">{parseFloat(item.total_balance || 0).toFixed(8)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Percentage</span>
                                                <span className="font-medium text-gray-900">{parseFloat(item.percentage || 0).toFixed(2)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${parseFloat(item.percentage || 0)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-gray-500 mb-4">No portfolio data yet</p>
                                <Link href="/wallet" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Add funds to get started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <Link
                            href="/trading"
                            className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:from-green-600 hover:to-green-700 transition-all"
                        >
                            🚀 Start Trading
                        </Link>
                        <Link
                            href="/wallet"
                            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                            💰 Deposit Funds
                        </Link>
                        <Link
                            href="/wallet"
                            className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:from-purple-600 hover:to-purple-700 transition-all"
                        >
                            💸 Withdraw
                        </Link>
                        <Link
                            href="/transactions"
                            className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-all"
                        >
                            📊 View History
                        </Link>
                    </div>

                    {/* Top Cryptos */}
                    <div className="p-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Cryptocurrencies</h3>
                        <div className="space-y-3">
                            {topCryptos.map((crypto) => (
                                <div key={crypto.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">{crypto.symbol}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            ${parseFloat(crypto.current_price).toFixed(2)}
                                        </p>
                                        <p className={`text-xs ${crypto.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {crypto.change_24h >= 0 ? '+' : ''}{crypto.change_24h}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                            <Link href="/transactions" className="text-sm text-indigo-600 hover:text-indigo-700">
                                View all
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'deposit' ? 'bg-green-100' :
                                                transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                                                }`}>
                                                {transaction.type === 'deposit' ? '⬇️' :
                                                    transaction.type === 'withdrawal' ? '⬆️' : '💳'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                    {transaction.type}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(transaction.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                                                }`}>
                                                {transaction.type === 'deposit' ? '+' : '-'}
                                                {parseFloat(transaction.amount).toFixed(4)} {transaction.cryptocurrency?.symbol}
                                            </p>
                                            <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' :
                                                transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {transaction.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💳</div>
                                <p className="text-gray-500 mb-4">No transactions yet</p>
                                <Link href="/wallet" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Start trading
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trading Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Trading Activity</h2>
                            <Link href="/trading" className="text-sm text-indigo-600 hover:text-indigo-700">
                                Start Trading
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Active Orders</span>
                                    <span className="text-2xl font-bold text-indigo-600">{stats.active_orders}</span>
                                </div>
                                <p className="text-xs text-gray-600">Currently active trading orders</p>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Completed Orders</span>
                                    <span className="text-2xl font-bold text-green-600">{stats.completed_orders || 0}</span>
                                </div>
                                <p className="text-xs text-gray-600">Successfully executed trades</p>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Total Orders</span>
                                    <span className="text-2xl font-bold text-purple-600">{stats.total_orders || 0}</span>
                                </div>
                                <p className="text-xs text-gray-600">All time trading activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}