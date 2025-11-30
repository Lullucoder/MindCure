/**
 * Badge component for labels, tags, and status indicators
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 */

const variants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-emerald-100 text-emerald-700',
  accent: 'bg-coral-100 text-coral-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        font-medium rounded-full
        ${variants[variant]} 
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
