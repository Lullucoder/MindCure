import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

/**
 * BackButton - Smart navigation component
 * - Goes back in history if there's history
 * - Falls back to specified route or dashboard
 */
const BackButton = ({ 
  fallbackPath = '/dashboard', 
  label = 'Back',
  showLabel = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if we have history to go back to
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // Fallback to specified path
      navigate(fallbackPath);
    }
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`nav-buttons ${className}`}>
      <button
        onClick={handleBack}
        className="back-btn"
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeft size={20} />
        {showLabel && <span>{label}</span>}
      </button>
      
      {location.pathname !== '/dashboard' && (
        <button
          onClick={handleHome}
          className="home-btn"
          aria-label="Go to dashboard"
          title="Go to dashboard"
        >
          <Home size={18} />
        </button>
      )}
    </div>
  );
};

export default BackButton;
