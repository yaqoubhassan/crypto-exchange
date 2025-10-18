import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Calendar,
  BarChart3,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import Toast from '@/Components/Trading/Toast';
import ConfirmationModal from '@/Components/Admin/ConfirmationModal';

export default function ReportsIndex({ tradingVolume, revenueData, userActivity, filters = {} }) {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState(filters.range || '30days');
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const { flash } = usePage().props;

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Show toast for flash messages
  useEffect(() => {
    if (flash?.success) {
      setToast({
        message: flash.success,
        type: 'success'
      });
    } else if (flash?.error) {
      setToast({
        message: flash.error,
        type: 'error'
      });
    }
  }, [flash]);

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3, color: 'indigo' },
    { id: 'revenue', name: 'Revenue', icon: DollarSign, color: 'green' },
    { id: 'trading', name: 'Trading Volume', icon: TrendingUp, color: 'blue' },
    { id: 'users', name: 'User Activity', icon: Users, color: 'purple' },
    { id: 'transactions', name: 'Transactions', icon: Activity, color: 'orange' },
  ];

  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: '📄' },
    { value: 'pdf', label: 'PDF', icon: '📑' },
    { value: 'excel', label: 'Excel', icon: '📊' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare revenue chart data
  const revenueChartData = revenueData?.map(item => ({
    date: formatDate(item.date),
    revenue: parseFloat(item.revenue || 0),
    transactions: parseInt(item.transaction_count || 0),
  })).reverse() || [];

  // Prepare trading volume data for pie chart
  const tradingVolumeData = tradingVolume?.map((item, index) => ({
    name: `${item.base_symbol}/${item.quote_symbol}`,
    value: parseFloat(item.total_volume || 0),
    fill: COLORS[index % COLORS.length],
  })) || [];

  // Calculate summary statistics
  const totalRevenue = revenueChartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = revenueChartData.reduce((sum, item) => sum + item.transactions, 0);
  const avgDailyRevenue = revenueChartData.length > 0 ? totalRevenue / revenueChartData.length : 0;
  const totalTradingVolume = tradingVolumeData.reduce((sum, item) => sum + item.value, 0);

  const handleDateRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setDateRange(value);
      // Reload data with new date range
      router.get(route('admin.reports'), { range: value }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  const handleCustomDateSubmit = () => {
    if (!customStartDate || !customEndDate) {
      setToast({
        message: 'Please select both start and end dates',
        type: 'error'
      });
      return;
    }

    if (new Date(customStartDate) > new Date(customEndDate)) {
      setToast({
        message: 'Start date must be before end date',
        type: 'error'
      });
      return;
    }

    setDateRange('custom');
    setShowCustomDateModal(false);

    // Reload data with custom date range
    router.get(route('admin.reports'), {
      range: 'custom',
      start_date: customStartDate,
      end_date: customEndDate
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setToast({
          message: 'Custom date range applied successfully',
          type: 'success'
        });
      }
    });
  };

  const handleExport = () => {
    setExporting(true);
    setShowExportModal(false);

    // Create a form and submit it to trigger file download
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = route('admin.reports.export');
    form.style.display = 'none';

    // Add CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = '_token';
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }

    // Add form data
    const fields = {
      type: selectedReport,
      format: exportFormat,
      range: dateRange,
      start_date: customStartDate || '',
      end_date: customEndDate || '',
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    // Submit form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show success message after a short delay
    setTimeout(() => {
      setExporting(false);
      setToast({
        message: `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report is being downloaded as ${exportFormat.toUpperCase()}`,
        type: 'success'
      });
    }, 500);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color === 'indigo' ? 'bg-indigo-50' : color === 'green' ? 'bg-green-50' : color === 'blue' ? 'bg-blue-50' : color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'}`}>
          <Icon className={`w-6 h-6 ${color === 'indigo' ? 'text-indigo-600' : color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.percentage)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs previous period</span>
        </div>
      )}
    </div>
  );

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="green"
          subtitle={`${revenueChartData.length} days`}
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon={Activity}
          color="blue"
          subtitle="All completed"
        />
        <StatCard
          title="Trading Volume"
          value={formatCurrency(totalTradingVolume)}
          icon={TrendingUp}
          color="purple"
          subtitle="Total value"
        />
        <StatCard
          title="Avg Daily Revenue"
          value={formatCurrency(avgDailyRevenue)}
          icon={BarChart3}
          color="orange"
          subtitle="Per day"
        />
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueChartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [formatCurrency(value), 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trading Volume Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Trading Volume by Pair</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={tradingVolumeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {tradingVolumeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {tradingVolumeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-gray-600">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="green"
          subtitle="Selected period"
        />
        <StatCard
          title="Average Daily"
          value={formatCurrency(avgDailyRevenue)}
          icon={TrendingUp}
          color="blue"
          subtitle="Per day"
        />
        <StatCard
          title="Transaction Fees"
          value={formatCurrency(totalRevenue)}
          icon={Activity}
          color="purple"
          subtitle="All sources"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Revenue & Transactions</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="transactions" fill="#6366f1" name="Transactions" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderUserActivityReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="New Registrations"
          value={userActivity?.new_registrations || 0}
          icon={Users}
          color="blue"
          subtitle="Selected period"
        />
        <StatCard
          title="Active Traders"
          value={userActivity?.active_traders || 0}
          icon={TrendingUp}
          color="purple"
          subtitle="Placed orders"
        />
        <StatCard
          title="KYC Completed"
          value={userActivity?.kyc_completed || 0}
          icon={Activity}
          color="green"
          subtitle="Verified users"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">Registration Rate</p>
              <p className="text-xs text-blue-600 mt-1">New users joining platform</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {((userActivity?.new_registrations || 0) / Math.max(revenueChartData.length, 1)).toFixed(1)}/day
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-purple-900">Trader Conversion</p>
              <p className="text-xs text-purple-600 mt-1">Users who placed orders</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {userActivity?.new_registrations > 0
                ? ((userActivity?.active_traders / userActivity?.new_registrations) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-900">KYC Completion Rate</p>
              <p className="text-xs text-green-600 mt-1">Verified accounts</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {userActivity?.new_registrations > 0
                ? ((userActivity?.kyc_completed / userActivity?.new_registrations) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTradingReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Volume"
          value={formatCurrency(totalTradingVolume)}
          icon={TrendingUp}
          color="blue"
          subtitle="All trading pairs"
        />
        <StatCard
          title="Trading Pairs"
          value={tradingVolumeData.length}
          icon={Activity}
          color="purple"
          subtitle="Active pairs"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Volume by Trading Pair</h3>
        <div className="space-y-3">
          {tradingVolumeData.map((item, index) => {
            const percentage = (item.value / totalTradingVolume) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-600">{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.fill
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total volume</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTransactionsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon={Activity}
          color="blue"
          subtitle="Selected period"
        />
        <StatCard
          title="Avg per Day"
          value={Math.round(totalTransactions / Math.max(revenueChartData.length, 1)).toLocaleString()}
          icon={BarChart3}
          color="green"
          subtitle="Daily average"
        />
        <StatCard
          title="Success Rate"
          value="98.5%"
          icon={TrendingUp}
          color="purple"
          subtitle="Completed"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction Volume Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <Head title="Reports - Admin" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              View comprehensive platform statistics and generate reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {reportTypes.map(report => {
            const Icon = report.icon;
            const isActive = selectedReport === report.id;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${isActive
                  ? report.color === 'indigo'
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : report.color === 'green'
                      ? 'border-green-600 text-green-600 bg-green-50'
                      : report.color === 'blue'
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : report.color === 'purple'
                          ? 'border-purple-600 text-purple-600 bg-purple-50'
                          : 'border-orange-600 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {report.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'overview' && renderOverviewReport()}
        {selectedReport === 'revenue' && renderRevenueReport()}
        {selectedReport === 'users' && renderUserActivityReport()}
        {selectedReport === 'trading' && renderTradingReport()}
        {selectedReport === 'transactions' && renderTransactionsReport()}
      </div>

      {/* Custom Date Range Modal */}
      <ConfirmationModal
        isOpen={showCustomDateModal}
        onClose={() => setShowCustomDateModal(false)}
        onConfirm={handleCustomDateSubmit}
        title="Select Custom Date Range"
        confirmText="Apply"
        cancelText="Cancel"
        type="info"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </ConfirmationModal>

      {/* Export Modal */}
      <ConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExport}
        title="Export Report"
        confirmText="Export"
        cancelText="Cancel"
        type="success"
        loading={exporting}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Exporting <span className="font-semibold">{selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}</span> report for the selected date range.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {exportFormats.map(format => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${exportFormat === format.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="text-2xl mb-2">{format.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{format.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ConfirmationModal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}