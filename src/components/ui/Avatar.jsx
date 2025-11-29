/**
 * Avatar component for user profiles
 * 
 * @example
 * <Avatar name="John Doe" src="/avatar.jpg" size="lg" />
 * <Avatar name="Jane" /> // Shows initials "J"
 * <Avatar name="John" userId="123" clickable /> // Clickable, navigates to profile
 */

import { useNavigate } from 'react-router-dom';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const colors = [
  'bg-primary-100 text-primary-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getColorFromName = (name) => {
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const Avatar = ({
  name,
  src,
  size = 'md',
  className = '',
  userId,
  clickable = false,
  onClick,
  ...props
}) => {
  const navigate = useNavigate();
  const sizeClass = sizes[size] || sizes.md;
  const colorClass = getColorFromName(name);
  const initials = getInitials(name);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (clickable && userId) {
      navigate(`/user/${userId}`);
    }
  };

  const clickableClass = (clickable || onClick) 
    ? 'cursor-pointer hover:ring-2 hover:ring-primary-300 hover:ring-offset-2 transition-all' 
    : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover ${clickableClass} ${className}`}
        onClick={handleClick}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold ${clickableClass} ${className}`}
      title={name}
      onClick={handleClick}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar;
