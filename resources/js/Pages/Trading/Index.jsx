import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TradingChart from '@/Components/Trading/TradingChart';
import OrderBook from '@/Components/Trading/OrderBook';
import OrderForm from '@/Components/Trading/OrderForm';
import RecentTrades from '@/Components/Trading/RecentTrades';
import WalletBalance from '@/Components/Wallet/WalletBalance';

export default function TradingIndex({ auth, cryptocurrencies, wallets }) {
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Trading Dashboard
                    </h2>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedCrypto?.id || ''}
                            onChange={(e) => {
                                const crypto = cryptocurrencies.find(c => c.id == e.target.value);
                                handleCryptoSelect(crypto);
                            }}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {cryptocurrencies.filter(c => !c.is_fiat).map(crypto => (
                                <option key={crypto.id} value={crypto.id}>
                                    {crypto.name} ({crypto.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Trading" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Market Overview */}
                    {selectedCrypto && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {selectedCrypto.name}
                                        </h3>
                                        <span className="text-sm text-gray-500 uppercase">
                                            {selectedCrypto.symbol}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">
                                            ${parseFloat(selectedCrypto.current_price).toLocaleString()}
                                        </div>
                                        <div className={`text-sm font-medium ${
                                            selectedCrypto.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {selectedCrypto.change_24h >= 0 ? '+' : ''}
                                            {selectedCrypto.change_24h}%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500">Market Cap</div>
                                        <div className="text-lg font-semibold">
                                            ${selectedCrypto.market_cap ? parseFloat(selectedCrypto.market_cap).toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500">24h Volume</div>
                                        <div className="text-lg font-semibold">
                                            ${selectedCrypto.volume_24h ? parseFloat(selectedCrypto.volume_24h).toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500">Status</div>
                                        <div className={`text-lg font-semibold ${
                                            selectedCrypto.is_active ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {selectedCrypto.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trading Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Price Chart
                                    </h3>
                                    <TradingChart 
                                        cryptocurrency={selectedCrypto}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Book */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Order Book
                                    </h3>
                                    <OrderBook 
                                        marketData={marketData}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Place Order
                                    </h3>
                                    <OrderForm 
                                        selectedCrypto={selectedCrypto}
                                        wallets={wallets}
                                        cryptocurrencies={cryptocurrencies}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Recent Trades */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Recent Trades
                                </h3>
                                <RecentTrades 
                                    marketData={marketData}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        {/* Wallet Balances */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Wallet Balances
                                </h3>
                                <WalletBalance wallets={wallets} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}