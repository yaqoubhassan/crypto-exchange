import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';

export default function AdminTransactionShow({
  transaction,
  wallet,
  userTransactions,
  relatedTransactions,
  kycStatus,
  userStats
}) {
  const [processing, setProcessing] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    setProcessing(true);
    router.post(`/admin/transactions/${transaction.id}/approve`, {}, {
      onSuccess: () => {
        setShowApproveModal(false);
      },
      onFinish: () => setProcessing(false),
      preserveScroll: true,
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;

    setProcessing(true);
    router.post(`/admin/transactions/${transaction.id}/reject`, {
      reason: rejectReason,
    }, {
      onSuccess: () => {
        setShowRejectModal(false);
        setRejectReason('');
      },
      onFinish: () => setProcessing(false),
      preserveScroll: true,
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeBadge = (type) => {
    const badges = {
      deposit: 'bg-blue-100 text-blue-800 border-blue-200',
      withdrawal: 'bg-purple-100 text-purple-800 border-purple-200',
      buy: 'bg-green-100 text-green-800 border-green-200',
      sell: 'bg-red-100 text-red-800 border-red-200',
      transfer: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      fee: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return badges[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getKycBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  return (
    <AdminLayout>
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/admin/transactions"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Transactions
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{transaction.transaction_id}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete transaction information and admin actions
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            {transaction.status === 'pending' && (
              <>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  ❌ Reject
                </button>
              </>
            )}
            <Link
              href="/admin/transactions"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Transaction Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 break-all">
                    {transaction.transaction_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(
                        transaction.type
                      )}`}
                    >
                      {transaction.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {transaction.cryptocurrency?.name} ({transaction.cryptocurrency?.symbol})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatAmount(transaction.amount)} {transaction.cryptocurrency?.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fee</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatAmount(transaction.fee || 0)} {transaction.cryptocurrency?.symbol}
                  </p>
                </div>
              </div>

              {transaction.price && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ${formatAmount(transaction.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ${formatAmount(parseFloat(transaction.amount) * parseFloat(transaction.price))}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processed At</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(transaction.processed_at)}
                  </p>
                </div>
              </div>

              {transaction.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes / Reason</p>
                  <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {transaction.notes}
                  </p>
                </div>
              )}

              {transaction.external_tx_id && (
                <div>
                  <p className="text-sm text-gray-600">Blockchain Transaction Hash</p>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all bg-gray-50 p-3 rounded-md">
                    {transaction.external_tx_id}
                  </p>
                </div>
              )}

              {transaction.from_address && (
                <div>
                  <p className="text-sm text-gray-600">From Address</p>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all bg-gray-50 p-3 rounded-md">
                    {transaction.from_address}
                  </p>
                </div>
              )}

              {transaction.to_address && (
                <div>
                  <p className="text-sm text-gray-600">To Address</p>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all bg-gray-50 p-3 rounded-md">
                    {transaction.to_address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User's Recent Transactions */}
          {userTransactions && userTransactions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  User's Recent Transactions
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{txn.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadge(
                              txn.type
                            )}`}
                          >
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAmount(txn.amount)} {txn.cryptocurrency?.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              txn.status
                            )}`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(txn.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/admin/transactions/${txn.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {transaction.user?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 text-sm text-gray-900 break-all">
                  {transaction.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="mt-1 text-sm font-mono text-gray-900">
                  #{transaction.user?.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kycStatus
                      ? getKycBadge(kycStatus.verification_status)
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {kycStatus ? kycStatus.verification_status.toUpperCase() : 'NOT SUBMITTED'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.user?.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {transaction.user?.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href={`/admin/users/${transaction.user?.id}`}
                  className="block w-full px-4 py-2 bg-indigo-600 text-white text-center text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View User Profile
                </Link>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Transactions</span>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.total_transactions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-semibold text-green-600">
                  {userStats.completed_transactions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {userStats.pending_transactions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Volume</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${formatAmount(userStats.total_volume)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Age</span>
                <span className="text-sm font-semibold text-gray-900">
                  {userStats.account_age_days} days
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          {wallet && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User's Wallet</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {wallet.cryptocurrency?.name} ({wallet.cryptocurrency?.symbol})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    {formatAmount(wallet.balance)} {wallet.cryptocurrency?.symbol}
                  </p>
                </div>
                {wallet.locked_balance > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Locked Balance</p>
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      {formatAmount(wallet.locked_balance)} {wallet.cryptocurrency?.symbol}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
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
                <div>
                  <span className="font-medium">Transaction ID:</span> {transaction.transaction_id}
                </div>
                <div>
                  <span className="font-medium">User:</span> {transaction.user?.name}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{' '}
                  <span className="capitalize">{transaction.type}</span>
                </div>
                <div>
                  <span className="font-medium">Amount:</span> {formatAmount(transaction.amount)}{' '}
                  {transaction.cryptocurrency?.symbol}
                </div>
              </div>
            </div>
          </>
        }
        confirmText="Approve Transaction"
        confirmColor="green"
        icon="✅"
        loading={processing}
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
                  Provide a reason for rejecting this transaction.
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Transaction ID:</span> {transaction.transaction_id}
                </div>
                <div>
                  <span className="font-medium">User:</span> {transaction.user?.name}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> {formatAmount(transaction.amount)}{' '}
                  {transaction.cryptocurrency?.symbol}
                </div>
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