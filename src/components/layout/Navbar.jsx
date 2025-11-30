import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Menu,
  X,
  MessageCircle,
  BookOpen,
  Phone,
  User,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();

  // Common navigation for all users
  const commonNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', href: '/chat', icon: MessageCircle },
    { name: 'Check-in', href: '/mood', icon: User }
  ];

  // Role-based navigation
  const getRoleBasedNav = () => {
    const role = userProfile?.role || 'student';
    
    switch (role) {
      case 'admin':
        return [
          { name: 'Admin Panel', href: '/admin', icon: Shield }
        ];
      case 'counselor':
        return [
          { name: 'Counselor Panel', href: '/counselor', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const roleBasedNav = getRoleBasedNav();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      await logout();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getRoleBadge = () => {
    const role = userProfile?.role;
    if (role === 'admin') return '🛡️ Admin';
    if (role === 'counselor') return '🩺 Counselor';
    return null;
  };

  const accountLabel = userProfile?.firstName
    ? `Hi, ${userProfile.firstName}`
    : currentUser?.email || 'Account';

  return (
<<<<<<< HEAD
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
=======
    <nav className="navbar">
      <div className="layout-container">
        <div className="navbar__surface">
          <Link to="/" className="navbar__brand" aria-label="MindCure home">
            <span className="navbar__logo">
              <Heart className="h-6 w-6" style={{ color: 'var(--color-primary-500)' }} fill="currentColor" />
            </span>
            <span className="navbar__title">
              <span>MindCure</span>
              <span>THERAPY &amp; WELLNESS</span>
            </span>
          </Link>
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd

          <div className="navbar__links hidden lg:flex">
            {commonNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
<<<<<<< HEAD
                className={`nav-link text-base font-medium transition-colors hover:text-accessible-interactive-primary focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2 focus:bg-accessible-bg-focus focus:rounded focus:px-2 focus:py-1 ${
                  isCurrentPath(item.href)
                    ? 'text-accessible-interactive-primary font-semibold'
                    : 'text-accessible-text-secondary'
                }`}
=======
                className="nav-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {roleBasedNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

<<<<<<< HEAD
          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="bg-accessible-interactive-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accessible-interactive-primary-hover focus:outline-3 focus:outline-yellow-400 focus:outline-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Log In
=======
          <div className="navbar__actions hidden lg:flex">
            {currentUser && (
              <div className="flex items-center gap-2">
                {getRoleBadge() && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {getRoleBadge()}
                  </span>
                )}
                <Link 
                  to="/notifications" 
                  className="btn btn--ghost notification-btn" 
                  aria-label="View notifications"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </Link>
                <Link to="/profile" className="btn btn--ghost" aria-label="View profile">
                  <User className="h-4 w-4" />
                  <span>{accountLabel}</span>
                </Link>
              </div>
            )}
            <Link to="/crisis" className="btn btn--secondary" aria-label="Crisis resources">
              <Phone className="h-4 w-4" />
              <span>Crisis</span>
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
            </Link>
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn--ghost"
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
              </button>
            ) : (
              <Link to="/register" className="btn btn--primary">
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            )}
          </div>

<<<<<<< HEAD
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
=======
          <button
            onClick={() => setIsOpen((open) => !open)}
            className="navbar__mobile-toggle lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
        </div>
      </div>

      {isOpen && (
<<<<<<< HEAD
        <div className="lg:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white  shadow-lg">
            {navigation.map((item) => (
=======
        <div id="mobile-nav" className="navbar__mobile-panel lg:hidden">
          <nav className="navbar__mobile-list" aria-label="Mobile navigation">
            {commonNav.map((item) => (
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              <Link
                key={item.name}
                to={item.href}
                className="navbar__mobile-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
<<<<<<< HEAD
                className={`nav-link block px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isCurrentPath(item.href)
                    ? 'bg-accessible-bg-interactive text-accessible-interactive-primary font-semibold'
                    : 'text-accessible-text-secondary hover:text-accessible-text-primary hover:bg-accessible-bg-interactive-hover'
                }`}
=======
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
<<<<<<< HEAD
            <div className="pt-4 ">
=======
            {roleBasedNav.map((item) => (
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              <Link
                key={item.name}
                to={item.href}
                className="navbar__mobile-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
<<<<<<< HEAD
                className="nav-link block w-full bg-accessible-interactive-primary text-white px-4 py-3 rounded-xl font-semibold text-center hover:bg-accessible-interactive-primary-hover transition-colors min-h-[44px] flex items-center justify-center"
=======
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="navbar__mobile-actions">
            {getRoleBadge() && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mb-2 inline-block">
                {getRoleBadge()}
              </span>
            )}
            {currentUser && (
              <Link 
                to="/notifications" 
                className="btn btn--ghost" 
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
            )}
            <Link to="/crisis" className="btn btn--secondary" onClick={() => setIsOpen(false)}>
              <Phone className="h-4 w-4" />
              <span>Crisis resources</span>
            </Link>
            {currentUser ? (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
              </button>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <Link to="/login" className="btn btn--ghost" onClick={() => setIsOpen(false)}>
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
                <Link to="/register" className="btn btn--primary" onClick={() => setIsOpen(false)}>
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;