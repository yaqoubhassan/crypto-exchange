import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function UserShow({ auth, user, stats }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Page Header with Back Button */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage user account information
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href={route('admin.users.index')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
                >
                  ← Back to Users
                </Link>
              </div>
            </div>
          </div>
          {/* User Profile Card */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {user.profile_picture ? (
                    <img
                      src={`/storage/${user.profile_picture}`}
                      alt={user.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={user.status} />
                      {user.is_admin && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                      {user.email_verified_at && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-sm text-gray-600">Account Age</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {stats.account_age_days} days
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-sm text-gray-600">Email Status</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {stats.email_verified ? '✓ Verified' : '✗ Unverified'}
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-sm text-gray-600">User Type</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {user.is_admin ? 'Admin' : 'User'}
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-sm text-gray-600">Last Login</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900 mt-1">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900 mt-1">{user.location || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">KYC Status</label>
                  <p className="text-gray-900 mt-1">{user.kyc_status || 'Not started'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Two-Factor Auth</label>
                  <p className="text-gray-900 mt-1">{user.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-900 mt-1">{user.bio || 'No bio provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined</label>
                  <p className="text-gray-900 mt-1">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900 mt-1">{new Date(user.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update User Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter reason for status change..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Toggle Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user.is_admin ? 'Revoke Admin Privileges' : 'Grant Admin Privileges'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {user.is_admin ? 'revoke admin privileges from' : 'grant admin privileges to'} <strong>{user.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleAdmin}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset User Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter new password"
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
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}