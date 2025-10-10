import { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Camera, Trash2, User } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function UpdateProfilePictureForm({ user, className = '' }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    profile_picture: null,
  });

  const getProfilePictureUrl = () => {
    if (preview) return preview;
    if (user.profile_picture) return `/storage/${user.profile_picture}`;
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setData('profile_picture', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    post(route('profile.picture.upload'), {
      forceFormData: true,
      onSuccess: () => {
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
    });
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      router.delete(route('profile.picture.remove'), {
        onSuccess: () => {
          setPreview(null);
          setSelectedFile(null);
        }
      });
    }
  };

  const cancelUpload = () => {
    setPreview(null);
    setSelectedFile(null);
    setData('profile_picture', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">
          Profile Picture
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your profile picture. Accepted formats: JPG, PNG, GIF (max 2MB)
        </p>
      </header>

      <div className="mt-6">
        <div className="flex items-center space-x-6">
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
              {getProfilePictureUrl() ? (
                <img
                  src={getProfilePictureUrl()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>

            {/* Camera Icon Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              disabled={processing}
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Selected file:</span> {selectedFile.name}
                </p>
              </div>
            )}

            {errors.profile_picture && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.profile_picture}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              {selectedFile ? (
                <>
                  <PrimaryButton onClick={handleUpload} disabled={processing}>
                    {processing ? 'Uploading...' : 'Upload Photo'}
                  </PrimaryButton>
                  <SecondaryButton onClick={cancelUpload} disabled={processing}>
                    Cancel
                  </SecondaryButton>
                </>
              ) : (
                <>
                  <SecondaryButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                  >
                    Choose Photo
                  </SecondaryButton>

                  {user.profile_picture && (
                    <DangerButton
                      onClick={handleRemove}
                      disabled={processing}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DangerButton>
                  )}
                </>
              )}
            </div>

            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-green-600 mt-2">
                Profile picture updated successfully!
              </p>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  );
}