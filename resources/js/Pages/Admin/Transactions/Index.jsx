import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';

export default function AdminTransactions({ transactions, stats, filters }) {
    const [processing, setProcessing] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [filterStatus, setFilterStatus] = useState(filters?.status || 'all');
    const [filterType, setFilterType] = useState(filters?.type || 'all');

    const handleRowClick = (transactionId) => {
        router.visit(`/admin/transactions/${transactionId}`);
    };

    const openApproveModal = (transaction, e) => {
        e.stopPropagation(); // Prevent row click
        setSelectedTransaction(transaction);
        setShowApproveModal(true);
    };

    const handleApprove = () => {
        setProcessing(selectedTransaction.id);
        router.post(`/admin/transactions/${selectedTransaction.id}/approve`, {}, {
            onSuccess: () => {
                setShowApproveModal(false);
                setSelectedTransaction(null);
            },
            onFinish: () => setProcessing(null),
            preserveScroll: true,
        });
    };

    const openRejectModal = (transaction, e) => {
        e.stopPropagation(); // Prevent row click
        setSelectedTransaction(transaction);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            return;
        }

        setProcessing(selectedTransaction.id);
        router.post(`/admin/transactions/${selectedTransaction.id}/reject`, {
            reason: rejectReason,
        }, {
            onSuccess: () => {
                setShowRejectModal(false);
                setSelectedTransaction(null);
                setRejectReason('');
            },
            onFinish: () => setProcessing(null),
            preserveScroll: true,
        });
    };

    const applyFilters = () => {
        router.get('/admin/transactions', {
            status: filterStatus,
            type: filterType,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getTypeBadge = (type) => {
        const badges = {
            deposit: 'bg-blue-100 text-blue-800',
            withdrawal: 'bg-purple-100 text-purple-800',
            buy: 'bg-green-100 text-green-800',
            sell: 'bg-red-100 text-red-800',
            transfer: 'bg-indigo-100 text-indigo-800',
            fee: 'bg-gray-100 text-gray-800',
        };
        return badges[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Monitor and manage all platform transactions
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="text-4xl">💳</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                        </div>
                        <div className="text-4xl">⏳</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</p>
                        </div>
                        <div className="text-4xl">✅</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Failed</p>
                            <p className="text-2xl font-bold text-red-600 mt-2">{stats.failed}</p>
                        </div>
                        <div className="text-4xl">❌</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Types</option>
                            <option value="deposit">Deposit</option>
                            <option value="withdrawal">Withdrawal</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="transfer">Transfer</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={applyFilters}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Currency
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
                            {transactions.data && transactions.data.length > 0 ? (
                                transactions.data.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        onClick={() => handleRowClick(transaction.id)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                            {transaction.transaction_id.substring(0, 16)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {transaction.user?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {transaction.user?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeBadge(transaction.type)}`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {transaction.cryptocurrency?.symbol}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(transaction.amount || 0).toFixed(8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {parseFloat(transaction.fee || 0).toFixed(8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(transaction.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(transaction.id);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                View
                                            </button>
                                            {transaction.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => openApproveModal(transaction, e)}
                                                        disabled={processing === transaction.id}
                                                        className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => openRejectModal(transaction, e)}
                                                        disabled={processing === transaction.id}
                                                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center">
                                        <div className="text-4xl mb-2">📋</div>
                                        <p className="text-gray-500">No transactions found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.links && transactions.links.length > 3 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {transactions.from || 0} to {transactions.to || 0} of {transactions.total || 0} results
                            </div>
                            <div className="flex space-x-2">
                                {transactions.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url || link.active}
                                        className={`px-3 py-1 rounded-md text-sm ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Approve Confirmation Modal */}
            <ConfirmModal
                show={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Approve Transaction"
                message={
                    <>
                        Are you sure you want to approve this transaction?
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div><span className="font-medium">Transaction ID:</span> {selectedTransaction?.transaction_id}</div>
                                <div><span className="font-medium">User:</span> {selectedTransaction?.user?.name}</div>
                                <div><span className="font-medium">Type:</span> <span className="capitalize">{selectedTransaction?.type}</span></div>
                                <div><span className="font-medium">Amount:</span> {parseFloat(selectedTransaction?.amount || 0).toFixed(8)} {selectedTransaction?.cryptocurrency?.symbol}</div>
                            </div>
                        </div>
                    </>
                }
                confirmText="Approve Transaction"
                confirmColor="green"
                icon="✅"
                loading={processing === selectedTransaction?.id}
            />

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0">
                                <div className="text-4xl">❌</div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">Reject Transaction</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    This action cannot be undone. Please provide a reason for rejection.
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div><span className="font-medium">Transaction ID:</span> {selectedTransaction?.transaction_id}</div>
                                <div><span className="font-medium">User:</span> {selectedTransaction?.user?.name}</div>
                                <div><span className="font-medium">Amount:</span> {parseFloat(selectedTransaction?.amount || 0).toFixed(8)} {selectedTransaction?.cryptocurrency?.symbol}</div>
                            </div>
                        </div>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                            rows="4"
                        />

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing || !rejectReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Rejecting...' : 'Reject Transaction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}