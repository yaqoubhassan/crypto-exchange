import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
  Shield, Lock, Activity, Monitor, AlertTriangle,
  Clock, MapPin, Eye, EyeOff, Key, Smartphone,
  LogOut, X, Check, Copy
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';

export default function AdminSecurityIndex({
  twoFactorEnabled,
  lastLoginAt,
  lastLoginIp,
  activeSessions,
  recentActivity,
  failedAttempts,
  qrCode,
  secret,
  backupCodes
}) {
  const { flash } = usePage().props;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [show2FADisable, setShow2FADisable] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // States for revoke confirmation modal
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState(null);
  const [revoking, setRevoking] = useState(false);

  // Show 2FA modal automatically when QR code is available
  useEffect(() => {
    if (qrCode) {
      setShow2FASetup(true);
    }
  }, [qrCode]);

  // Password update form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // 2FA verification form
  const verifyForm = useForm({
    code: '',
  });

  // 2FA disable form
  const disableForm = useForm({
    password: '',
  });

  // Logout other sessions form
  const logoutForm = useForm({
    password: '',
  });

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    passwordForm.patch(route('admin.security.password.update'), {
      onSuccess: () => {
        passwordForm.reset();
        setShowPasswordModal(false);
      },
    });
  };

  const handleEnable2FA = () => {
    router.post(route('admin.security.two-factor.enable'), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        // The modal will open automatically via useEffect when qrCode is available
      },
      onError: (errors) => {
        console.error('2FA Enable Error:', errors);
      },
    });
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    verifyForm.post(route('admin.security.two-factor.verify'), {
      onSuccess: () => {
        verifyForm.reset();
        setShow2FASetup(false);
        setShowBackupCodes(false);
      },
    });
  };

  const handleDisable2FA = (e) => {
    e.preventDefault();
    disableForm.post(route('admin.security.two-factor.disable'), {
      onSuccess: () => {
        disableForm.reset();
        setShow2FADisable(false);
      },
    });
  };

  // — Revoke session handlers (use ConfirmationModal)
  const handleRevokeClick = (sessionId) => {
    setRevokingSessionId(sessionId);
    setShowRevokeModal(true);
  };

  const handleConfirmRevoke = () => {
    if (!revokingSessionId) return;
    setRevoking(true);
    router.post(route('admin.security.revoke-session', revokingSessionId), {}, {
      onSuccess: () => {
        // you may want to refresh or rely on server flash to update UI
      },
      onError: (errors) => {
        console.error('Revoke session error:', errors);
      },
      onFinish: () => {
        setRevoking(false);
        setShowRevokeModal(false);
        setRevokingSessionId(null);
      },
    });
  };

  const handleLogoutOtherSessions = (e) => {
    e.preventDefault();
    logoutForm.post(route('admin.security.logout-others'), {
      onSuccess: () => {
        logoutForm.reset();
        setShowLogoutModal(false);
      },
    });
  };

  const formatTimestamp = (timestamp) => {
    // original code expects timestamp in seconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getDeviceIcon = (deviceType) => {
    if (deviceType === 'Mobile') return '📱';
    if (deviceType === 'Tablet') return '📱';
    return '💻';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getActivityIcon = (action) => {
    const icons = {
      login: { icon: Activity, color: 'bg-green-100 text-green-600' },
      logout: { icon: Activity, color: 'bg-gray-100 text-gray-600' },
      password_changed: { icon: Lock, color: 'bg-purple-100 text-purple-600' },
      two_factor_enabled: { icon: Shield, color: 'bg-blue-100 text-blue-600' },
      two_factor_disabled: { icon: Shield, color: 'bg-red-100 text-red-600' },
      session_revoked: { icon: Monitor, color: 'bg-orange-100 text-orange-600' },
      sessions_cleared: { icon: LogOut, color: 'bg-red-100 text-red-600' },
    };

    return icons[action] || { icon: Activity, color: 'bg-gray-100 text-gray-600' };
  };

  const formatActivityTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <AdminLayout>
      <Head title="Security Settings" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account security and authentication
            </p>
          </div>
          <Shield className="w-12 h-12 text-indigo-600" />
        </div>

        {/* Success/Error Messages */}
        {flash?.success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {flash.error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Last Login</div>
                <div className="text-sm font-medium text-gray-900">
                  {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Last Login IP</div>
                <div className="text-sm font-medium text-gray-900">
                  {lastLoginIp || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Active Sessions</div>
                <div className="text-sm font-medium text-gray-900">
                  {activeSessions?.length || 0} device(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Password
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Keep your account secure with a strong password
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${twoFactorEnabled
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
              }`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {!twoFactorEnabled ? (
            <button
              onClick={handleEnable2FA}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enable Two-Factor Authentication
            </button>
          ) : (
            <button
              onClick={() => setShow2FADisable(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disable Two-Factor Authentication
            </button>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Active Sessions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage devices where you're currently logged in
              </p>
            </div>
            {activeSessions?.length > 1 && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout All Other Devices
              </button>
            )}
          </div>

          <div className="space-y-3">
            {activeSessions?.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border ${session.is_current
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={session.is_current ? 'text-green-600' : 'text-gray-600'}>
                      {getDeviceIcon(session.device_type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.is_current ? 'Current Device' : session.platform}
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.browser} • {session.ip_address}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last active: {formatTimestamp(session.last_activity)}
                      </div>
                    </div>
                  </div>
                  {!session.is_current && (
                    <button
                      onClick={() => handleRevokeClick(session.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Security Activity
          </h3>

          <div className="space-y-3">
            {recentActivity?.map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.action);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatActivityTime(activity.created_at)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      {activity.ip_address && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.ip_address}
                        </span>
                      )}
                      {activity.device && (
                        <span>{getDeviceIcon(activity.device)} {activity.device}</span>
                      )}
                      {activity.browser && (
                        <span>{activity.browser}</span>
                      )}
                      {activity.platform && (
                        <span>{activity.platform}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Failed Login Attempts */}
        {failedAttempts?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Failed Login Attempts
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Recent unsuccessful login attempts to your account
            </p>

            <div className="space-y-2">
              {failedAttempts.map((attempt, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{getDeviceIcon(attempt.device_type)}</span>
                      <span className="text-gray-900">
                        {attempt.browser} on {attempt.platform}
                      </span>
                      <span className="text-gray-500">• {attempt.ip_address}</span>
                    </div>
                    <span className="text-gray-500">
                      {formatTimestamp(attempt.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.data.current_password}
                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {passwordForm.errors.current_password && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.data.password}
                onChange={(e) => passwordForm.setData('password', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {passwordForm.errors.password && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.data.password_confirmation}
                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {passwordForm.errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordForm.processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {passwordForm.processing ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal show={show2FASetup} onClose={() => setShow2FASetup(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enable Two-Factor Authentication</h3>

          {!showBackupCodes ? (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>

              {qrCode && typeof qrCode === 'string' && qrCode.length > 0 && (
                <div className="flex flex-col items-center mb-6">
                  {qrCode.startsWith('data:image') ? (
                    // If it's a base64 image
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-52 h-52 mb-4 bg-white p-4 rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    // If it's SVG
                    <div
                      className="w-52 h-52 mb-4 bg-white p-4 rounded-lg border-2 border-gray-200"
                      dangerouslySetInnerHTML={{ __html: qrCode }}
                    />
                  )}

                  <div className="bg-gray-100 p-3 rounded-lg w-full">
                    <p className="text-xs text-gray-600 mb-1">Or enter this code manually:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{secret}</code>
                      <button
                        onClick={() => copyToClipboard(secret)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(!qrCode || typeof qrCode !== 'string' || qrCode.length === 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">
                    Failed to generate QR code. Please check your server logs or try using the manual code above.
                  </p>
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verifyForm.data.code}
                    onChange={(e) => verifyForm.setData('code', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    required
                  />
                  {verifyForm.errors.code && (
                    <p className="mt-1 text-sm text-red-600">{verifyForm.errors.code}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShow2FASetup(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifyForm.processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {verifyForm.processing ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </form>

              {backupCodes && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowBackupCodes(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View Backup Codes
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm font-medium">
                  Save these backup codes in a safe place!
                </p>
                <p className="text-red-700 text-xs mt-1">
                  You can use these codes to access your account if you lose your authenticator device.
                </p>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes?.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded text-center font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBackupCodes(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Disable 2FA Modal */}
      <Modal show={show2FADisable} onClose={() => setShow2FADisable(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Disable Two-Factor Authentication</h3>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              Disabling two-factor authentication will make your account less secure. Please enter your password to confirm.
            </p>
          </div>

          <form onSubmit={handleDisable2FA} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={disableForm.data.password}
                onChange={(e) => disableForm.setData('password', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {disableForm.errors.password && (
                <p className="mt-1 text-sm text-red-600">{disableForm.errors.password}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShow2FADisable(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disableForm.processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {disableForm.processing ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Logout Other Sessions Modal */}
      <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Logout All Other Devices</h3>

          <p className="text-sm text-gray-600 mb-4">
            Please enter your password to log out from all other sessions. Your current session will remain active.
          </p>

          <form onSubmit={handleLogoutOtherSessions} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={logoutForm.data.password}
                onChange={(e) => logoutForm.setData('password', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {logoutForm.errors.password && (
                <p className="mt-1 text-sm text-red-600">{logoutForm.errors.password}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={logoutForm.processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {logoutForm.processing ? 'Logging out...' : 'Logout Other Devices'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirmation modal for revoking a session */}
      <ConfirmationModal
        isOpen={showRevokeModal}
        onClose={() => !revoking && setShowRevokeModal(false)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Session"
        message="Are you sure you want to revoke this session? This user will be logged out immediately."
        confirmText="Revoke Session"
        type="danger"
        loading={revoking}
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Warning: This action cannot be undone.
              </p>
              <p className="text-xs text-yellow-700">
                Once revoked, the user session will be terminated instantly.
              </p>
            </div>
          </div>
        </div>
      </ConfirmationModal>
    </AdminLayout>
  );
}
