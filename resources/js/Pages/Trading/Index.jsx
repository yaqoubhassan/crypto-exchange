import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.jsx';
import TradingChart from '@/Components/Trading/TradingChart';
import OrderBook from '@/Components/Trading/OrderBook';
import OrderForm from '@/Components/Trading/OrderForm';
import RecentTrades from '@/Components/Trading/RecentTrades';
import WalletBalance from '@/Components/Wallet/WalletBalance';

export default function TradingIndex({ cryptocurrencies, wallets, activeOrders }) {
    const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0] || null);
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCrypto) {
            fetchMarketData(selectedCrypto.symbol);
        }
    }, [selectedCrypto]);

    const fetchMarketData = async (symbol) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/market/${symbol}`);
            const data = await response.json();
            setMarketData(data);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto);
    };

    return (
        <DashboardLayout>
            <Head title="Trading" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Trade cryptocurrencies with real-time market data
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <select
                            value={selectedCrypto?.id || ''}
                            onChange={(e) => {
                                const crypto = cryptocurrencies.find(c => c.id == e.target.value);
                                handleCryptoSelect(crypto);
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {cryptocurrencies.filter(c => !c.is_fiat).map(crypto => (
                                <option key={crypto.id} value={crypto.id}>
                                    {crypto.name} ({crypto.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Market Overview Card */}
            {selectedCrypto && (
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {selectedCrypto.symbol.substring(0, 2)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedCrypto.name}
                                    </h2>
                                    <span className="text-sm text-gray-500 uppercase">
                                        {selectedCrypto.symbol}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 text-left md:text-right">
                                <div className="text-3xl font-bold text-gray-900">
                                    ${parseFloat(selectedCrypto.current_price).toLocaleString()}
                                </div>
                                <div className={`text-sm font-medium ${selectedCrypto.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {selectedCrypto.change_24h >= 0 ? '↑' : '↓'}
                                    {Math.abs(selectedCrypto.change_24h)}% (24h)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="text-center md:text-left">
                            <div className="text-sm text-gray-500 mb-1">Market Cap</div>
                            <div className="text-lg font-semibold text-gray-900">
                                ${selectedCrypto.market_cap ? parseFloat(selectedCrypto.market_cap).toLocaleString() : 'N/A'}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-sm text-gray-500 mb-1">24h Volume</div>
                            <div className="text-lg font-semibold text-gray-900">
                                ${selectedCrypto.volume_24h ? parseFloat(selectedCrypto.volume_24h).toLocaleString() : 'N/A'}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className={`text-lg font-semibold ${selectedCrypto.is_active ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {selectedCrypto.is_active ? '● Active' : '● Inactive'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Trading Interface Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                {/* Chart - Takes up 6 columns */}
                <div className="xl:col-span-6">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Price Chart
                            </h3>
                        </div>
                        <div className="p-6">
                            <TradingChart
                                cryptocurrency={selectedCrypto}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Book - Takes up 3 columns */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm h-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Order Book
                            </h3>
                        </div>
                        <div className="p-6">
                            <OrderBook
                                marketData={marketData}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Form - Takes up 3 columns */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm sticky top-20">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Place Order
                            </h3>
                        </div>
                        <div className="p-6">
                            <OrderForm
                                selectedCrypto={selectedCrypto}
                                wallets={wallets}
                                cryptocurrencies={cryptocurrencies}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Recent Trades and Wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Trades */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Trades
                        </h3>
                    </div>
                    <div className="p-6">
                        <RecentTrades
                            marketData={marketData}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Wallet Balances */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Your Wallets
                        </h3>
                    </div>
                    <div className="p-6">
                        <WalletBalance wallets={wallets} />
                    </div>
                </div>
            </div>

            {/* Active Orders Section */}
            {activeOrders && activeOrders.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Your Active Orders
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pair
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Side
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.base_currency?.symbol}/{order.quote_currency?.symbol}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {order.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.side === 'buy'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {order.side.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${order.price ? parseFloat(order.price).toFixed(2) : 'Market'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {parseFloat(order.quantity).toFixed(8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'partial' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'filled' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}