import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';
import { ThemeProvider } from '@/Components/ThemeProvider';

export default function AdminLayout({ children, title }) {
  const { auth, stats } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Handle case where auth might be undefined
  const user = auth?.user || null;

  // If no user, show loading or error
  if (!user) {
    return (
      <ThemeProvider>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Head title={title || 'Admin Dashboard'} />

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <AdminSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            user={user}
            stats={stats}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isCollapsed={sidebarCollapsed}
            toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}