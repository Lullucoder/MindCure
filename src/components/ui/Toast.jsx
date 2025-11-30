/**
 * Toast Notification Component
 * 
 * Provides feedback messages to users with auto-dismiss functionality
 * Supports success, error, warning, and info variants
 */

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const variants = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    textColor: 'text-green-800',
    progressColor: 'bg-green-500',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-800',
    progressColor: 'bg-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
    progressColor: 'bg-blue-500',
  },
};

const Toast = ({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  showProgress = true,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto dismiss
      const timeout = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Allow animation to complete
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} 
        border rounded-lg shadow-lg overflow-hidden
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-medium ${config.textColor}`}>{title}</p>
          )}
          <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress bar */}
      {showProgress && duration > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toasts with proper positioning
 */
export const ToastContainer = ({ toasts, onRemove, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 max-w-sm w-full`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          title={toast.title}
          duration={toast.duration}
          showProgress={toast.showProgress}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Alert Component (inline version)
 * For displaying non-dismissing alerts within content
 */
export const Alert = ({
  children,
  variant = 'info',
  title,
  className = '',
}) => {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <p className={`font-medium ${config.textColor}`}>{title}</p>
          )}
          <div className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
