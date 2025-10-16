import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Shield, Monitor, Smartphone, Laptop, Clock, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function SecurityIndex({
    twoFactorEnabled,
    lastLoginAt,
    lastLoginIp,
    activeSessions,
    loginHistory,
    failedAttempts
}) {
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [backupCodes, setBackupCodes] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const logoutForm = useForm({
        password: '',
    });

    const handleEnable2FA = () => {
        setShow2FASetup(true);
    };

    const generateBackupCodes = () => {
        const codes = Array.from({ length: 8 }, () =>
            Math.random().toString(36).substring(2, 10).toUpperCase()
        );
        setBackupCodes(codes);
        setShowBackupCodes(true);
    };

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        alert('Backup codes copied to clipboard!');
    };

    const revokeSession = (sessionId) => {
        if (confirm('Are you sure you want to revoke this session?')) {
            router.post(route('security.revoke-session', sessionId), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleLogoutOthers = (e) => {
        e.preventDefault();
        logoutForm.post(route('security.logout-others'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowLogoutModal(false);
                logoutForm.reset();
            },
        });
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone className="w-6 h-6" />;
            case 'tablet':
                return <Smartphone className="w-6 h-6" />;
            default:
                return <Monitor className="w-6 h-6" />;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <DashboardLayout>
            <Head title="Security Settings" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your account security and monitor login activity
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Account Overview */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Last Login</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
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
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
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

                                {!twoFactorEnabled && !show2FASetup && (
                                    <button
                                        onClick={handleEnable2FA}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Enable Two-Factor Authentication
                                    </button>
                                )}

                                {show2FASetup && !showBackupCodes && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800 mb-3">
                                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                                        </p>
                                        <div className="bg-white p-4 inline-block rounded-lg mb-3">
                                            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                                [QR Code Placeholder]
                                            </div>
                                        </div>
                                        <div className="space-x-3">
                                            <button
                                                onClick={generateBackupCodes}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Verify & Continue
                                            </button>
                                            <button
                                                onClick={() => setShow2FASetup(false)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showBackupCodes && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-900 mb-2">Backup Codes</h4>
                                        <p className="text-sm text-yellow-800 mb-3">
                                            Save these backup codes in a safe place.
                                            Each code can be used once if you lose access to your authenticator app.
                                        </p>
                                        <div className="bg-white p-4 rounded-md border border-yellow-300 mb-3">
                                            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                                {backupCodes.map((code, index) => (
                                                    <div key={index} className="text-gray-700">
                                                        {code}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={copyBackupCodes}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                        >
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Sessions */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                                <p className="text-gray-600 mb-4">
                                    Manage and log out of your active sessions on other browsers and devices.
                                </p>

                                <div className="space-y-3">
                                    {activeSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg ${session.is_current
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={session.is_current ? 'text-green-600' : 'text-gray-600'}>
                                                    {getDeviceIcon(session.device_type)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {session.is_current ? 'Current Device' : session.platform}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {session.browser} • {session.ip_address} • Last active: {formatTimestamp(session.last_activity)}
                                                    </div>
                                                </div>
                                            </div>
                                            {session.is_current ? (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                    Active
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => revokeSession(session.id)}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {activeSessions.length > 1 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                        >
                                            Log Out All Other Sessions
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Login History */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>

                                <div className="space-y-3">
                                    {loginHistory.map((login, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full ${login.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {login.type === 'success' ? 'Successful login' : 'Failed login attempt'}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {login.browser} on {login.device_type} • {login.ip_address}
                                                        {login.location && ` • ${login.location}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatTimestamp(login.timestamp)}
                                            </div>
                                        </div>
                                    ))}

                                    {failedAttempts.length > 0 && (
                                        <>
                                            <div className="pt-3">
                                                <h4 className="text-md font-medium text-red-700 mb-3 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                    Recent Failed Login Attempts
                                                </h4>
                                            </div>
                                            {failedAttempts.map((attempt, index) => (
                                                <div key={`failed-${index}`} className="flex items-center justify-between py-3 border-b border-gray-200 bg-red-50">
                                                    <div className="flex items-center space-x-3">
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <div>
                                                            <div className="text-sm font-medium text-red-900">
                                                                Failed login attempt
                                                            </div>
                                                            <div className="text-sm text-red-700">
                                                                {attempt.browser} on {attempt.device_type} • {attempt.ip_address}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-red-600">
                                                        {formatTimestamp(attempt.timestamp)}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Security Recommendations
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Use a strong, unique password that you don't use on other websites</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Enable two-factor authentication for an additional layer of security</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Regularly review your login activity and active sessions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Never share your password or 2FA codes with anyone</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Log out from devices you no longer use</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Other Sessions Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Password</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please enter your password to log out from all other sessions.
                        </p>
                        <form onSubmit={handleLogoutOthers}>
                            <input
                                type="password"
                                value={logoutForm.data.password}
                                onChange={(e) => logoutForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your password"
                                required
                            />
                            {logoutForm.errors.password && (
                                <div className="text-red-600 text-sm mt-1">{logoutForm.errors.password}</div>
                            )}
                            <div className="mt-4 flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={logoutForm.processing}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    {logoutForm.processing ? 'Logging out...' : 'Confirm'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}