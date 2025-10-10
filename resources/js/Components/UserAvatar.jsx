import { User } from 'lucide-react';

/**
 * Reusable UserAvatar component for displaying user profile pictures
 * 
 * @param {string} src - Profile picture URL
 * @param {string} name - User name (for fallback initial)
 * @param {string} size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} className - Additional CSS classes
 */
export default function UserAvatar({
  src,
  name = 'User',
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  const getInitial = () => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const profilePictureUrl = src ? (src.startsWith('http') ? src : `/storage/${src}`) : null;

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0 ${className}`}>
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span className={`text-white font-semibold ${textSizes[size]}`}>
          {getInitial()}
        </span>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * <UserAvatar 
 *   src={user.profile_picture} 
 *   name={user.name} 
 *   size="md" 
 * />
 * 
 * <UserAvatar 
 *   src={user.profile_picture} 
 *   name={user.name} 
 *   size="xl" 
 *   className="border-4 border-white shadow-xl"
 * />
 */