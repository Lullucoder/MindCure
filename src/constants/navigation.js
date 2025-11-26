import { MessageCircle, BookOpen, Heart, Phone, BarChart3, User } from 'lucide-react';

/**
 * Main navigation items
 */
export const MAIN_NAV_ITEMS = [
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Check-in', href: '/mood', icon: Heart },
  { name: 'Resources', href: '/resources', icon: BookOpen },
];

/**
 * Bottom navigation items (mobile)
 */
export const BOTTOM_NAV_ITEMS = [
  { name: 'Home', href: '/dashboard', icon: BarChart3 },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Mood', href: '/mood', icon: Heart },
  { name: 'Help', href: '/resources', icon: BookOpen },
];

/**
 * User menu items
 */
export const USER_MENU_ITEMS = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: null },
];

/**
 * Crisis-related routes
 */
export const CRISIS_ROUTES = {
  main: '/crisis',
  hotline: 'tel:988',
  text: 'sms:741741',
};

export default MAIN_NAV_ITEMS;
