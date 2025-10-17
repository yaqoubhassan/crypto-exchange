import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Trading/Toast';
import {
  Search, Filter, Download, Plus, Edit, Trash2, Eye,
  TrendingUp, TrendingDown, Power, PowerOff, Check, X,
  DollarSign, Activity, Coins, BarChart3, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function CryptocurrenciesIndex({ cryptocurrencies, filters, stats }) {
  const { flash } = usePage().props;
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [cryptoToDelete, setCryptoToDelete] = useState(null);
  const [cryptoToToggle, setCryptoToToggle] = useState(null);
  const [bulkAction, setBulkAction] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  const searchForm = useForm({
    search: filters.search || '',
    status: filters.status || '',
    type: filters.type || '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.cryptocurrencies.index'), searchForm.data, {
      preserveState: true,
    });
  };

  const handleSort = (field) => {
    const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
    router.get(route('admin.cryptocurrencies.index'), {
      ...filters,
      sort: field,
      direction: direction,
    }, {
      preserveState: true,
    });
  };

  const handleToggleStatus = (crypto) => {
    setCryptoToToggle(crypto);
    setShowToggleModal(true);
  };

  const confirmToggleStatus = () => {
    setProcessing(true);
    router.post(route('admin.cryptocurrencies.toggle-status', cryptoToToggle.id), {}, {
      preserveState: true,
      onSuccess: () => {
        setShowToggleModal(false);
        setCryptoToToggle(null);
      },
      onFinish: () => setProcessing(false),
    });
  };

  const handleDelete = (crypto) => {
    setCryptoToDelete(crypto);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProcessing(true);
    router.delete(route('admin.cryptocurrencies.destroy', cryptoToDelete.id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setCryptoToDelete(null);
      },
      onFinish: () => setProcessing(false),
    });
  };

  const handleBulkToggle = (isActive) => {
    if (selectedCryptos.length === 0) return;
    setBulkAction(isActive);
    setShowBulkModal(true);
  };

  const confirmBulkToggle = () => {
    setProcessing(true);
    router.post(route('admin.cryptocurrencies.bulk-toggle'), {
      ids: selectedCryptos,
      is_active: bulkAction,
    }, {
      onSuccess: () => {
        setSelectedCryptos([]);
        setShowBulkActions(false);
        setShowBulkModal(false);
        setBulkAction(null);
      },
      onFinish: () => setProcessing(false),
    });
  };

  const toggleSelectAll = () => {
    if (selectedCryptos.length === cryptocurrencies.data.length) {
      setSelectedCryptos([]);
    } else {
      setSelectedCryptos(cryptocurrencies.data.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedCryptos(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    window.location.href = route('admin.cryptocurrencies.export', filters);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return parseFloat(num).toFixed(2);
  };

  return (
    <AdminLayout>
      <Head title="Cryptocurrencies Management" />

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cryptocurrencies</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all cryptocurrencies and fiat currencies on the platform
            </p>
          </div>
          <Link
            href={route('admin.cryptocurrencies.create')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Cryptocurrency
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cryptocurrencies</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total_cryptocurrencies}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.active_cryptocurrencies} Active</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-600">{stats.inactive_cryptocurrencies} Inactive</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Market Cap</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${formatNumber(stats.total_market_cap)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">24h Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${formatNumber(stats.total_volume_24h)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Currency Types</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.crypto_count + stats.fiat_count}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{stats.crypto_count} Crypto</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-600">{stats.fiat_count} Fiat</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or symbol..."
                    value={searchForm.data.search}
                    onChange={(e) => searchForm.setData('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={searchForm.data.status}
                  onChange={(e) => searchForm.setData('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={searchForm.data.type}
                  onChange={(e) => searchForm.setData('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="fiat">Fiat Currency</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>

              <div className="flex items-center gap-3">
                {(filters.search || filters.status || filters.type) && (
                  <button
                    type="button"
                    onClick={() => {
                      searchForm.reset();
                      router.get(route('admin.cryptocurrencies.index'));
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCryptos.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-indigo-900">
                {selectedCryptos.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkToggle(true)}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors inline-flex items-center"
                >
                  <Power className="w-4 h-4 mr-1" />
                  Activate
                </button>
                <button
                  onClick={() => handleBulkToggle(false)}
                  className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors inline-flex items-center"
                >
                  <PowerOff className="w-4 h-4 mr-1" />
                  Deactivate
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedCryptos([])}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCryptos.length === cryptocurrencies.data.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cryptocurrency
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('current_price')}
                >
                  Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('change_24h')}
                >
                  24h Change
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('market_cap')}
                >
                  Market Cap
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('volume_24h')}
                >
                  24h Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptocurrencies.data.map((crypto) => (
                <tr key={crypto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCryptos.includes(crypto.id)}
                      onChange={() => toggleSelect(crypto.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {crypto.icon ? (
                        <img
                          src={`/storage/${crypto.icon}`}
                          alt={crypto.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                        style={{ display: crypto.icon ? 'none' : 'flex' }}
                      >
                        {crypto.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${parseFloat(crypto.current_price).toFixed(crypto.decimal_places)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {crypto.change_24h !== null ? (
                      <div className={`inline-flex items-center text-sm font-medium ${crypto.change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {crypto.change_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(crypto.change_24h).toFixed(2)}%
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {crypto.market_cap ? `$${formatNumber(crypto.market_cap)}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {crypto.volume_24h ? `$${formatNumber(crypto.volume_24h)}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${crypto.is_fiat
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                      }`}>
                      {crypto.is_fiat ? 'Fiat' : 'Crypto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${crypto.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {crypto.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={route('admin.cryptocurrencies.show', crypto.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={route('admin.cryptocurrencies.edit', crypto.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(crypto)}
                        className={`${crypto.is_active ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        title={crypto.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {crypto.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(crypto)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {cryptocurrencies.links.length > 3 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                {cryptocurrencies.prev_page_url && (
                  <Link
                    href={cryptocurrencies.prev_page_url}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {cryptocurrencies.next_page_url && (
                  <Link
                    href={cryptocurrencies.next_page_url}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{cryptocurrencies.from}</span> to{' '}
                    <span className="font-medium">{cryptocurrencies.to}</span> of{' '}
                    <span className="font-medium">{cryptocurrencies.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {cryptocurrencies.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } ${index === 0 ? 'rounded-l-md' : ''} ${index === cryptocurrencies.links.length - 1 ? 'rounded-r-md' : ''
                          } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {cryptocurrencies.data.length === 0 && (
        <div className="text-center py-12">
          <Coins className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cryptocurrencies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.status || filters.type
              ? 'Try adjusting your filters'
              : 'Get started by adding a new cryptocurrency'}
          </p>
          {!filters.search && !filters.status && !filters.type && (
            <div className="mt-6">
              <Link
                href={route('admin.cryptocurrencies.create')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Cryptocurrency
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => !processing && setShowDeleteModal(false)} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Cryptocurrency</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{cryptoToDelete?.name}</strong>?
            This cryptocurrency will be permanently removed from the system.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
            >
              {processing ? 'Deleting...' : 'Delete Cryptocurrency'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toggle Status Modal */}
      <Modal show={showToggleModal} onClose={() => !processing && setShowToggleModal(false)} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cryptoToToggle?.is_active ? 'bg-gray-100' : 'bg-green-100'
              }`}>
              {cryptoToToggle?.is_active ? (
                <PowerOff className="w-6 h-6 text-gray-600" />
              ) : (
                <Power className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {cryptoToToggle?.is_active ? 'Deactivate' : 'Activate'} Cryptocurrency
              </h3>
              <p className="text-sm text-gray-600">Confirm status change</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to {cryptoToToggle?.is_active ? 'deactivate' : 'activate'}{' '}
            <strong>{cryptoToToggle?.name}</strong>?
            {cryptoToToggle?.is_active && (
              <span className="block mt-2 text-sm text-gray-500">
                This will disable all trading and transactions for this cryptocurrency.
              </span>
            )}
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowToggleModal(false)}
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleStatus}
              disabled={processing}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition disabled:opacity-50 ${cryptoToToggle?.is_active
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {processing ? 'Processing...' : (cryptoToToggle?.is_active ? 'Deactivate' : 'Activate')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal show={showBulkModal} onClose={() => !processing && setShowBulkModal(false)} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bulkAction ? 'bg-green-100' : 'bg-gray-100'
              }`}>
              {bulkAction ? (
                <Power className="w-6 h-6 text-green-600" />
              ) : (
                <PowerOff className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bulk {bulkAction ? 'Activate' : 'Deactivate'} Cryptocurrencies
              </h3>
              <p className="text-sm text-gray-600">Confirm bulk action</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to {bulkAction ? 'activate' : 'deactivate'}{' '}
            <strong>{selectedCryptos.length}</strong> selected {selectedCryptos.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowBulkModal(false)}
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmBulkToggle}
              disabled={processing}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition disabled:opacity-50 ${bulkAction
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 hover:bg-gray-700'
                }`}
            >
              {processing ? 'Processing...' : (bulkAction ? 'Activate All' : 'Deactivate All')}
            </button>
          </div>
        </div>
      </Modal>

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