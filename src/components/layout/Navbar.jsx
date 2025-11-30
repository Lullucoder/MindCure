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

          <div className="navbar__links hidden lg:flex">
            {commonNav.map((item) => (
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

          <button
            onClick={() => setIsOpen((open) => !open)}
            className="navbar__mobile-toggle lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-nav" className="navbar__mobile-panel lg:hidden">
          <nav className="navbar__mobile-list" aria-label="Mobile navigation">
            {commonNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="navbar__mobile-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            {roleBasedNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="navbar__mobile-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
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
