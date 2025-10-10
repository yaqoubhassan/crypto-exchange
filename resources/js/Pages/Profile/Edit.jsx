import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePictureForm from './Partials/UpdateProfilePictureForm';

export default function Edit({ mustVerifyEmail, status, user }) {
    return (
        <DashboardLayout>
            <Head title="Profile Settings" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your account information and preferences
                        </p>
                    </div>
                    <span className="text-sm text-gray-500">
                        Member since {new Date(user.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Profile Sections */}
            <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <UpdateProfilePictureForm
                        user={user}
                        className="max-w-xl"
                    />
                </div>

                {/* Profile Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        user={user}
                        className="max-w-xl"
                    />
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Delete Account Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </DashboardLayout>
    );
}