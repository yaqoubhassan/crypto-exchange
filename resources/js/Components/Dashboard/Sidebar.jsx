import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const { url } = usePage();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
    },
    {
      name: 'Trading',
      href: '/trading',
      icon: '💹',
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: '💰',
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: '💳',
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: '📋',
    },
  ];

  const supportItems = [
    {
      name: 'Help Center',
      href: '/help',
      icon: '❓',
    },
    {
      name: 'Contact Support',
      href: '/support',
      icon: '💬',
    },
  ];

  const isActive = (itemHref) => {
    return url.startsWith(itemHref);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white shadow-lg border-r border-gray-200 
          flex flex-col h-screen overflow-hidden
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className={`p-6 flex-shrink-0 ${isCollapsed ? 'lg:p-4' : ''}`}>
          <div className={`flex items-center mb-8 ${isCollapsed ? 'lg:justify-center lg:mb-4' : 'justify-between'}`}>
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">CryptoEx</h2>
                <p className="text-xs text-gray-500">Trading Platform</p>
              </div>
            </div>

            {/* Collapsed state - show only icon */}
            <div
              className={`hidden ${isCollapsed ? 'lg:flex' : 'lg:hidden'} w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg items-center justify-center`}
            >
              <span className="text-white font-bold text-lg">C</span>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`space-y-1 flex-1 overflow-y-auto ${isCollapsed ? 'lg:px-2' : 'px-3'}`}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive(item.href)
                ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'lg:justify-center lg:px-2' : 'space-x-3'}`}
              title={isCollapsed ? item.name : ''}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span
                className={`text-sm transition-all ${isCollapsed ? 'lg:hidden lg:w-0 lg:opacity-0' : 'block'
                  }`}
              >
                {item.name}
              </span>

              {/* Tooltip for collapsed state */}
              <div
                className={`hidden absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-50 ${isCollapsed ? 'lg:group-hover:block lg:group-hover:opacity-100' : ''
                  }`}
              >
                {item.name}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            </Link>
          ))}

          {/* Support Section */}
          <div className={`pt-6 border-t border-gray-200 mt-6 ${isCollapsed ? 'lg:px-0' : ''}`}>
            {supportItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive(item.href)
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'lg:justify-center lg:px-2' : 'space-x-3'}`}
                title={isCollapsed ? item.name : ''}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span
                  className={`text-sm transition-all ${isCollapsed ? 'lg:hidden lg:w-0 lg:opacity-0' : 'block'
                    }`}
                >
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                <div
                  className={`hidden absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-50 ${isCollapsed ? 'lg:group-hover:block lg:group-hover:opacity-100' : ''
                    }`}
                >
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}