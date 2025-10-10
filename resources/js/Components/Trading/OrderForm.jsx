import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import OrderConfirmationModal from './OrderConfirmationModal';
import Toast from './Toast';

export default function OrderForm({ selectedCrypto, wallets, cryptocurrencies }) {
    const [orderType, setOrderType] = useState('market');
    const [side, setSide] = useState('buy');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState(null);

    const usdCurrency = cryptocurrencies.find(c => c.symbol === 'USD');
    const userWallet = wallets.find(w => w.cryptocurrency_id === selectedCrypto?.id);
    const usdWallet = wallets.find(w => w.cryptocurrency_id === usdCurrency?.id);

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

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validate balance
        const total = calculateTotal();
        const available = getAvailableBalance();

        if (side === 'buy' && total > available) {
            setToast({
                message: 'Insufficient USD balance',
                type: 'error'
            });
            return;
        }

        if (side === 'sell' && parseFloat(quantity) > available) {
            setToast({
                message: `Insufficient ${selectedCrypto.symbol} balance`,
                type: 'error'
            });
            return;
        }

        // Show confirmation modal
        setShowConfirmModal(true);
    };

    const handleConfirmOrder = async () => {
        setLoading(true);

        try {
            const response = await axios.post('/api/orders', {
                base_currency_id: selectedCrypto.id,
                quote_currency_id: usdCurrency.id,
                type: orderType,
                side: side,
                quantity: parseFloat(quantity),
                price: orderType === 'market' ? null : parseFloat(price),
            });

            // Success
            setShowConfirmModal(false);
            setQuantity('');
            setPrice('');

            setToast({
                message: `${side === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`,
                type: 'success'
            });

            // Refresh the page to update balances
            setTimeout(() => {
                router.reload({ only: ['wallets', 'activeOrders'] });
            }, 500);

        } catch (err) {
            console.error('Order placement error:', err);

            setShowConfirmModal(false);

            // Better error handling
            let errorMessage = 'Failed to place order';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.request) {
                errorMessage = 'No response from server. Please check if the server is running.';
            } else {
                errorMessage = err.message || 'An unknown error occurred';
            }

            setToast({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
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
        <>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Order Type Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setOrderType('market')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${orderType === 'market'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Market
                    </button>
                    <button
                        type="button"
                        onClick={() => setOrderType('limit')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${orderType === 'limit'
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
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${side === 'buy'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Buy
                    </button>
                    <button
                        type="button"
                        onClick={() => setSide('sell')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${side === 'sell'
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
                        <span className={`font-medium capitalize ${side === 'buy' ? 'text-green-600' : 'text-red-600'
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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !quantity || (orderType === 'limit' && !price)}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${side === 'buy'
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                        : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                        } disabled:cursor-not-allowed`}
                >
                    {side === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.symbol}
                </button>
            </form>

            {/* Confirmation Modal */}
            <OrderConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => !loading && setShowConfirmModal(false)}
                onConfirm={handleConfirmOrder}
                loading={loading}
                orderDetails={{
                    side,
                    type: orderType,
                    quantity,
                    price,
                    crypto: selectedCrypto.symbol,
                    total: calculateTotal()
                }}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}