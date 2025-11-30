import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Heart, BookOpen, Phone } from 'lucide-react';

const items = [
  { label: 'Chat', to: '/chat', icon: MessageCircle },
  { label: 'Check-in', to: '/mood', icon: Heart },
  { label: 'Resources', to: '/resources', icon: BookOpen },
  { label: 'Crisis', to: '/crisis', icon: Phone }
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="floating-nav md:hidden" aria-label="Quick access">
      <div className="floating-nav__surface">
        <ul className="floating-nav__list">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="floating-nav__link"
                  data-active={active}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="floating-nav__icon">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
