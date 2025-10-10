import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Shield } from 'lucide-react';

export default function Show({ user }) {
  return (
    <DashboardLayout>
      <Head title="My Profile" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              View your account information
            </p>
          </div>
          <Link
            href={route('profile.edit')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Profile Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

        <div className="px-6 pb-6">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center border-4 border-white shadow-xl">
              {user.profile_picture ? (
                <img
                  src={`/storage/${user.profile_picture}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
          </div>

          {/* User Name and Bio */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            {user.bio && (
              <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500">
                    Email
                  </div>
                  <div className="flex-1 text-sm text-gray-900">
                    {user.email}
                    {user.email_verified_at && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500">
                      Phone
                    </div>
                    <div className="flex-1 text-sm text-gray-900">
                      {user.phone}
                    </div>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500">
                      Location
                    </div>
                    <div className="flex-1 text-sm text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {user.location}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">
                    Member Since
                  </div>
                  <div className="flex-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">
                    Account Status
                  </div>
                  <div className="flex-1 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">
                    2FA Status
                  </div>
                  <div className="flex-1 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.two_factor_enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {user.last_login_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-500">
                      Last Login
                    </div>
                    <div className="flex-1 text-sm text-gray-900">
                      {new Date(user.last_login_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={route('profile.edit')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>

            <Link
              href={route('security.index')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}