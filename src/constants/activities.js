/**
 * Activity definitions for mood tracking
 * Centralized for consistency across components
 */

export const ACTIVITIES = [
  { name: 'Exercise', icon: '🏃‍♂️', category: 'physical' },
  { name: 'Meditation', icon: '🧘‍♀️', category: 'mindfulness' },
  { name: 'Reading', icon: '📚', category: 'leisure' },
  { name: 'Music', icon: '🎵', category: 'leisure' },
  { name: 'Friends', icon: '👥', category: 'social' },
  { name: 'Work/Study', icon: '📝', category: 'productivity' },
  { name: 'Sleep', icon: '😴', category: 'rest' },
  { name: 'Nature', icon: '🌳', category: 'outdoor' },
  { name: 'Cooking', icon: '🍳', category: 'self-care' },
  { name: 'Gaming', icon: '🎮', category: 'leisure' },
  { name: 'Walking', icon: '🚶', category: 'physical' },
  { name: 'Journaling', icon: '✍️', category: 'mindfulness' },
];

export const ACTIVITY_CATEGORIES = {
  physical: { label: 'Physical Activity', color: 'bg-green-100' },
  mindfulness: { label: 'Mindfulness', color: 'bg-purple-100' },
  leisure: { label: 'Leisure', color: 'bg-blue-100' },
  social: { label: 'Social', color: 'bg-pink-100' },
  productivity: { label: 'Productivity', color: 'bg-yellow-100' },
  rest: { label: 'Rest', color: 'bg-indigo-100' },
  outdoor: { label: 'Outdoor', color: 'bg-emerald-100' },
  'self-care': { label: 'Self-Care', color: 'bg-orange-100' },
};

export default ACTIVITIES;
