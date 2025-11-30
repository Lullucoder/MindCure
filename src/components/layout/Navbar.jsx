import { useState, useEffect } from 'react';
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
          {/* Logo - Always visible but smaller on mobile */}
          <Link to="/" className="navbar__brand" aria-label="MindCure home">
            <span className="navbar__logo">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: 'var(--color-primary-500)' }} fill="currentColor" />
            </span>
            <span className="navbar__title hidden xs:flex">
              <span>MindCure</span>
              <span className="hidden sm:block">THERAPY &amp; WELLNESS</span>
            </span>
          </Link>

          {/* Mobile: Dashboard + Hamburger only */}
          <div className="navbar__mobile-right lg:hidden">
            <Link
              to="/dashboard"
              className={`navbar__mobile-dashboard ${isActive('/dashboard') ? 'navbar__mobile-dashboard--active' : ''}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
            
            <button
              onClick={() => setIsOpen((open) => !open)}
              className="navbar__mobile-toggle"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
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
        </div>
      </div>

      {/* Mobile Slide-out Panel */}
      {isOpen && (
        <div 
          className="mobile-menu-overlay lg:hidden" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div 
        id="mobile-nav" 
        className={`mobile-menu-panel lg:hidden ${isOpen ? 'mobile-menu-panel--open' : ''}`}
      >
        <div className="mobile-menu-header">
          <h2 className="mobile-menu-title">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="mobile-menu-close"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <div className="mobile-menu-section">
            <span className="mobile-menu-section-title">Navigation</span>
            {commonNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-menu-link ${isActive(item.href) ? 'mobile-menu-link--active' : ''}`}
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
                className={`mobile-menu-link ${isActive(item.href) ? 'mobile-menu-link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mobile-menu-section">
            <span className="mobile-menu-section-title">Account</span>
            {currentUser && (
              <>
                {getRoleBadge() && (
                  <span className="mobile-menu-badge">
                    {getRoleBadge()}
                  </span>
                )}
                <Link 
                  to="/notifications" 
                  className="mobile-menu-link"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="mobile-menu-link"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>{accountLabel}</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="mobile-menu-section">
            <span className="mobile-menu-section-title">Help & Support</span>
            <Link 
              to="/crisis" 
              className="mobile-menu-link mobile-menu-link--crisis"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-5 w-5" />
              <span>Crisis Resources</span>
            </Link>
          </div>
        </nav>
        
        <div className="mobile-menu-footer">
          {currentUser ? (
            <button
              type="button"
              className="mobile-menu-logout"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              disabled={isSigningOut}
            >
              <LogOut className="h-5 w-5" />
              <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          ) : (
            <div className="mobile-menu-auth">
              <Link 
                to="/login" 
                className="btn btn--ghost w-full"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Sign in</span>
              </Link>
              <Link 
                to="/register" 
                className="btn btn--primary w-full"
                onClick={() => setIsOpen(false)}
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
