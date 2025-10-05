import React from 'react';

export default function RecentTrades({ marketData, loading }) {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const recentTrades = marketData?.recentTrades || [];

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex justify-between text-xs font-medium text-gray-500 pb-2 border-b">
                <span>Time</span>
                <span>Type</span>
                <span>Price</span>
                <span>Amount</span>
            </div>

            {/* Trades List */}
            <div className="max-h-64 overflow-y-auto space-y-1">
                {recentTrades.length > 0 ? (
                    recentTrades.map((trade, index) => (
                        <div key={index} className="flex justify-between items-center text-xs py-2 px-2 hover:bg-gray-50 rounded">
                            <span className="text-gray-600">
                                {new Date(trade.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                            <span className={`font-medium capitalize ${
                                trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trade.type}
                            </span>
                            <span className="font-medium">
                                ${parseFloat(trade.price || 0).toFixed(2)}
                            </span>
                            <span className="text-gray-600">
                                {parseFloat(trade.amount).toFixed(6)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-sm">No recent trades</div>
                        <div className="text-xs text-gray-400 mt-1">
                            Trades will appear here once orders are executed
                        </div>
                    </div>
                )}
            </div>

            {/* Trade Statistics */}
            {recentTrades.length > 0 && (
                <div className="border-t pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                            <div className="text-gray-500">Total Trades</div>
                            <div className="font-semibold text-gray-900">
                                {recentTrades.length}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-500">Avg Price</div>
                            <div className="font-semibold text-gray-900">
                                ${recentTrades.length > 0 
                                    ? (recentTrades.reduce((sum, trade) => sum + parseFloat(trade.price || 0), 0) / recentTrades.length).toFixed(2)
                                    : '0.00'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}