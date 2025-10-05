import React from 'react';

export default function OrderBook({ marketData, loading }) {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const orderBook = marketData?.orderBook || { asks: [], bids: [] };

    return (
        <div className="space-y-4">
            {/* Sell Orders (Asks) */}
            <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Sell Orders</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {orderBook.asks.length > 0 ? (
                        orderBook.asks.map((order, index) => (
                            <div key={index} className="flex justify-between text-xs py-1 px-2 bg-red-50 rounded">
                                <span className="text-red-600 font-medium">
                                    {parseFloat(order.price).toFixed(2)}
                                </span>
                                <span className="text-gray-600">
                                    {parseFloat(order.quantity).toFixed(6)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 text-center py-4">
                            No sell orders
                        </div>
                    )}
                </div>
            </div>

            {/* Spread */}
            <div className="border-t border-b border-gray-200 py-2">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Spread</div>
                    <div className="text-sm font-medium text-gray-700">
                        {orderBook.asks.length > 0 && orderBook.bids.length > 0 
                            ? `$${(parseFloat(orderBook.asks[0]?.price || 0) - parseFloat(orderBook.bids[0]?.price || 0)).toFixed(2)}`
                            : 'N/A'
                        }
                    </div>
                </div>
            </div>

            {/* Buy Orders (Bids) */}
            <div>
                <h4 className="text-sm font-medium text-green-600 mb-2">Buy Orders</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {orderBook.bids.length > 0 ? (
                        orderBook.bids.map((order, index) => (
                            <div key={index} className="flex justify-between text-xs py-1 px-2 bg-green-50 rounded">
                                <span className="text-green-600 font-medium">
                                    {parseFloat(order.price).toFixed(2)}
                                </span>
                                <span className="text-gray-600">
                                    {parseFloat(order.quantity).toFixed(6)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 text-center py-4">
                            No buy orders
                        </div>
                    )}
                </div>
            </div>

            {/* Order Book Legend */}
            <div className="border-t pt-2">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Price</span>
                    <span>Amount</span>
                </div>
            </div>
        </div>
    );
}