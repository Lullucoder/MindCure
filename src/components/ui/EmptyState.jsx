/**
 * Empty state component for when there's no data to display
 * 
 * @example
 * <EmptyState
 *   icon={Heart}
 *   title="No mood entries yet"
 *   description="Start tracking your mood to see patterns"
 *   action={{ label: 'Log Mood', onClick: () => {} }}
 * />
 */

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn--primary"
        >
          {action.icon && <action.icon className="h-5 w-5" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
