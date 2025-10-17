import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Camera, Trash2, Lock, Activity, Save, X } from 'lucide-react';

export default function Edit({ user }) {
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
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'activity' && <ActivityTab />}
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
      router.delete(route('admin.profile.picture.remove'), {
        onSuccess: () => {
          setPreviewImage(null);
          setSelectedFile(null);
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('admin.profile.update'));
  };

  const getProfilePictureUrl = () => {
    if (previewImage) return previewImage;
    if (user.profile_picture) return `/storage/${user.profile_picture}`;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              {getProfilePictureUrl() ? (
                <img
                  src={getProfilePictureUrl()}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            {(user.profile_picture || previewImage) && (
              <button
                onClick={handleRemovePicture}
                className="absolute bottom-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove picture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Picture
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/jpg,image/gif"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, GIF up to 2MB
              </p>
              {pictureForm.errors.profile_picture && (
                <p className="mt-2 text-sm text-red-600">{pictureForm.errors.profile_picture}</p>
              )}
            </div>

            {selectedFile && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUploadPicture}
                  disabled={pictureForm.processing}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {pictureForm.processing ? 'Uploading...' : 'Upload Picture'}
                </button>
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="City, Country"
              />
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

function SecurityTab() {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
      <p className="text-sm text-gray-600 mb-6">
        Ensure your account is using a long, random password to stay secure.
      </p>

      <div className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password *
          </label>
          <input
            type="password"
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          {errors.current_password && (
            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password *
          </label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
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
            onClick={handleSubmit}
            disabled={processing}
            className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            {processing ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  const { activities } = usePage().props;

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
                          <span className="mr-1">🌐</span>
                          {activity.ip_address}
                        </span>
                      )}
                      {activity.device && (
                        <span className="flex items-center">
                          <span className="mr-1">{getDeviceIcon(activity.device)}</span>
                          {activity.device}
                        </span>
                      )}
                      {activity.browser && (
                        <span className="flex items-center">
                          <span className="mr-1">🔍</span>
                          {activity.browser}
                        </span>
                      )}
                      {activity.platform && (
                        <span className="flex items-center">
                          <span className="mr-1">⚙️</span>
                          {activity.platform}
                        </span>
                      )}
                    </div>
                    {activity.properties && Object.keys(activity.properties).length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">Changes:</p>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {activity.properties.changes && Object.entries(activity.properties.changes).map(([key, change]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                              <span className="text-gray-500">{change.old || 'empty'}</span>
                              {' → '}
                              <span className="text-gray-900">{change.new || 'empty'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {activities.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                Showing {activities.from} to {activities.to} of {activities.total} activities
              </div>
              <div className="flex items-center space-x-2">
                {activities.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    disabled={!link.url}
                    className={`px-3 py-1 text-sm rounded-md ${link.active
                      ? 'bg-indigo-600 text-white'
                      : link.url
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-sm">No activity logs yet</p>
          <p className="text-gray-400 text-xs mt-1">Your activity will appear here</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Security Tip</h4>
            <p className="mt-1 text-sm text-blue-700">
              Regularly review your activity log to ensure all actions are authorized. If you notice any suspicious activity, change your password immediately and contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}