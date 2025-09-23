/* 
// COMMENTED OUT PROTECTED ROUTE FOR NON-AUTH VERSION
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && userProfile && userProfile.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
*/

// Simple pass-through component for non-auth version
const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Just render children without any authentication checks
  return children;
};

export default ProtectedRoute;