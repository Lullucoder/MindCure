/**
 * Card component with header, content, and footer sections
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Welcome</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Content goes here</p>
 *   </CardContent>
 * </Card>
 */

export const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white border border-gray-100',
    elevated: 'bg-white shadow-lg',
    glass: 'glass-panel',
    gradient: 'bg-gradient-to-br from-white to-gray-50',
  };

  return (
    <div 
      className={`rounded-2xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`p-6 pb-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component 
    className={`text-xl font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p 
    className={`text-gray-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div 
    className={`p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div 
    className={`p-6 pt-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
