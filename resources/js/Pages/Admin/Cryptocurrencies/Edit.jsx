import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Toast from '@/Components/Trading/Toast';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function EditCryptocurrency({ cryptocurrency }) {
  const { flash } = usePage().props;
  const [previewIcon, setPreviewIcon] = useState(
    cryptocurrency?.icon ? `/storage/${cryptocurrency.icon}` : null
  );
  const [toast, setToast] = useState(null);

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

  const { data, setData, post, processing, errors } = useForm({
    name: cryptocurrency?.name || '',
    symbol: cryptocurrency?.symbol || '',
    icon: null,
    current_price: cryptocurrency?.current_price || '',
    market_cap: cryptocurrency?.market_cap || '',
    volume_24h: cryptocurrency?.volume_24h || '',
    change_24h: cryptocurrency?.change_24h || '',
    is_active: cryptocurrency?.is_active ?? true,
    is_fiat: cryptocurrency?.is_fiat ?? false,
    decimal_places: cryptocurrency?.decimal_places || 8,
  });

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('icon', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    setData('icon', null);
    setPreviewIcon(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For file uploads with PUT, we need to use POST with _method spoofing
    const formData = {
      ...data,
      _method: 'PUT',
    };

    post(route('admin.cryptocurrencies.update', cryptocurrency.id), {
      data: formData,
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // Success is handled by flash messages
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Edit Cryptocurrency" />

      {/* Header */}
      <div className="mb-6">
        <Link
          href={route('admin.cryptocurrencies.index')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cryptocurrencies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Cryptocurrency</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update cryptocurrency information and settings
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Bitcoin"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Symbol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symbol <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.symbol}
                    onChange={(e) => setData('symbol', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., BTC"
                    maxLength={10}
                    required
                  />
                  {errors.symbol && (
                    <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
                  )}
                </div>

                {/* Icon Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon/Logo
                  </label>
                  <div className="flex items-start gap-4">
                    {previewIcon && (
                      <div className="relative">
                        <img
                          src={previewIcon}
                          alt="Icon preview"
                          className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {previewIcon ? 'Change Icon' : 'Upload Icon'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG or SVG. Max 2MB.
                      </p>
                      {errors.icon && (
                        <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={data.current_price}
                    onChange={(e) => setData('current_price', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                  {errors.current_price && (
                    <p className="mt-1 text-sm text-red-600">{errors.current_price}</p>
                  )}
                </div>

                {/* 24h Change */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    24h Change (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={data.change_24h}
                    onChange={(e) => setData('change_24h', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.change_24h && (
                    <p className="mt-1 text-sm text-red-600">{errors.change_24h}</p>
                  )}
                </div>

                {/* Market Cap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Market Cap (USD)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={data.market_cap}
                    onChange={(e) => setData('market_cap', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.market_cap && (
                    <p className="mt-1 text-sm text-red-600">{errors.market_cap}</p>
                  )}
                </div>

                {/* 24h Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    24h Volume (USD)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={data.volume_24h}
                    onChange={(e) => setData('volume_24h', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.volume_24h && (
                    <p className="mt-1 text-sm text-red-600">{errors.volume_24h}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Decimal Places */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimal Places <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={data.decimal_places}
                    onChange={(e) => setData('decimal_places', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Number of decimal places for this currency (0-18)
                  </p>
                  {errors.decimal_places && (
                    <p className="mt-1 text-sm text-red-600">{errors.decimal_places}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Is Active */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                      <p className="text-xs text-gray-500">
                        Allow trading and transactions for this currency
                      </p>
                    </div>
                  </div>

                  {/* Is Fiat */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={data.is_fiat}
                        onChange={(e) => setData('is_fiat', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        Fiat Currency
                      </label>
                      <p className="text-xs text-gray-500">
                        Mark as fiat currency (e.g., USD, EUR)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <Link
              href={route('admin.cryptocurrencies.index')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {processing ? 'Saving...' : 'Update Cryptocurrency'}
            </button>
          </div>
        </div>
      </form>

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