import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft, Edit, TrendingUp, TrendingDown, Users,
  Wallet, Activity, DollarSign, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function CryptocurrencyShow({ cryptocurrency, stats, recentTransactions }) {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return parseFloat(num).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy':
      case 'deposit':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'sell':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <Head title={`${cryptocurrency.name} Details`} />

      {/* Header */}
      <div className="mb-6">
        <Link
          href={route('admin.cryptocurrencies.index')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cryptocurrencies
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {cryptocurrency.icon ? (
              <img
                src={`/storage/${cryptocurrency.icon}`}
                alt={cryptocurrency.name}
                className="w-16 h-16 rounded-xl object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ display: cryptocurrency.icon ? 'none' : 'flex' }}
            >
              {cryptocurrency.symbol.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{cryptocurrency.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600">{cryptocurrency.symbol}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${cryptocurrency.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {cryptocurrency.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${cryptocurrency.is_fiat
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
                  }`}>
                  {cryptocurrency.is_fiat ? 'Fiat' : 'Crypto'}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={route('admin.cryptocurrencies.edit', cryptocurrency.id)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Price Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(cryptocurrency.current_price).toFixed(cryptocurrency.decimal_places)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">24h Change</p>
            {cryptocurrency.change_24h !== null ? (
              <div className={`inline-flex items-center text-xl font-bold ${cryptocurrency.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {cryptocurrency.change_24h >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2" />
                )}
                {Math.abs(cryptocurrency.change_24h).toFixed(2)}%
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-400">N/A</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Market Cap</p>
            <p className="text-2xl font-bold text-gray-900">
              {cryptocurrency.market_cap ? `$${formatNumber(cryptocurrency.market_cap)}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-gray-900">
              {cryptocurrency.volume_24h ? `$${formatNumber(cryptocurrency.volume_24h)}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Wallets */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Wallets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total_wallets.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {parseFloat(stats.total_balance).toFixed(cryptocurrency.decimal_places)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{cryptocurrency.symbol}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Locked Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Locked Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {parseFloat(stats.total_locked).toFixed(cryptocurrency.decimal_places)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{cryptocurrency.symbol}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total_transactions.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total_orders.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* 24h Volume */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform 24h Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${formatNumber(stats.volume_24h)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.transaction_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{transaction.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {parseFloat(transaction.amount).toFixed(cryptocurrency.decimal_places)} {cryptocurrency.symbol}
                      </div>
                      {transaction.price && (
                        <div className="text-sm text-gray-500">
                          @ ${parseFloat(transaction.price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(transaction.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No transactions have been made with this cryptocurrency yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {recentTransactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Link
              href={route('admin.transactions', { cryptocurrency_id: cryptocurrency.id })}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all transactions →
            </Link>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Decimal Places</dt>
            <dd className="mt-1 text-sm text-gray-900">{cryptocurrency.decimal_places}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Trading Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {cryptocurrency.is_active ? 'Active - Trading Enabled' : 'Inactive - Trading Disabled'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Currency Type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {cryptocurrency.is_fiat ? 'Fiat Currency' : 'Cryptocurrency'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(cryptocurrency.created_at)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(cryptocurrency.updated_at)}</dd>
          </div>
        </dl>
      </div>
    </AdminLayout>
  );
}