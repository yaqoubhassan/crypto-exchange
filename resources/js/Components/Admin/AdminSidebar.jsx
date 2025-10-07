import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'overview', name: 'Overview', icon: '📊', route: 'admin.dashboard' },
        { id: 'transactions', name: 'Transactions', icon: '💳', route: 'admin.transactions' },
        { id: 'users', name: 'Users', icon: '👥', route: 'admin.users' },
        { id: 'orders', name: 'Orders', icon: '📋', route: 'admin.orders' },
        { id: 'kyc', name: 'KYC Verification', icon: '🔍', route: 'admin.kyc' },
        { id: 'cryptocurrencies', name: 'Cryptocurrencies', icon: '💰', route: 'admin.cryptocurrencies' },
        { id: 'reports', name: 'Reports', icon: '📈', route: 'admin.reports' },
        { id: 'settings', name: 'Settings', icon: '⚙️', route: 'admin.settings' }
    ];

    return (
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen overflow-hidden">
            <div className="p-6 flex-shrink-0">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                        <p className="text-xs text-gray-500">CryptoExchange</p>
                    </div>
                </div>
            </div>

            <nav className="space-y-1 px-3 flex-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="p-3 border-t border-gray-200 flex-shrink-0">
                <Link
                    href={route('dashboard')}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <span className="text-xl">🏠</span>
                    <span className="text-sm">Back to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}