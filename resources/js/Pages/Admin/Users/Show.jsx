import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import CreditWalletModal from '@/Components/Admin/CreditWalletModal';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';
import Toast from '@/Components/Trading/Toast';

export default function UserShow({ auth, user, stats, cryptocurrencies }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(user.status || 'active');
  const [statusReason, setStatusReason] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  const handleStatusUpdate = () => {
    setProcessing(true);
    router.post(route('admin.users.status', user.id), {
      status: selectedStatus,
      reason: statusReason
    }, {
      onSuccess: () => {
        setShowStatusModal(false);
        setStatusReason('');
        setToast({
          type: 'success',
          message: `User status updated to ${selectedStatus}`
        });
      },
      onError: () => {
        setToast({
          type: 'error',
          message: 'Failed to update user status'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleToggleAdmin = () => {
    setProcessing(true);
    router.post(route('admin.users.toggle-admin', user.id), {}, {
      onSuccess: () => {
        setShowAdminModal(false);
        setToast({
          type: 'success',
          message: user.is_admin ? 'Admin privileges revoked' : 'Admin privileges granted'
        });
      },
      onError: () => {
        setToast({
          type: 'error',
          message: 'Failed to update admin privileges'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handlePasswordReset = () => {
    setPasswordError('');

    if (newPassword !== passwordConfirmation) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
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
        setPasswordError('');
        setToast({
          type: 'success',
          message: 'Password reset successfully'
        });
      },
      onError: () => {
        setToast({
          type: 'error',
          message: 'Failed to reset password'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleDeleteUser = () => {
    setProcessing(true);
    router.delete(route('admin.users.destroy', user.id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setToast({
          type: 'success',
          message: `User ${user.name} deleted successfully`
        });
      },
      onError: () => {
        setToast({
          type: 'error',
          message: 'Failed to delete user'
        });
        setProcessing(false);
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getAccountAge = () => {
    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getKycStatusColor = (kycStatus) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      not_submitted: 'bg-gray-100 text-gray-800'
    };
    return colors[kycStatus] || 'bg-gray-100 text-gray-800';
  };

  const getKycStatusLabel = (kycStatus) => {
    const labels = {
      approved: 'Verified',
      verified: 'Verified',
      pending: 'Pending',
      rejected: 'Rejected',
      not_submitted: 'Not Submitted'
    };
    return labels[kycStatus] || 'Unknown';
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title={`User: ${user.name}`} />

      <div className="py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href={route('admin.users.index')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(user.kyc_status)}`}>
              KYC: {getKycStatusLabel(user.kyc_status)}
            </span>
            {user.is_admin && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Admin
              </span>
            )}
            {user.email_verified_at && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                ✓ Email Verified
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Change Status
            </button>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              {user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Reset Password
            </button>
            <button
              onClick={() => setShowCreditModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Manage Wallet
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium sm:col-span-2 lg:col-span-3 xl:col-span-1"
            >
              Delete User
            </button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-sm font-medium text-gray-900">#{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Age</p>
                  <p className="text-sm font-medium text-gray-900">{getAccountAge()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.location || user.country || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email_verified_at ? (
                      <span className="text-green-600">✓ Verified</span>
                    ) : (
                      <span className="text-red-600">✗ Not Verified</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">KYC Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getKycStatusColor(user.kyc_status)}`}>
                    {getKycStatusLabel(user.kyc_status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.last_login_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link
                  href={route('admin.transactions', { user_id: user.id })}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crypto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.transactions && user.transactions.length > 0 ? (
                      user.transactions.slice(0, 5).map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'deposit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.cryptocurrency?.symbol || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(transaction.amount)}
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
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Net Balance</span>
                  <span className="text-sm font-semibold text-blue-600">
                    ${formatAmount(stats.total_deposits - stats.total_withdrawals)}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Balances */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Wallet Balances</h2>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage →
                </button>
              </div>
              <div className="p-6 space-y-3">
                {user.wallets && user.wallets.length > 0 ? (
                  user.wallets.map((wallet) => (
                    <div key={wallet.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {wallet.cryptocurrency.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{wallet.cryptocurrency.symbol}</p>
                          <p className="text-xs text-gray-500">{wallet.cryptocurrency.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {parseFloat(wallet.balance).toFixed(8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ≈ ${formatAmount(parseFloat(wallet.balance) * (wallet.cryptocurrency.current_price || 0))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-sm text-gray-500">No wallets yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href={route('admin.transactions', { user_id: user.id })}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">View Transactions</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                {user.kyc_status !== 'not_submitted' && (
                  <Link
                    href={route('admin.kyc')}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">View All KYC Submissions</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">Credit/Debit Wallet</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Change Modal */}
        <ConfirmationModal
          isOpen={showStatusModal}
          onClose={() => !processing && setShowStatusModal(false)}
          onConfirm={handleStatusUpdate}
          title="Change User Status"
          message={`Select a new status for ${user.name}`}
          confirmText="Update Status"
          type="warning"
          loading={processing}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={processing}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Enter reason for status change..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={processing}
              />
            </div>
          </div>
        </ConfirmationModal>

        {/* Password Reset Modal */}
        <ConfirmationModal
          isOpen={showPasswordModal}
          onClose={() => {
            if (!processing) {
              setShowPasswordModal(false);
              setNewPassword('');
              setPasswordConfirmation('');
              setPasswordError('');
            }
          }}
          onConfirm={handlePasswordReset}
          title="Reset User Password"
          message={`Set a new password for ${user.name}`}
          confirmText="Reset Password"
          type="warning"
          loading={processing}
        >
          <div className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                disabled={processing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                disabled={processing}
              />
            </div>
          </div>
        </ConfirmationModal>

        {/* Admin Toggle Modal */}
        <ConfirmationModal
          isOpen={showAdminModal}
          onClose={() => !processing && setShowAdminModal(false)}
          onConfirm={handleToggleAdmin}
          title={user.is_admin ? 'Revoke Admin Privileges' : 'Grant Admin Privileges'}
          message={`Are you sure you want to ${user.is_admin ? 'revoke admin privileges from' : 'grant admin privileges to'} ${user.name}?`}
          confirmText={user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
          type={user.is_admin ? 'danger' : 'success'}
          loading={processing}
        />

        {/* Delete User Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => !processing && setShowDeleteModal(false)}
          onConfirm={handleDeleteUser}
          title="Delete User Account"
          message={`Are you sure you want to permanently delete ${user.name}'s account? This action cannot be undone and will remove all associated data including wallets, transactions, and activity logs.`}
          confirmText="Delete User"
          type="danger"
          loading={processing}
        />

        {/* Credit Wallet Modal */}
        <CreditWalletModal
          show={showCreditModal}
          onClose={() => setShowCreditModal(false)}
          user={user}
          cryptocurrencies={cryptocurrencies}
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}