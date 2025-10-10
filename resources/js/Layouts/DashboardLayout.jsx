import React from 'react';
import { usePage } from '@inertiajs/react';
import DashboardHeader from '@/Components/Dashboard/DashboardHeader';
import Sidebar from '@/Components/Dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  const { auth } = usePage().props;
  const currentRoute = route().current();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - z-[60] */}
      <DashboardHeader user={auth.user} />

      {/* Fixed Sidebar - z-40 */}
      <Sidebar currentRoute={currentRoute} />

      {/* Main Content - Account for fixed header and sidebar */}
      <div className="lg:pl-64 pt-16">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}