import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Menu,
  X,
  MessageCircle,
  BookOpen,
  Phone,
  User,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'AI Chat', href: '/chat', icon: MessageCircle },
    { name: 'Check-in', href: '/mood', icon: User },
    { name: 'Resources', href: '/resources', icon: BookOpen }
  ];

  const isActive = (path) => location.pathname === path;

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
            {navigation.map((item) => (
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
            <Link to="/crisis" className="btn btn--secondary" aria-label="Crisis resources">
              <Phone className="h-4 w-4" />
              <span>Crisis</span>
            </Link>
            <Link to="/dashboard" className="btn btn--primary">
              <Sparkles className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
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
            {navigation.map((item) => (
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
            <Link to="/crisis" className="btn btn--secondary" onClick={() => setIsOpen(false)}>
              <Phone className="h-4 w-4" />
              <span>Crisis resources</span>
            </Link>
            <Link to="/dashboard" className="btn btn--primary" onClick={() => setIsOpen(false)}>
              <Sparkles className="h-4 w-4" />
              <span>Enter app</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;