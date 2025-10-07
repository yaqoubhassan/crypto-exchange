import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function TransactionsTable({ transactions }) {
    const [filter, setFilter] = useState({ type: 'all', status: 'all' });
    const [processing, setProcessing] = useState(null);

    const handleAction = async (transactionId, action) => {
        if (processing) return;
        
        setProcessing(transactionId);
        
        try {
            const response = await fetch(route(`admin.transactions.${action}`, transactionId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    reason: action === 'reject' ? 'Rejected by administrator' : null
                })
            });

            if (response.ok) {
                router.reload({ only: ['recentTransactions'] });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setProcessing(null);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter.type !== 'all' && t.type !== filter.type) return false;
        if (filter.status !== 'all' && t.status !== filter.status) return false;
        return true;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Transaction Management</h3>
                    <div className="flex space-x-2">
                        <select 
                            value={filter.type}
                            onChange={(e) => setFilter({...filter, type: e.target.value})}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="deposit">Deposits</option>
                            <option value="withdrawal">Withdrawals</option>
                            <option value="buy">Buys</option>
                            <option value="sell">Sells</option>
                        </select>
                        <select 
                            value={filter.status}
                            onChange={(e) => setFilter({...filter, status: e.target.value})}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {transaction.user?.name || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {transaction.user?.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                                        transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                                        transaction.type === 'buy' ? 'bg-blue-100 text-blue-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {parseFloat(transaction.amount).toFixed(8)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {transaction.cryptocurrency?.symbol}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {parseFloat(transaction.fee || 0).toFixed(8)}
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
                                                onClick={() => handleAction(transaction.id, 'approve')}
                                                disabled={processing === transaction.id}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(transaction.id, 'reject')}
                                                disabled={processing === transaction.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    )}
                                    {transaction.status !== 'pending' && (
                                        <span className="text-gray-400">No actions</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-2">💳</div>
                        <div>No transactions found</div>
                    </div>
                )}
            </div>
        </div>
    );
}