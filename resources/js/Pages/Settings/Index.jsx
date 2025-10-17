import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Bell, Mail, Globe, Monitor, Palette, Check, X } from 'lucide-react';

export default function SettingsIndex({ settings }) {
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
    notificationForm.post(route('settings.notifications'), {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Notification preferences updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  const handleDisplaySubmit = (e) => {
    e.preventDefault();
    displayForm.post(route('settings.display'), {
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
    <DashboardLayout>
      <Head title="Settings" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account preferences and notification settings
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
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how you want to receive notifications
                </p>
              </div>

              <form onSubmit={handleNotificationSubmit} className="p-6 space-y-8">
                {/* Email Notifications Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Email Notifications
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.data.email_notifications_enabled}
                        onChange={(e) =>
                          notificationForm.setData('email_notifications_enabled', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="space-y-4 pl-7">
                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Trading Alerts</span>
                        <p className="text-xs text-gray-500">Notifications about order fills and price alerts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.email_trading_alerts}
                        onChange={(e) =>
                          notificationForm.setData('email_trading_alerts', e.target.checked)
                        }
                        disabled={!notificationForm.data.email_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>

                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Wallet Transactions</span>
                        <p className="text-xs text-gray-500">Deposits, withdrawals, and transfers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.email_wallet_transactions}
                        onChange={(e) =>
                          notificationForm.setData('email_wallet_transactions', e.target.checked)
                        }
                        disabled={!notificationForm.data.email_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>

                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Security Alerts</span>
                        <p className="text-xs text-gray-500">Login attempts, password changes, and security updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.email_security_alerts}
                        onChange={(e) =>
                          notificationForm.setData('email_security_alerts', e.target.checked)
                        }
                        disabled={!notificationForm.data.email_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>

                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Marketing & Updates</span>
                        <p className="text-xs text-gray-500">Product updates, promotions, and newsletters</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.email_marketing}
                        onChange={(e) =>
                          notificationForm.setData('email_marketing', e.target.checked)
                        }
                        disabled={!notificationForm.data.email_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>

                {/* Browser Notifications Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Monitor className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Browser Notifications
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationForm.data.browser_notifications_enabled}
                        onChange={(e) =>
                          notificationForm.setData('browser_notifications_enabled', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="space-y-4 pl-7">
                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Trading Alerts</span>
                        <p className="text-xs text-gray-500">Real-time notifications for trades</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.browser_trading_alerts}
                        onChange={(e) =>
                          notificationForm.setData('browser_trading_alerts', e.target.checked)
                        }
                        disabled={!notificationForm.data.browser_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>

                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Wallet Transactions</span>
                        <p className="text-xs text-gray-500">Instant updates on wallet activity</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationForm.data.browser_wallet_transactions}
                        onChange={(e) =>
                          notificationForm.setData('browser_wallet_transactions', e.target.checked)
                        }
                        disabled={!notificationForm.data.browser_notifications_enabled}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={notificationForm.processing}
                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {notificationForm.processing ? 'Saving...' : 'Save Notification Preferences'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-indigo-600" />
                  Display Preferences
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Customize how you view the application
                </p>
              </div>

              <form onSubmit={handleDisplaySubmit} className="p-6 space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={displayForm.data.theme}
                    onChange={(e) => displayForm.setData('theme', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Choose your preferred color scheme</p>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={displayForm.data.language}
                    onChange={(e) => displayForm.setData('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select your preferred language</p>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={displayForm.data.timezone}
                    onChange={(e) => displayForm.setData('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Times will be displayed in this timezone</p>
                </div>

                {/* Currency Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Display
                  </label>
                  <select
                    value={displayForm.data.currency_display}
                    onChange={(e) => displayForm.setData('currency_display', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Default currency for displaying values</p>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={displayForm.processing}
                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {displayForm.processing ? 'Saving...' : 'Save Display Preferences'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}