/**
 * Emotion definitions used throughout the app
 * Centralized for consistency and easy updates
 */

export const EMOTIONS = [
  { name: 'Happy', icon: '😊', color: 'bg-yellow-100 text-yellow-700', value: 'happy' },
  { name: 'Sad', icon: '😢', color: 'bg-blue-100 text-blue-700', value: 'sad' },
  { name: 'Anxious', icon: '😰', color: 'bg-purple-100 text-purple-700', value: 'anxious' },
  { name: 'Calm', icon: '😌', color: 'bg-green-100 text-green-700', value: 'calm' },
  { name: 'Excited', icon: '🤩', color: 'bg-orange-100 text-orange-700', value: 'excited' },
  { name: 'Frustrated', icon: '😤', color: 'bg-red-100 text-red-700', value: 'frustrated' },
  { name: 'Grateful', icon: '🙏', color: 'bg-pink-100 text-pink-700', value: 'grateful' },
  { name: 'Lonely', icon: '😔', color: 'bg-gray-100 text-gray-700', value: 'lonely' },
  { name: 'Hopeful', icon: '🌟', color: 'bg-amber-100 text-amber-700', value: 'hopeful' },
  { name: 'Overwhelmed', icon: '😵', color: 'bg-indigo-100 text-indigo-700', value: 'overwhelmed' },
];

export const MOOD_EMOJIS = ['😢', '😞', '😐', '😊', '😃'];

export const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

/**
 * Get emoji for a mood rating (1-5)
 */
export const getMoodEmoji = (mood) => {
  return MOOD_EMOJIS[Math.floor(mood) - 1] || '😐';
};

/**
 * Get color class for a mood rating
 */
export const getMoodColor = (mood) => {
  if (mood >= 4) return 'text-green-500';
  if (mood >= 3) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Get background color class for a mood rating
 */
export const getMoodBgColor = (mood) => {
  if (mood >= 4) return 'bg-green-50 border-green-200';
  if (mood >= 3) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

export default EMOTIONS;
