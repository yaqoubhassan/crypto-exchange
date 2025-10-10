import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.jsx';

export default function TransactionShow({ transaction, wallet, relatedTransactions }) {
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

  const getTypeIcon = (type) => {
    const icons = {
      deposit: '⬇️',
      withdrawal: '⬆️',
      buy: '🛒',
      sell: '💵',
      transfer: '🔄',
      fee: '💳',
    };
    return icons[type] || '💰';
  };

  const formatDate = (dateString) => {
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
    <DashboardLayout>
      <Head title={`Transaction ${transaction.transaction_id}`} />

      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/transactions"
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
              View complete information about this transaction
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/transactions"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
            >
              ← Back to Transactions
            </Link>
          </div>
        </div>
      </div>

      {/* Transaction Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Transaction Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
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
                    <span className="mr-1">{getTypeIcon(transaction.type)}</span>
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

            <div>
              <p className="text-sm text-gray-600">Transaction Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(transaction.created_at)}
              </p>
            </div>

            {transaction.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="mt-1 text-sm text-gray-700">{transaction.notes}</p>
              </div>
            )}

            {transaction.hash && (
              <div>
                <p className="text-sm text-gray-600">Transaction Hash</p>
                <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                  {transaction.hash}
                </p>
              </div>
            )}

            {transaction.address && (
              <div>
                <p className="text-sm text-gray-600">
                  {transaction.type === 'deposit' ? 'From Address' : 'To Address'}
                </p>
                <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                  {transaction.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Wallet Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Wallet Balance */}
          {wallet && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Current Wallet</h2>
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

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/wallet"
                className="block w-full px-4 py-2 bg-white text-center text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors border border-gray-200"
              >
                View Wallet
              </Link>
              <Link
                href="/transactions"
                className="block w-full px-4 py-2 bg-white text-center text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors border border-gray-200"
              >
                All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Transactions */}
      {relatedTransactions && relatedTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent {transaction.cryptocurrency?.symbol} Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
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
                {relatedTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {txn.transaction_id.substring(0, 16)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadge(
                          txn.type
                        )}`}
                      >
                        <span className="mr-1">{getTypeIcon(txn.type)}</span>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(txn.amount)} {txn.cryptocurrency?.symbol}
                      </div>
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
                        href={`/transactions/${txn.id}`}
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
    </DashboardLayout>
  );
}