import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
    Shield, Lock, Activity, Monitor, AlertTriangle,
    Clock, MapPin, Eye, EyeOff, Key, Smartphone,
    LogOut, X, Check, Copy, Download
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function SecurityIndex({
    twoFactorEnabled,
    lastLoginAt,
    lastLoginIp,
    activeSessions,
    loginHistory,
    failedAttempts,
    recentActivity,
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
    const [copiedSecret, setCopiedSecret] = useState(false);

    // Show 2FA modal automatically when QR code is available
    React.useEffect(() => {
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
        passwordForm.patch(route('security.password.update'), {
            onSuccess: () => {
                passwordForm.reset();
                setShowPasswordModal(false);
            },
        });
    };

    const handleEnable2FA = () => {
        router.post(route('security.two-factor.enable'), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
            },
            onError: (errors) => {
                console.error('2FA Enable Error:', errors);
            },
        });
    };

    const handleVerify2FA = (e) => {
        e.preventDefault();
        verifyForm.post(route('security.two-factor.verify'), {
            onSuccess: () => {
                verifyForm.reset();
                setShow2FASetup(false);
                setShowBackupCodes(false);
            },
        });
    };

    const handleDisable2FA = (e) => {
        e.preventDefault();
        disableForm.post(route('security.two-factor.disable'), {
            onSuccess: () => {
                disableForm.reset();
                setShow2FADisable(false);
            },
        });
    };

    const handleRevokeSession = (sessionId) => {
        if (confirm('Are you sure you want to revoke this session?')) {
            router.post(route('security.revoke-session', sessionId));
        }
    };

    const handleLogoutOthers = (e) => {
        e.preventDefault();
        logoutForm.post(route('security.logout-others'), {
            onSuccess: () => {
                logoutForm.reset();
                setShowLogoutModal(false);
            },
        });
    };

    const copyToClipboard = (text, type = 'code') => {
        navigator.clipboard.writeText(text);
        if (type === 'secret') {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        } else {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const downloadBackupCodes = () => {
        const text = backupCodes.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup-codes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone className="w-5 h-5" />;
            case 'tablet':
                return <Monitor className="w-5 h-5" />;
            default:
                return <Monitor className="w-5 h-5" />;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Security Settings" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your account security and login settings
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        {flash.error}
                    </div>
                )}

                {/* Last Login Info */}
                {lastLoginAt && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Last login</p>
                                <p className="text-sm text-blue-700">
                                    {new Date(lastLoginAt).toLocaleString()} from {lastLoginIp}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Lock className="w-5 h-5 mr-2" />
                                Password
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Update your password regularly to keep your account secure
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

                {/* Two-Factor Authentication Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
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
                                                {session.is_current ? 'This Device' : `${session.browser} on ${session.platform}`}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {session.ip_address} • {new Date(session.last_activity * 1000).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    {!session.is_current && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                {recentActivity && recentActivity.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                            <Activity className="w-5 h-5 mr-2" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Activity className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                            <p className="text-xs text-gray-600">{new Date(activity.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Failed Login Attempts */}
                {failedAttempts && failedAttempts.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                        <div className="flex items-center mb-6">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Failed Login Attempts</h3>
                        </div>
                        <div className="space-y-3">
                            {failedAttempts.map((attempt, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Failed login from {attempt.ip_address}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(attempt.timestamp * 1000).toLocaleString()} • {attempt.browser} on {attempt.device_type}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Password Update Modal */}
            <Modal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            {passwordForm.errors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            {passwordForm.errors.password && (
                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* 2FA Setup Modal */}
            <Modal show={show2FASetup} onClose={() => {
                setShow2FASetup(false);
                setShowBackupCodes(false);
            }} maxWidth="2xl">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-indigo-600" />
                        Enable Two-Factor Authentication
                    </h2>

                    {!showBackupCodes ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900">
                                    Two-factor authentication adds an extra layer of security to your account by requiring both your password and a verification code from your phone.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Step 1: Scan QR Code</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Use an authenticator app (Google Authenticator, Authy, etc.) to scan this QR code:
                                </p>
                                {qrCode && (
                                    <div className="flex justify-center bg-white p-4 rounded-lg border border-gray-200">
                                        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Alternative: Manual Entry</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    If you can't scan the QR code, enter this secret key manually:
                                </p>
                                <div className="flex items-center space-x-2">
                                    <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm">
                                        {secret}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(secret, 'secret')}
                                        className="p-2 text-gray-600 hover:text-gray-900"
                                        title="Copy secret"
                                    >
                                        {copiedSecret ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Step 2: Verify Code</h3>
                                <form onSubmit={handleVerify2FA} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Enter the 6-digit code from your authenticator app
                                        </label>
                                        <input
                                            type="text"
                                            value={verifyForm.data.code}
                                            onChange={(e) => verifyForm.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest font-mono"
                                            placeholder="000000"
                                            maxLength="6"
                                            required
                                        />
                                        {verifyForm.errors.code && (
                                            <p className="mt-1 text-sm text-red-600">{verifyForm.errors.code}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShow2FASetup(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowBackupCodes(true)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            Next: Backup Codes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-900">
                                    <strong>Important:</strong> Save these backup codes in a secure location. Each code can be used once if you lose access to your authenticator app.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Your Backup Codes</h3>
                                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {backupCodes?.map((code, index) => (
                                        <div key={index} className="font-mono text-sm bg-white p-2 rounded border border-gray-200 text-center">
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={downloadBackupCodes}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Codes
                                </button>
                                <button
                                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    {copiedCode ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                                    Copy All Codes
                                </button>
                            </div>

                            <form onSubmit={handleVerify2FA} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter verification code to complete setup
                                    </label>
                                    <input
                                        type="text"
                                        value={verifyForm.data.code}
                                        onChange={(e) => verifyForm.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest font-mono"
                                        placeholder="000000"
                                        maxLength="6"
                                        required
                                    />
                                    {verifyForm.errors.code && (
                                        <p className="mt-1 text-sm text-red-600">{verifyForm.errors.code}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowBackupCodes(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={verifyForm.processing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {verifyForm.processing ? 'Verifying...' : 'Complete Setup'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </Modal>

            {/* 2FA Disable Modal */}
            <Modal show={show2FADisable} onClose={() => setShow2FADisable(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                        Disable Two-Factor Authentication
                    </h2>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-900">
                            Disabling two-factor authentication will make your account less secure. Are you sure you want to continue?
                        </p>
                    </div>

                    <form onSubmit={handleDisable2FA} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm your password to disable 2FA
                            </label>
                            <input
                                type="password"
                                value={disableForm.data.password}
                                onChange={(e) => disableForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={disableForm.processing}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {disableForm.processing ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Logout Other Sessions Modal */}
            <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <LogOut className="w-6 h-6 mr-2 text-red-600" />
                        Logout All Other Devices
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        This will log you out of all other devices. You'll remain logged in on this device.
                    </p>

                    <form onSubmit={handleLogoutOthers} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm your password
                            </label>
                            <input
                                type="password"
                                value={logoutForm.data.password}
                                onChange={(e) => logoutForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={logoutForm.processing}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {logoutForm.processing ? 'Logging Out...' : 'Logout All Other Devices'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}