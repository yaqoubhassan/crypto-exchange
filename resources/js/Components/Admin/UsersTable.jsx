import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function UsersTable({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [processing, setProcessing] = useState(null);

    const handleToggleStatus = async (userId) => {
        if (processing) return;
        
        setProcessing(userId);
        
        try {
            const response = await fetch(route('admin.users.toggle-status', userId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            if (response.ok) {
                router.reload({ only: ['recentUsers'] });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setProcessing(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && user.is_active) ||
                            (statusFilter === 'inactive' && !user.is_active);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Management</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                        />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.is_admin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.two_factor_enabled ? '✅' : '❌'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            disabled={processing === user.id}
                                            className={`${
                                                user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                            } disabled:opacity-50`}
                                        >
                                            {user.is_active ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">Role:</span>
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {user.is_admin ? 'Admin' : 'User'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">2FA:</span>
                                <span className="ml-2">{user.two_factor_enabled ? '✅ Enabled' : '❌ Disabled'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Joined:</span>
                                <span className="ml-2 text-gray-900 text-xs">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Last Login:</span>
                                <span className="ml-2 text-gray-900 text-xs">
                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                            <button
                                onClick={() => handleToggleStatus(user.id)}
                                disabled={processing === user.id}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                                    user.is_active 
                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {user.is_active ? 'Suspend' : 'Activate'}
                            </button>
                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <div className="text-3xl sm:text-4xl mb-2">👥</div>
                    <div className="text-sm sm:text-base">No users found</div>
                </div>
            )}
        </div>
    );
}