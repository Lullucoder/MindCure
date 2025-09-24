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
    <nav className="glass sticky top-0 z-50 border-b border-purple-200/30 shadow-soft backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg gentle-pulse">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MindCure</span>
                <span className="text-xs text-purple-500 font-medium -mt-1 tracking-wide">THERAPY & WELLNESS</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-purple-100/50 ${
                  isCurrentPath(item.href)
                    ? 'text-purple-600 bg-purple-100/70 shadow-sm'
                    : 'text-purple-500 hover:text-purple-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="btn-primary flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl text-purple-400 hover:text-purple-600 hover:bg-purple-100/50 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-3 glass-dark border-t border-purple-200/30 shadow-soft-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isCurrentPath(item.href)
                    ? 'bg-purple-100/70 text-purple-700 shadow-sm'
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-purple-200/30">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;