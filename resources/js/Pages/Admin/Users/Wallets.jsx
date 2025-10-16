import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function UserWallets({ auth, user, wallets, totalValue, cryptocurrencies }) {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    cryptocurrency_id: '',
    amount: '',
    notes: '',
    notify_user: true,
  });

  const openCreditModal = (wallet = null) => {
    if (wallet) {
      setData('cryptocurrency_id', wallet.cryptocurrency.id);
      setSelectedWallet(wallet);
    } else {
      setData('cryptocurrency_id', cryptocurrencies[0]?.id || '');
      setSelectedWallet(null);
    }
    setShowCreditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.users.credit-wallet', user.id), {
      onSuccess: () => {
        reset('amount', 'notes');
        setShowCreditModal(false);
        setSelectedWallet(null);
      },
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          User Wallets - {user.name}
        </h2>
      }
    >
      <Head title={`Wallets - ${user.name}`} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={route('admin.users.show', user.id)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to User Profile
          </Link>
          <button
            onClick={() => openCreditModal()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Credit Wallet
          </button>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Portfolio Value</p>
              <h2 className="text-3xl font-bold mt-1">${formatAmount(totalValue)}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Active Wallets</p>
              <p className="text-2xl font-bold">{wallets.length}</p>
            </div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {wallet.cryptocurrency.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {wallet.cryptocurrency.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {wallet.cryptocurrency.symbol}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Available Balance</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatAmount(wallet.balance)} {wallet.cryptocurrency.symbol}
                  </p>
                  <p className="text-sm text-gray-600">
                    ≈ ${formatAmount(wallet.value_usd)}
                  </p>
                </div>

                {wallet.locked_balance > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Locked Balance</p>
                    <p className="text-sm font-medium text-orange-600">
                      {formatAmount(wallet.locked_balance)} {wallet.cryptocurrency.symbol}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={() => openCreditModal(wallet)}
                    className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    Credit This Wallet
                  </button>
                </div>
              </div>
            </div>
          ))}

          {wallets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">No wallets yet</p>
              <button
                onClick={() => openCreditModal()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Wallet
              </button>
            </div>
          )}
        </div>

        {/* Credit Modal */}
        {showCreditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowCreditModal(false)}
              />

              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedWallet ? `Credit ${selectedWallet.cryptocurrency.name}` : 'Credit Wallet'}
                  </h3>
                  <button
                    onClick={() => setShowCreditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cryptocurrency
                    </label>
                    <select
                      value={data.cryptocurrency_id}
                      onChange={(e) => setData('cryptocurrency_id', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={selectedWallet !== null}
                      required
                    >
                      {cryptocurrencies.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.00000001"
                      value={data.amount}
                      onChange={(e) => setData('amount', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Reason for crediting..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.notify_user}
                        onChange={(e) => setData('notify_user', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Notify user
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowCreditModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Credit Wallet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}