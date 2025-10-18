import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function KycIndex() {
  const { kyc, hasSubmitted, auth } = usePage().props;
  const [previewImages, setPreviewImages] = useState({
    document_front: null,
    document_back: null,
    selfie: null,
  });

  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    phone_number: '',
    document_type: 'passport',
    document_number: '',
    document_front_image: null,
    document_back_image: null,
    selfie_image: null,
  });

  const handleFileChange = (field, file) => {
    if (file) {
      setData(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [field.replace('_image', '')]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('kyc.store'), {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Verified' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Rejected' },
    };
    return badges[status] || badges.pending;
  };

  // If user has already submitted KYC
  if (hasSubmitted && kyc) {
    const statusInfo = getStatusBadge(kyc.verification_status);

    return (
      <DashboardLayout user={auth.user}>
        <Head title="KYC Verification" />

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              KYC Verification
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Identity verification status
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <span className="text-5xl">{statusInfo.icon}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {statusInfo.label}
              </h2>

              {kyc.verification_status === 'pending' && (
                <div className="max-w-md mx-auto">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your documents are being reviewed by our team. This typically takes 24-72 hours.
                  </p>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text} mb-4`}>
                    Under Review
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                          What happens next?
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Our team will review your documents within 24-72 hours</li>
                          <li>• You'll receive a notification once the review is complete</li>
                          <li>• Check your email and notifications for updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {kyc.verification_status === 'approved' && (
                <div className="max-w-md mx-auto">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your identity has been verified successfully! You now have full access to all platform features.
                  </p>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                    Verified on {new Date(kyc.verified_at).toLocaleDateString()}
                  </div>
                </div>
              )}

              {kyc.verification_status === 'rejected' && (
                <div className="max-w-md mx-auto">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                      Rejection Reason:
                    </p>
                    <p className="text-red-700 dark:text-red-300">
                      {kyc.rejection_reason}
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.href = route('kyc.index') + '?resubmit=true'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Resubmit Documents
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submitted Information */}
          {kyc.verification_status !== 'rejected' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Submitted Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {kyc.first_name} {kyc.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                  <p className="text-gray-900 dark:text-white font-medium">{kyc.date_of_birth}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
                  <p className="text-gray-900 dark:text-white font-medium">{kyc.nationality}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {kyc.document_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(kyc.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // KYC Submission Form
  return (
    <DashboardLayout user={auth.user}>
      <Head title="KYC Verification" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Identity Verification (KYC)
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete your identity verification to access all platform features
          </p>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Why do we need this?
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <ul className="list-disc list-inside space-y-1">
                  <li>Comply with financial regulations</li>
                  <li>Protect your account from fraud</li>
                  <li>Enable higher transaction limits</li>
                  <li>Verification typically takes 24-72 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={data.first_name}
                  onChange={(e) => setData('first_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => setData('date_of_birth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationality *
                </label>
                <input
                  type="text"
                  value={data.nationality}
                  onChange={(e) => setData('nationality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., American"
                  required
                />
                {errors.nationality && (
                  <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Street address"
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  value={data.state_province}
                  onChange={(e) => setData('state_province', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.state_province && (
                  <p className="text-red-500 text-xs mt-1">{errors.state_province}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.postal_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={data.phone_number}
                  onChange={(e) => setData('phone_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+1 234 567 8900"
                  required
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Identity Document
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Type *
                </label>
                <select
                  value={data.document_type}
                  onChange={(e) => setData('document_type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver's License</option>
                  <option value="national_id">National ID Card</option>
                </select>
                {errors.document_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.document_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Number *
                </label>
                <input
                  type="text"
                  value={data.document_number}
                  onChange={(e) => setData('document_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Document ID number"
                  required
                />
                {errors.document_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.document_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Documents
            </h3>
            <div className="space-y-4">
              {/* Front Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Front Side * (Max 5MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      {previewImages.document_front ? (
                        <img
                          src={previewImages.document_front}
                          alt="Document Front Preview"
                          className="mx-auto max-h-48 rounded"
                        />
                      ) : (
                        <div>
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Click to upload front side
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleFileChange('document_front_image', e.target.files[0])}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                {errors.document_front_image && (
                  <p className="text-red-500 text-xs mt-1">{errors.document_front_image}</p>
                )}
              </div>

              {/* Back Image */}
              {data.document_type !== 'passport' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Back Side (Max 5MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                        {previewImages.document_back ? (
                          <img
                            src={previewImages.document_back}
                            alt="Document Back Preview"
                            className="mx-auto max-h-48 rounded"
                          />
                        ) : (
                          <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              Click to upload back side
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => handleFileChange('document_back_image', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {errors.document_back_image && (
                    <p className="text-red-500 text-xs mt-1">{errors.document_back_image}</p>
                  )}
                </div>
              )}

              {/* Selfie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selfie with Document * (Max 5MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      {previewImages.selfie ? (
                        <img
                          src={previewImages.selfie}
                          alt="Selfie Preview"
                          className="mx-auto max-h-48 rounded"
                        />
                      ) : (
                        <div>
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Upload a selfie holding your document
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleFileChange('selfie_image', e.target.files[0])}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                {errors.selfie_image && (
                  <p className="text-red-500 text-xs mt-1">{errors.selfie_image}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Take a clear selfie holding your ID document next to your face
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              📸 Photo Tips for Best Results:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
              <li>Ensure good lighting and avoid shadows</li>
              <li>All text should be clearly readable</li>
              <li>No glare or reflections on the document</li>
              <li>Document should be fully visible within the frame</li>
              <li>Photos should be in color, not black and white</li>
              <li>For selfie: hold document next to your face, both clearly visible</li>
            </ul>
          </div>

          {/* Terms and Submit */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I confirm that all information provided is accurate and that the documents are genuine.
                I understand that providing false information may result in account suspension.
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Submitting...' : 'Submit for Verification'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              Your documents are encrypted and securely stored. We will review your submission within 24-72 hours.
            </p>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}