import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SecurityIndex({ auth, twoFactorEnabled = false }) {
    const [showQRCode, setShowQRCode] = useState(false);
    const [backupCodes, setBackupCodes] = useState([]);
    
    const { data, setData, post, processing, errors } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
        two_factor_code: '',
    });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        post(route('password.update'), {
            onSuccess: () => {
                setData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            }
        });
    };

    const enableTwoFactor = () => {
        post(route('two-factor.enable'), {
            onSuccess: (response) => {
                setShowQRCode(true);
                if (response.props.backupCodes) {
                    setBackupCodes(response.props.backupCodes);
                }
            }
        });
    };

    const disableTwoFactor = () => {
        post(route('two-factor.disable'), {
            onSuccess: () => {
                setShowQRCode(false);
                setBackupCodes([]);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Security Settings
                </h2>
            }
        >
            <Head title="Security Settings" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Account Security Overview */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <div className="text-green-600 text-2xl mr-3">✅</div>
                                        <div>
                                            <div className="font-medium text-green-900">Email Verified</div>
                                            <div className="text-sm text-green-600">
                                                {auth.user.email_verified_at ? 'Verified' : 'Pending verification'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-lg border ${
                                    twoFactorEnabled 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-yellow-50 border-yellow-200'
                                }`}>
                                    <div className="flex items-center">
                                        <div className={`text-2xl mr-3 ${
                                            twoFactorEnabled ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {twoFactorEnabled ? '🔐' : '⚠️'}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${
                                                twoFactorEnabled ? 'text-green-900' : 'text-yellow-900'
                                            }`}>
                                                Two-Factor Auth
                                            </div>
                                            <div className={`text-sm ${
                                                twoFactorEnabled ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="text-blue-600 text-2xl mr-3">🔒</div>
                                        <div>
                                            <div className="font-medium text-blue-900">Password</div>
                                            <div className="text-sm text-blue-600">
                                                Last changed: {auth.user.password_changed_at || 'Never'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.current_password && (
                                        <div className="text-red-600 text-sm mt-1">{errors.current_password}</div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.password && (
                                        <div className="text-red-600 text-sm mt-1">{errors.password}</div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                            
                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    Add an extra layer of security to your account by enabling two-factor authentication. 
                                    You'll need to enter a code from your authenticator app each time you sign in.
                                </p>
                                
                                {!twoFactorEnabled ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={enableTwoFactor}
                                            disabled={processing}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Enabling...' : 'Enable Two-Factor Authentication'}
                                        </button>
                                        
                                        {showQRCode && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-900 mb-2">Setup Instructions:</h4>
                                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                                    <li>Install an authenticator app like Google Authenticator or Authy</li>
                                                    <li>Scan the QR code below with your authenticator app</li>
                                                    <li>Enter the 6-digit code from your app to verify setup</li>
                                                </ol>
                                                
                                                <div className="mt-4 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
                                                    <div className="text-6xl mb-2">📱</div>
                                                    <div className="text-sm text-gray-500">QR Code would appear here</div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Manual entry key: JBSWY3DPEHPK3PXP
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Verification Code
                                                    </label>
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            value={data.two_factor_code}
                                                            onChange={(e) => setData('two_factor_code', e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                            placeholder="Enter 6-digit code"
                                                            maxLength="6"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
                                                        >
                                                            Verify
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex items-center">
                                                <div className="text-green-600 text-xl mr-2">✅</div>
                                                <div className="text-green-800">
                                                    Two-factor authentication is enabled and protecting your account.
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={disableTwoFactor}
                                            disabled={processing}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                                        </button>
                                    </div>
                                )}
                                
                                {backupCodes.length > 0 && (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <h4 className="font-medium text-yellow-900 mb-2">Backup Codes</h4>
                                        <p className="text-sm text-yellow-700 mb-3">
 
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)