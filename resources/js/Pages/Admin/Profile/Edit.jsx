import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Camera, Trash2, Lock, Activity, Save, X, Shield, Monitor, Eye, EyeOff, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Edit({ user, activities, activeSessions, twoFactorEnabled }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <AdminLayout>
      <Head title="Admin Profile Settings" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your admin account information and security
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
              Admin
            </span>
            <span className="text-sm text-gray-500">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${activeTab === 'security'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`${activeTab === 'activity'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity Log
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'security' && <SecurityTab activeSessions={activeSessions} twoFactorEnabled={twoFactorEnabled} />}
          {activeTab === 'activity' && <ActivityTab activities={activities} />}
        </div>
      </div>
    </AdminLayout>
  );
}

function ProfileTab({ user }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    location: user.location || '',
  });

  const pictureForm = useForm({
    profile_picture: null,
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      pictureForm.setData('profile_picture', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = (e) => {
    e.preventDefault();
    pictureForm.post(route('admin.profile.picture.upload'), {
      forceFormData: true,
      onSuccess: () => {
        setPreviewImage(null);
        setSelectedFile(null);
      },
    });
  };

  const handleRemovePicture = () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      router.delete(route('admin.profile.picture.remove'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('admin.profile.update'));
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : user.profile_picture ? (
                <img src={`/storage/${user.profile_picture}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 inline mr-2" />
                Choose Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>

              {selectedFile && (
                <>
                  <button
                    onClick={handleUploadPicture}
                    disabled={pictureForm.processing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {pictureForm.processing ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}

              {user.profile_picture && !selectedFile && (
                <button
                  onClick={handleRemovePicture}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-500">
              {data.bio.length}/500 characters
            </p>
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              {recentlySuccessful && (
                <p className="text-sm text-green-600">Profile updated successfully!</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ activeSessions, twoFactorEnabled }) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { data, setData, patch, processing, errors, reset, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('admin.profile.password.update'), {
      onSuccess: () => reset(),
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getDeviceIcon = (deviceType) => {
    if (deviceType === 'Mobile') return '📱';
    if (deviceType === 'Tablet') return '📱';
    return '💻';
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change Password
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Ensure your account is using a long, random password to stay secure.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              {recentlySuccessful && (
                <p className="text-sm text-green-600">Password updated successfully!</p>
              )}
            </div>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Quick Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${twoFactorEnabled
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
            }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="mt-4">
          <Link
            href={route('admin.security.index')}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Manage Two-Factor Authentication
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Active Sessions Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Active Sessions
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Devices where you're currently logged in
            </p>
          </div>
          <Link
            href={route('admin.security.index')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </Link>
        </div>

        {activeSessions && activeSessions.length > 0 ? (
          <div className="space-y-3">
            {activeSessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border ${session.is_current
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={session.is_current ? 'text-green-600' : 'text-gray-600'}>
                    {getDeviceIcon(session.device_type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {session.is_current ? 'Current Device' : session.platform}
                    </div>
                    <div className="text-xs text-gray-600">
                      {session.browser} • {session.ip_address}
                    </div>
                  </div>
                  {session.is_current && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}

            {activeSessions.length > 3 && (
              <div className="pt-2">
                <Link
                  href={route('admin.security.index')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View {activeSessions.length - 3} more session(s)
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active sessions found.</p>
        )}
      </div>

      {/* Security Best Practices */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Security Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use a strong, unique password that you don't use on other websites</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Enable two-factor authentication for an additional layer of security</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Regularly review your login activity and active sessions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Never share your password or 2FA codes with anyone</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Log out from devices you no longer use</span>
          </li>
        </ul>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <Link
            href={route('admin.security.index')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Go to Full Security Settings
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ activities }) {
  const getActivityIcon = (action) => {
    const icons = {
      login: { icon: Activity, color: 'bg-green-100 text-green-600' },
      logout: { icon: Activity, color: 'bg-gray-100 text-gray-600' },
      profile_updated: { icon: User, color: 'bg-blue-100 text-blue-600' },
      profile_picture_updated: { icon: Camera, color: 'bg-indigo-100 text-indigo-600' },
      profile_picture_removed: { icon: Trash2, color: 'bg-red-100 text-red-600' },
      password_changed: { icon: Lock, color: 'bg-purple-100 text-purple-600' },
    };

    return icons[action] || { icon: Activity, color: 'bg-gray-100 text-gray-600' };
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getDeviceIcon = (device) => {
    if (device === 'Mobile') return '📱';
    if (device === 'Tablet') return '📱';
    return '💻';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <p className="text-sm text-gray-600 mb-6">
        View your recent account activity and security events.
      </p>

      {activities && activities.data && activities.data.length > 0 ? (
        <>
          <div className="space-y-3">
            {activities.data.map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.action);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      {activity.ip_address && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.ip_address}
                        </span>
                      )}
                      {activity.device && (
                        <span>{getDeviceIcon(activity.device)} {activity.device}</span>
                      )}
                      {activity.browser && (
                        <span>{activity.browser}</span>
                      )}
                      {activity.platform && (
                        <span>{activity.platform}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {activities.links && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                Showing {activities.from} to {activities.to} of {activities.total} activities
              </div>
              <div className="flex space-x-2">
                {activities.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-1 rounded-lg text-sm ${link.active
                      ? 'bg-indigo-600 text-white'
                      : link.url
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No activity logs found</p>
        </div>
      )}
    </div>
  );
}