import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import CreditWalletModal from '@/Components/Admin/CreditWalletModal';

export default function UserShow({ auth, user, stats, cryptocurrencies }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(user.status || 'active');
  const [statusReason, setStatusReason] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleStatusUpdate = () => {
    setProcessing(true);
    router.post(route('admin.users.status', user.id), {
      status: selectedStatus,
      reason: statusReason
    }, {
      onSuccess: () => {
        setShowStatusModal(false);
        setStatusReason('');
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleToggleAdmin = () => {
    setProcessing(true);
    router.post(route('admin.users.toggle-admin', user.id), {}, {
      onSuccess: () => setShowAdminModal(false),
      onFinish: () => setProcessing(false)
    });
  };

  const handlePasswordReset = () => {
    if (newPassword !== passwordConfirmation) {
      alert('Passwords do not match');
      return;
    }
    setProcessing(true);
    router.post(route('admin.users.reset-password', user.id), {
      password: newPassword,
      password_confirmation: passwordConfirmation
    }, {
      onSuccess: () => {
        setShowPasswordModal(false);
        setNewPassword('');
        setPasswordConfirmation('');
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleDeleteUser = () => {
    if (confirm(`Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`)) {
      router.delete(route('admin.users.destroy', user.id));
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-gray-800 text-white'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.active}`}>
        {status || 'active'}
      </span>
    );
  };

  const KycBadge = ({ status }) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      not_submitted: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.not_submitted}`}>
        {status ? status.replace('_', ' ') : 'not submitted'}
      </span>
    );
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          User Management
        </h2>
      }
    >
      <Head title={`User: ${user.name}`} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={route('admin.users.index')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreditModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Credit Wallet
            </button>

            <Link
              href={route('admin.users.wallets', user.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              View Wallets
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <StatusBadge status={user.status} />
                        <KycBadge status={user.kyc_status} />
                        {user.is_admin && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.location || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Created</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{formatDate(user.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{formatDate(user.last_login_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Verified</p>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {user.email_verified_at ? (
                        <span className="text-green-600">✓ Verified</span>
                      ) : (
                        <span className="text-red-600">✗ Not Verified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Age</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{stats.account_age_days} days</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 px-6 py-4 flex items-center space-x-3">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  {user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                >
                  Delete Account
                </button>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.transactions && user.transactions.length > 0 ? (
                      user.transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.transaction_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(transaction.amount)} {transaction.cryptocurrency?.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {user.transactions && user.transactions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Link
                    href={route('admin.transactions', { user_id: user.id })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all transactions →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Wallets */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Statistics</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.total_transactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Deposits</span>
                  <span className="text-sm font-semibold text-green-600">
                    ${formatAmount(stats.total_deposits)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Withdrawals</span>
                  <span className="text-sm font-semibold text-red-600">
                    ${formatAmount(stats.total_withdrawals)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Portfolio Value</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${formatAmount(stats.total_balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Wallets</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.total_wallets}</span>
                </div>
              </div>
            </div>

            {/* Wallets Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Wallets</h2>
                <Link
                  href={route('admin.users.wallets', user.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              <div className="p-6 space-y-3">
                {user.wallets && user.wallets.length > 0 ? (
                  user.wallets.slice(0, 3).map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {wallet.cryptocurrency?.symbol?.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {wallet.cryptocurrency?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {wallet.cryptocurrency?.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatAmount(wallet.balance)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${formatAmount((wallet.balance || 0) * (wallet.cryptocurrency?.current_price || 0))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No wallets yet</p>
                    <button
                      onClick={() => setShowCreditModal(true)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Create First Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowStatusModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update User Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                    <textarea
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Reason for status change..."
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowPasswordModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset User Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordReset}
                      disabled={processing}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {processing ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Toggle Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAdminModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {user.is_admin ? 'Revoke Admin Privileges' : 'Grant Admin Privileges'}
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to {user.is_admin ? 'revoke admin privileges from' : 'grant admin privileges to'} {user.name}?
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleAdmin}
                    disabled={processing}
                    className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 ${user.is_admin ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                  >
                    {processing ? 'Processing...' : user.is_admin ? 'Revoke' : 'Grant'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credit Wallet Modal */}
        <CreditWalletModal
          show={showCreditModal}
          onClose={() => setShowCreditModal(false)}
          user={user}
          cryptocurrencies={cryptocurrencies}
        />
      </div>
    </AdminLayout>
  );
}