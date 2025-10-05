import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function OrderForm({ selectedCrypto, wallets, cryptocurrencies }) {
    const [orderType, setOrderType] = useState('market');
    const [side, setSide] = useState('buy');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const usdCurrency = cryptocurrencies.find(c => c.symbol === 'USD');
    const userWallet = wallets.find(w => w.cryptocurrency_id === selectedCrypto?.id);
    const usdWallet = wallets.find(w => w.cryptocurrency_id === usdCurrency?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    base_currency_id: selectedCrypto.id,
                    quote_currency_id: usdCurrency.id,
                    type: orderType,
                    side: side,
                    quantity: parseFloat(quantity),
                    price: orderType === 'market' ? null : parseFloat(price),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setQuantity('');
                setPrice('');
                // Refresh the page to update balances
                router.reload();
            } else {
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!quantity) return 0;
        const orderPrice = orderType === 'market' ? selectedCrypto?.current_price : price;
        return parseFloat(quantity) * parseFloat(orderPrice || 0);
    };

    const getAvailableBalance = () => {
        if (side === 'buy') {
            return usdWallet?.balance || 0;
        } else {
            return userWallet?.balance || 0;
        }
    };

    if (!selectedCrypto) {
        return (
            <div className="text-center text-gray-500 py-8">
                Select a cryptocurrency to start trading
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Type Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setOrderType('market')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        orderType === 'market'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Market
                </button>
                <button
                    type="button"
                    onClick={() => setOrderType('limit')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        orderType === 'limit'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Limit
                </button>
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setSide('buy')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        side === 'buy'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Buy
                </button>
                <button
                    type="button"
                    onClick={() => setSide('sell')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        side === 'sell'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Sell
                </button>
            </div>

            {/* Price Input (for limit orders) */}
            {orderType === 'limit' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                        required
                    />
                </div>
            )}

            {/* Quantity Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({selectedCrypto.symbol})
                </label>
                <input
                    type="number"
                    step="0.00000001"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00000000"
                    required
                />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Type:</span>
                    <span className="font-medium capitalize">{orderType}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Side:</span>
                    <span className={`font-medium capitalize ${
                        side === 'buy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {side}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                        ${orderType === 'market' 
                            ? parseFloat(selectedCrypto.current_price).toFixed(2)
                            : (price || '0.00')
                        }
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">
                        ${calculateTotal().toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">
                        {side === 'buy' 
                            ? `$${parseFloat(getAvailableBalance()).toFixed(2)}`
                            : `${parseFloat(getAvailableBalance()).toFixed(8)} ${selectedCrypto.symbol}`
                        }
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="text-sm text-red-600">{error}</div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || !quantity || (orderType === 'limit' && !price)}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                    side === 'buy'
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                        : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                } disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Order...
                    </div>
                ) : (
                    `${side === 'buy' ? 'Buy' : 'Sell'} ${selectedCrypto.symbol}`
                )}
            </button>
        </form>
    );
}