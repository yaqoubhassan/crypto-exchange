import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Bell, Palette, Check } from 'lucide-react';

export default function AdminSettingsIndex({ settings }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [successMessage, setSuccessMessage] = useState('');

  // Notification form
  const notificationForm = useForm({
    email_notifications_enabled: settings.email_notifications_enabled,
    email_trading_alerts: settings.email_trading_alerts,
    email_wallet_transactions: settings.email_wallet_transactions,
    email_security_alerts: settings.email_security_alerts,
    email_marketing: settings.email_marketing,
    browser_notifications_enabled: settings.browser_notifications_enabled,
    browser_trading_alerts: settings.browser_trading_alerts,
    browser_wallet_transactions: settings.browser_wallet_transactions,
  });

  // Display form
  const displayForm = useForm({
    theme: settings.theme,
    language: settings.language,
    timezone: settings.timezone,
    currency_display: settings.currency_display,
  });

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    notificationForm.post(route('admin.settings.notifications'), {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Notification preferences updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  const handleDisplaySubmit = (e) => {
    e.preventDefault();
    displayForm.post(route('admin.settings.display'), {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Display preferences updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'display', label: 'Display', icon: Palette },
  ];

  return (
    <AdminLayout>
      <Head title="Admin Settings" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your admin account preferences and notification settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                {/* Email Notifications Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive notifications via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationForm.data.email_notifications_enabled}
                        onChange={(e) =>
                          notificationForm.setData('email_notifications_enabled', e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {notificationForm.data.email_notifications_enabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.email_trading_alerts}
                          onChange={(e) =>
                            notificationForm.setData('email_trading_alerts', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Trading alerts and updates</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.email_wallet_transactions}
                          onChange={(e) =>
                            notificationForm.setData('email_wallet_transactions', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Wallet transactions</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.email_security_alerts}
                          onChange={(e) =>
                            notificationForm.setData('email_security_alerts', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Security alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.email_marketing}
                          onChange={(e) =>
                            notificationForm.setData('email_marketing', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Marketing and promotions</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Browser Notifications Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Browser Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive real-time notifications in your browser
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationForm.data.browser_notifications_enabled}
                        onChange={(e) =>
                          notificationForm.setData('browser_notifications_enabled', e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {notificationForm.data.browser_notifications_enabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.browser_trading_alerts}
                          onChange={(e) =>
                            notificationForm.setData('browser_trading_alerts', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Trading alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={notificationForm.data.browser_wallet_transactions}
                          onChange={(e) =>
                            notificationForm.setData('browser_wallet_transactions', e.target.checked)
                          }
                        />
                        <span className="ml-3 text-sm text-gray-700">Wallet transactions</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={notificationForm.processing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {notificationForm.processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <form onSubmit={handleDisplaySubmit}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Display Preferences
                </h2>

                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={displayForm.data.theme}
                      onChange={(e) => displayForm.setData('theme', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={displayForm.data.language}
                      onChange={(e) => displayForm.setData('language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={displayForm.data.timezone}
                      onChange={(e) => displayForm.setData('timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  {/* Currency Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency Display
                    </label>
                    <select
                      value={displayForm.data.currency_display}
                      onChange={(e) => displayForm.setData('currency_display', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={displayForm.processing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {displayForm.processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}