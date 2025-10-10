import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import OrderStats from '@/Components/Admin/Orders/OrderStats';
import OrderFilters from '@/Components/Admin/Orders/OrderFilters';
import OrdersTable from '@/Components/Admin/Orders/OrdersTable';
import OrderCard from '@/Components/Admin/Orders/OrderCard';
import OrderDetailModal from '@/Components/Admin/Orders/OrderDetailModal';
import Toast from '@/Components/Trading/Toast';

export default function Orders({ orders, filters = {}, stats = {} }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
  const [sideFilter, setSideFilter] = useState(filters.side || 'all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const { flash } = usePage().props;

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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  // Apply filters
  const applyFilters = (newFilters = {}) => {
    router.get('/admin/orders', {
      search: searchQuery,
      status: statusFilter,
      type: typeFilter,
      side: sideFilter,
      ...newFilters
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSideFilter('all');
    router.get('/admin/orders');
  };

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    router.post(`/admin/orders/${orderId}/status`, {
      status: newStatus
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setToast({
          message: 'Order status updated successfully!',
          type: 'success'
        });
      },
      onError: (errors) => {
        setToast({
          message: errors.message || 'Failed to update order status',
          type: 'error'
        });
      }
    });
  };

  // Show toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.data.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.data.map(order => order.id));
    }
  };

  // Export orders
  const handleExport = () => {
    window.location.href = `/admin/orders/export?${new URLSearchParams({
      status: statusFilter,
      type: typeFilter,
      side: sideFilter
    })}`;
  };

  return (
    <AdminLayout>
      <Head title="Orders Management" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor and manage all trading orders
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => router.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <OrderStats stats={stats} orders={orders} />

      {/* Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sideFilter={sideFilter}
        setSideFilter={setSideFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        onSearch={handleSearch}
      />

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-indigo-700 font-medium">
                {selectedOrders.length} order(s) selected
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (confirm('Cancel all selected orders?')) {
                    // Implement bulk cancel
                  }
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel Selected
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <OrdersTable
          orders={orders}
          selectedOrders={selectedOrders}
          onSelectAll={toggleSelectAll}
          onSelectOrder={toggleOrderSelection}
          onViewOrder={setViewingOrder}
          onShowToast={showToast}
        />
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.data && orders.data.length > 0 ? (
          orders.data.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={setViewingOrder}
              onSelect={toggleOrderSelection}
              isSelected={selectedOrders.includes(order.id)}
              onShowToast={showToast}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              Orders will appear here once users place them
            </p>
          </div>
        )}

        {/* Mobile Pagination */}
        {orders.links && orders.links.length > 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-700 text-center">
                Showing <span className="font-medium">{orders.from || 0}</span> to{' '}
                <span className="font-medium">{orders.to || 0}</span> of{' '}
                <span className="font-medium">{orders.total || 0}</span> results
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {orders.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${link.active
                      ? 'bg-indigo-600 text-white'
                      : link.url
                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onStatusChange={handleStatusChange}
        onShowToast={showToast}
      />

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