import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardHeader from '@/Components/Dashboard/DashboardHeader';
import Sidebar from '@/Components/Dashboard/Sidebar';
import { ThemeProvider } from '@/Components/ThemeProvider';

export default function DashboardLayout({ children, title }) {
  const { auth } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = auth?.user || null;

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
      <Head title={title || 'Dashboard'} />

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            user={user}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isCollapsed={sidebarCollapsed}
            toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}