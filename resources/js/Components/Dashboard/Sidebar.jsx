import React from 'react';
import { Link } from '@inertiajs/react';

export default function Sidebar({ currentRoute }) {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      active: currentRoute === 'dashboard'
    },
    {
      name: 'Trading',
      href: '/trading',
      icon: '💹',
      active: currentRoute === 'trading.index'
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: '💰',
      active: currentRoute === 'wallet.index'
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: '💳',
      active: currentRoute === 'transactions.index'
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: '📋',
      active: currentRoute === 'orders.index'
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 hidden lg:block">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${item.active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="text-2xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Support Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="px-3 space-y-2">
            <Link
              href="/help"
              className="flex items-center p-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="mr-2">❓</span>
              Help Center
            </Link>
            <Link
              href="/support"
              className="flex items-center p-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="mr-2">💬</span>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}