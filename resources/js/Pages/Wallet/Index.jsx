import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout.jsx';

export default function WalletIndex({ wallets, cryptocurrencies, stats, recentTransactions, portfolioDistribution }) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleDeposit = (crypto) => {
    setSelectedCrypto(crypto);
    setDepositAmount('');
    setShowDepositModal(true);
  };

  const handleWithdraw = (crypto) => {
    setSelectedCrypto(crypto);
    setWithdrawAmount('');
    setWithdrawAddress('');
    setShowWithdrawModal(true);
  };

  const submitDeposit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.post('/wallet/deposit', {
      cryptocurrency_id: selectedCrypto.id,
      amount: depositAmount,
    }, {
      onSuccess: () => {
        setShowDepositModal(false);
        setDepositAmount('');
      },
      onFinish: () => setProcessing(false),
    });
  };

  const submitWithdraw = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.post('/wallet/withdraw', {
      cryptocurrency_id: selectedCrypto.id,
      amount: withdrawAmount,
      address: withdrawAddress,
    }, {
      onSuccess: () => {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawAddress('');
      },
      onFinish: () => setProcessing(false),
    });
  };

  const StatCard = ({ title, value, icon, color = 'indigo' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <Head title="Wallet" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your cryptocurrency wallets and view transaction history
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Portfolio Value"
          value={`$${parseFloat(stats.total_portfolio_value).toFixed(2)}`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Active Wallets"
          value={stats.active_wallets}
          icon="👛"
          color="blue"
        />
        <StatCard
          title="Pending Transactions"
          value={stats.pending_transactions}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Total Wallets"
          value={stats.total_wallets}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Distribution */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Distribution</h2>
          </div>
          <div className="p-6">
            {portfolioDistribution.length > 0 ? (
              <div className="space-y-4">
                {portfolioDistribution.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {item.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${parseFloat(item.value || 0).toFixed(2)}</p>
                        <p className={`text-sm ${parseFloat(item.change_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(item.change_24h || 0) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(item.change_24h || 0))}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{parseFloat(item.balance || 0).toFixed(8)} {item.symbol}</span>
                      </div>
                      {parseFloat(item.locked_balance || 0) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Locked:</span>
                          <span className="font-medium text-orange-600">{parseFloat(item.locked_balance || 0).toFixed(8)} {item.symbol}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">{parseFloat(item.total_balance || 0).toFixed(8)} {item.symbol}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${parseFloat(item.percentage || 0)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{parseFloat(item.percentage || 0).toFixed(1)}% of portfolio</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeposit(item)}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Deposit
                        </button>
                        <button
                          onClick={() => handleWithdraw(item)}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💼</div>
                <p className="text-gray-500 mb-4">No assets in your portfolio yet</p>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Make Your First Deposit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={() => {
                setSelectedCrypto(cryptocurrencies.find(c => c.symbol === 'USD') || cryptocurrencies[0]);
                setShowDepositModal(true);
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
            >
              💵 Deposit Funds
            </button>
            <button
              onClick={() => {
                setSelectedCrypto(cryptocurrencies.find(c => c.symbol === 'USD') || cryptocurrencies[0]);
                setShowWithdrawModal(true);
              }}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
            >
              💸 Withdraw Funds
            </button>
            <a
              href="/trading"
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              💹 Start Trading
            </a>
            <a
              href="/transactions"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-all"
            >
              📊 Transaction History
            </a>
          </div>

          {/* Wallet Summary */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deposits:</span>
                <span className="font-medium">${parseFloat(stats.total_deposits || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Withdrawals:</span>
                <span className="font-medium">${parseFloat(stats.total_withdrawals || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-900 font-semibold">Net Balance:</span>
                <span className="font-bold text-indigo-600">
                  ${(parseFloat(stats.total_deposits || 0) - parseFloat(stats.total_withdrawals || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'deposit'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {transaction.type === 'deposit' ? '⬇️ Deposit' : '⬆️ Withdraw'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.cryptocurrency?.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(transaction.amount).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(transaction.fee || 0).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Deposit Funds</h2>
            <form onSubmit={submitDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Cryptocurrency
                </label>
                <select
                  value={selectedCrypto?.id || ''}
                  onChange={(e) => setSelectedCrypto(cryptocurrencies.find(c => c.id == e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choose currency...</option>
                  {cryptocurrencies.map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>
            <form onSubmit={submitWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Cryptocurrency
                </label>
                <select
                  value={selectedCrypto?.id || ''}
                  onChange={(e) => setSelectedCrypto(cryptocurrencies.find(c => c.id == e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choose currency...</option>
                  {cryptocurrencies.map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fee: 0.5% • Total: {withdrawAmount ? (parseFloat(withdrawAmount) * 1.005).toFixed(8) : '0.00'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Address (Optional)
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter withdrawal address"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}