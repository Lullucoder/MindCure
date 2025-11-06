import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';  // COMMENTED OUT FOR NON-AUTH VERSION
import { 
  Heart, 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  Phone, 
  Settings, 
  LogOut,
  User,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { currentUser, userProfile, logout } = useAuth();  // COMMENTED OUT FOR NON-AUTH VERSION
  const location = useLocation();
  const navigate = useNavigate();

  /* COMMENTED OUT FOR NON-AUTH VERSION
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  */

  const navigation = [
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Therapy', href: '/chat', icon: MessageCircle },  
    { name: 'Community', href: '/mood', icon: User },
  ];

  /* COMMENTED OUT FOR NON-AUTH VERSION
  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  */

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm   sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">Mental Health</span>
                <span className="text-xs text-gray-500 font-medium -mt-1">SUPPORT PLATFORM</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link text-base font-medium transition-colors hover:text-accessible-interactive-primary focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2 focus:bg-accessible-bg-focus focus:rounded focus:px-2 focus:py-1 ${
                  isCurrentPath(item.href)
                    ? 'text-accessible-interactive-primary font-semibold'
                    : 'text-accessible-text-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="bg-accessible-interactive-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accessible-interactive-primary-hover focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Log In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-accessible-text-secondary hover:text-accessible-text-primary hover:bg-accessible-bg-interactive transition-colors focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white  shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`nav-link block px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isCurrentPath(item.href)
                    ? 'bg-accessible-bg-interactive text-accessible-interactive-primary font-semibold'
                    : 'text-accessible-text-secondary hover:text-accessible-text-primary hover:bg-accessible-bg-interactive-hover'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 ">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="nav-link block w-full bg-accessible-interactive-primary text-white px-4 py-3 rounded-xl font-semibold text-center hover:bg-accessible-interactive-primary-hover transition-colors min-h-[44px] flex items-center justify-center"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;