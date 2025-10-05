import React from 'react';
import { Link } from '@inertiajs/react';

export default function WalletBalance({ wallets }) {
    const totalValue = wallets.reduce((sum, wallet) => {
        const balance = parseFloat(wallet.balance || 0);
        const price = parseFloat(wallet.cryptocurrency?.current_price || 0);
        return sum + (balance * price);
    }, 0);

    return (
        <div className="space-y-4">
            {/* Total Portfolio Value */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="text-sm opacity-90">Total Portfolio Value</div>
                <div className="text-2xl font-bold">
                    ${totalValue.toFixed(2)}
                </div>
            </div>

            {/* Individual Wallet Balances */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {wallets.length > 0 ? (
                    wallets.map((wallet) => {
                        const balance = parseFloat(wallet.balance || 0);
                        const lockedBalance = parseFloat(wallet.locked_balance || 0);
                        const totalBalance = balance + lockedBalance;
                        const crypto = wallet.cryptocurrency;
                        const value = balance * parseFloat(crypto?.current_price || 0);

                        return (
                            <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {crypto?.symbol?.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {crypto?.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {crypto?.symbol}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-900">
                                        {balance.toFixed(crypto?.is_fiat ? 2 : 8)}
                                    </div>
                                    {lockedBalance > 0 && (
                                        <div className="text-xs text-orange-600">
                                            {lockedBalance.toFixed(crypto?.is_fiat ? 2 : 8)} locked
                                        </div>
                                    )}
                                    {!crypto?.is_fiat && (
                                        <div className="text-xs text-gray-500">
                                            ≈ ${value.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-sm">No wallet balances</div>
                        <div className="text-xs text-gray-400 mt-1">
                            Deposit funds to start trading
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 pt-3 border-t">
                <Link
                    href="/wallet"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                    Manage Wallet
                </Link>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    Deposit
                </button>
            </div>
        </div>
    );
}