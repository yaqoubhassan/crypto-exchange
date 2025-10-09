import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Dashboard({
    stats,
    wallets,
    recentTransactions,
    activeOrders,
    orderHistory,
    portfolioDistribution,
    topCryptos
}) {
    const StatCard = ({ title, value, icon, color = 'indigo', change }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {item.symbol.substring(0, 2)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500">{item.symbol}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">${parseFloat(item.value || 0).toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500">{parseFloat(item.balance || 0).toFixed(8)}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                                        style={{ width: `${parseFloat(item.percentage || 0)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="ml-4 text-sm font-medium text-gray-600">
                                            {parseFloat(item.percentage || 0).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-gray-500">No assets in your portfolio yet</p>
                                <Link
                                    href="/wallet"
                                    className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Add Funds
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
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                                                transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' :
                                                    transaction.type === 'buy' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-purple-100 text-purple-600'
                                                }`}>
                                                {transaction.type === 'deposit' ? '⬇️' :
                                                    transaction.type === 'withdrawal' ? '⬆️' :
                                                        transaction.type === 'buy' ? '🛒' : '💰'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                                                <p className="text-sm text-gray-500">
                                                    {transaction.cryptocurrency?.symbol || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {parseFloat(transaction.amount || 0).toFixed(8)}
                                            </p>
                                            <p className={`text-xs capitalize ${transaction.status === 'completed' ? 'text-green-600' :
                                                transaction.status === 'pending' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {transaction.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">💳</div>
                                <p className="text-gray-500">No transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Orders */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
                            <Link href="/orders" className="text-sm text-indigo-600 hover:text-indigo-700">
                                View all
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {activeOrders.length > 0 ? (
                            <div className="space-y-4">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.side === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {order.side === 'buy' ? '📈' : '📉'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.side === 'buy' ? 'Buy' : 'Sell'} {order.base_currency?.symbol}
                                                </p>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    {order.type} • {order.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {parseFloat(order.quantity || 0).toFixed(8)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${order.price ? parseFloat(order.price).toFixed(2) : 'Market'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">📋</div>
                                <p className="text-gray-500">No active orders</p>
                                <Link
                                    href="/trading"
                                    className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Start Trading
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Market Overview Banner */}
            <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Ready to explore more?</h3>
                        <p className="text-indigo-100">Check out our trading platform and discover new opportunities</p>
                    </div>
                    <Link
                        href="/trading"
                        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                    >
                        Explore Markets
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}