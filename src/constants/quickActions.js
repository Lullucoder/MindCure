import { MessageCircle, BookOpen, Users, Phone } from 'lucide-react';

/**
 * Quick action cards for Dashboard
 */
export const DASHBOARD_QUICK_ACTIONS = [
  {
    title: 'Virtual Counseling',
    description: 'Book a session with professional counselors',
    icon: MessageCircle,
    link: '/chat',
    gradient: 'from-primary-400 to-primary-500',
    bgColor: 'bg-gradient-to-br from-primary-50/80 to-primary-100/60',
    iconColor: 'text-primary-600',
  },
  {
    title: 'Self-Help Library',
    description: 'Access mindfulness and stress resources',
    icon: BookOpen,
    link: '/resources',
    gradient: 'from-secondary-400 to-secondary-500',
    bgColor: 'bg-gradient-to-br from-secondary-50/80 to-secondary-100/60',
    iconColor: 'text-secondary-600',
  },
  {
    title: 'Peer Support Groups',
    description: 'Connect with others in safe forums',
    icon: Users,
    link: '/mood',
    gradient: 'from-primary-400 via-secondary-400 to-accent-400',
    bgColor: 'bg-gradient-to-br from-primary-50/80 to-secondary-50/60',
    iconColor: 'text-primary-600',
  },
  {
    title: 'Crisis Support',
    description: 'Get immediate help when you need it',
    icon: Phone,
    link: '/crisis',
    gradient: 'from-accent-400 to-accent-500',
    bgColor: 'bg-gradient-to-br from-accent-50/80 to-accent-100/60',
    iconColor: 'text-accent-600',
  },
];

/**
 * Landing page hero shortcuts
 */
export const HERO_SHORTCUTS = [
  {
    to: '/chat',
    icon: MessageCircle,
    label: 'AI chat',
    gradient: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500))',
  },
  {
    to: '/mood',
    icon: MessageCircle, // Will be replaced with Heart in component
    label: 'Mood log',
    gradient: 'linear-gradient(135deg, var(--color-emerald-400), var(--color-emerald-500))',
  },
  {
    to: '/resources',
    icon: BookOpen,
    label: 'Resources',
    gradient: 'linear-gradient(135deg, var(--color-primary-400), var(--color-emerald-400))',
  },
  {
    to: '/crisis',
    icon: Phone,
    label: 'Crisis help',
    gradient: 'linear-gradient(135deg, var(--color-coral-400), var(--color-coral-500))',
  },
];

export default DASHBOARD_QUICK_ACTIONS;
