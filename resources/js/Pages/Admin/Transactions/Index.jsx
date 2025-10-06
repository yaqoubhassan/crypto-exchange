import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function TransactionsIndex({
    auth,
    transactions = {
        data: [
            { id: 1, user: { name: 'John Doe', email: 'john@example.com' }, type: 'deposit', amount: 1000, currency: 'USD', status: 'pending', created_at: '2024-01-15 10:30:00', fee: 5.00 },
            { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com' }, type: 'withdrawal', amount: 0.5, currency: 'BTC', status: 'pending', created_at: '2024-01-15 09:15:00', fee: 0.001 },
            { id: 3, user: { name: 'Bob Johnson', email: 'bob@example.com' }, type: 'trade', amount: 2500, currency: 'USD', status: 'completed', created_at: '2024-01-15 08:45:00', fee: 12.50 },
            { id: 4, user: { name: 'Alice Brown', email: 'alice@example.com' }, type: 'deposit', amount: 500, currency: 'EUR', status: 'pending', created_at: '2024-01-15 07:20:00', fee: 2.50 },
        ],
        total: 4,
        per_page: 20,
        current_page: 1
    },
    filters = {},
    stats = {
        total_transactions: 8945,
        pending_transactions: 23,
        total_volume: 2500000,
        total_fees: 15000
    }
}) {
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [processingAction, setProcessingAction] = useState(null);

    const { data, setData, get, post, processing } = useForm({
        search: filters.search || '',
        type: filters.type || '',
        status: filters.status || '',
        currency: filters.currency || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        amount_min: filters.amount_min || '',
        amount_max: filters.amount_max || '',
        sort: 'created_at',
        direction: 'desc'
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.transactions'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTransactionAction = (transactionId, action) => {
        setProcessingAction(`${action}-${transactionId}`);

        post(route(`admin.transactions.${action}`, transactionId), {
            onSuccess: () => {
                // Handle success
                console.log(`Transaction ${action}d successfully`);
            },
            onError: () => {
                setProcessingAction(null);
            }
        });
    };

    const handleBulkAction = (action) => {
        if (selectedTransactions.length === 0) return;

        // Implement bulk actions
        console.log(`Bulk ${action} for transactions:`, selectedTransactions);
    };

    const toggleTransactionSelection = (transactionId) => {
        setSelectedTransactions(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const selectAllTransactions = () => {
        if (selectedTransactions.length === transactions.data.length) {
            setSelectedTransactions([]);
        } else {
            setSelectedTransactions(transactions.data.map(transaction => transaction.id));
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            processing: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
                {status}
            </span>
        );
    };

    const TypeBadge = ({ type }) => {
        const colors = {
            deposit: 'bg-green-100 text-green-800',
            withdrawal: 'bg-red-100 text-red-800',
            trade: 'bg-blue-100 text-blue-800',
            transfer: 'bg-purple-100 text-purple-800'
        };

        const icons = {
            deposit: '⬇️',
            withdrawal: '⬆️',
            trade: '🔄',
            transfer: '↔️'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.trade}`}>
                {icons[type]} {type}
            </span>
        );
    };

    const formatAmount = (amount, currency) => {
        if (currency === 'BTC' || currency === 'ETH') {
            return `${parseFloat(amount).toFixed(8)} ${currency}`;
        }
        return `${parseFloat(amount).toLocaleString()} ${currency}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        💳 Transaction Management
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            🔍 {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            📊 Export Report
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Transaction Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="text-3xl text-blue-600">💳</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Transactions
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {stats.total_transactions.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="text-3xl text-yellow-600">⏳</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Pending Approvals
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                {stats.pending_transactions}
                                            </dd>
                                            <dd className="text-sm text-yellow-600 font-medium">
                                                Requires attention
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="text-3xl text-green-600">📊</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Volume
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                `${(stats.total_volume / 1000000).toFixed(1)}M`
                                            </dd>
                                            <dd className="text-sm text-green-600 font-medium">
                                                All time
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border-l-4 border-purple-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="text-3xl text-purple-600">💰</div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Fees
                                            </dt>
                                            <dd className="text-2xl font-bold text-gray-900">
                                                `${stats.total_fees.toLocaleString()}`
                                            </dd>
                                            <dd className="text-sm text-purple-600 font-medium">
                                                Revenue generated
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="p-6">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Search
                                            </label>
                                            <input
                                                type="text"
                                                value={data.search}
                                                onChange={(e) => setData('search', e.target.value)}
                                                placeholder="User email or transaction ID..."
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Type
                                            </label>
                                            <select
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">All Types</option>
                                                <option value="deposit">Deposits</option>
                                                <option value="withdrawal">Withdrawals</option>
                                                <option value="trade">Trades</option>
                                                <option value="transfer">Transfers</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">All Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="failed">Failed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Currency
                                            </label>
                                            <select
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">All Currencies</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="BTC">BTC</option>
                                                <option value="ETH">ETH</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date From
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_from}
                                                onChange={(e) => setData('date_from', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date To
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_to}
                                                onChange={(e) => setData('date_to', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={data.amount_min}
                                                onChange={(e) => setData('amount_min', e.target.value)}
                                                placeholder="0"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={data.amount_max}
                                                onChange={(e) => setData('amount_max', e.target.value)}
                                                placeholder="No limit"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Searching...' : '🔍 Search'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData({
                                                    search: '',
                                                    type: '',
                                                    status: '',
                                                    currency: '',
                                                    date_from: '',
                                                    date_to: '',
                                                    amount_min: '',
                                                    amount_max: '',
                                                    sort: 'created_at',
                                                    direction: 'desc'
                                                });
                                                router.get(route('admin.transactions'));
                                            }}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            🔄 Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Bulk Actions */}
                    {selectedTransactions.length > 0 && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-indigo-900">
                                        {selectedTransactions.length} transaction(s) selected
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleBulkAction('approve')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        ✅ Approve Selected
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('reject')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        ❌ Reject Selected
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('export')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        📊 Export Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedTransactions.length === transactions.data.length && transactions.data.length > 0}
                                                onChange={selectAllTransactions}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
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
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTransactions.includes(transaction.id)}
                                                    onChange={() => toggleTransactionSelection(transaction.id)}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                `#${transaction.id.toString().padStart(6, '0')}`
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {transaction.user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <TypeBadge type={transaction.type} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatAmount(transaction.amount, transaction.currency)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatAmount(transaction.fee, transaction.currency)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={transaction.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        👁️ View
                                                    </button>
                                                    {transaction.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleTransactionAction(transaction.id, 'approve')}
                                                                disabled={processingAction === `approve-${transaction.id}`}
                                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                            >
                                                                {processingAction === `approve-${transaction.id}` ? '⏳' : '✅'} Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleTransactionAction(transaction.id, 'reject')}
                                                                disabled={processingAction === `reject-${transaction.id}`}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                {processingAction === `reject-${transaction.id}` ? '⏳' : '❌'} Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination would go here */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Previous
                                    </button>
                                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">1</span> to{' '}
                                            <span className="font-medium">{transactions.data.length}</span> of{' '}
                                            <span className="font-medium">{transactions.total}</span> results
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
