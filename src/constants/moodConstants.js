// Shared mood tracking constants
// Used by both MoodCheckInModal and MoodTracker page

export const MOOD_OPTIONS = [
  { score: 5, mood: 'great', label: 'Great', emoji: '😄', color: 'bg-green-500', textColor: 'text-green-500', description: 'Feeling fantastic!' },
  { score: 4, mood: 'good', label: 'Good', emoji: '🙂', color: 'bg-blue-500', textColor: 'text-blue-500', description: 'Pretty good day' },
  { score: 3, mood: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-500', textColor: 'text-yellow-500', description: 'Just okay' },
  { score: 2, mood: 'low', label: 'Low', emoji: '😔', color: 'bg-orange-500', textColor: 'text-orange-500', description: 'Not my best' },
  { score: 1, mood: 'struggling', label: 'Struggling', emoji: '😢', color: 'bg-red-500', textColor: 'text-red-500', description: 'Having a hard time' },
];

export const ACTIVITY_OPTIONS = [
  { id: 'exercise', label: 'Exercise', emoji: '🏃' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'socializing', label: 'Socializing', emoji: '👥' },
  { id: 'work', label: 'Work/Study', emoji: '💼' },
  { id: 'nature', label: 'Nature', emoji: '🌳' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'rest', label: 'Resting', emoji: '😴' },
];

export const TAG_OPTIONS = [
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-purple-100 text-purple-700' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-700' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: 'bg-gray-100 text-gray-700' },
  { id: 'motivated', label: 'Motivated', emoji: '💪', color: 'bg-green-100 text-green-700' },
  { id: 'stressed', label: 'Stressed', emoji: '😤', color: 'bg-red-100 text-red-700' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-pink-100 text-pink-700' },
  { id: 'lonely', label: 'Lonely', emoji: '😔', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-amber-100 text-amber-700' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-slate-100 text-slate-700' },
];

// Helper functions
export const getMoodByScore = (score) => {
  return MOOD_OPTIONS.find(m => m.score === score) || MOOD_OPTIONS[2]; // Default to 'okay'
};

export const getMoodEmoji = (score) => {
  const mood = getMoodByScore(score);
  return mood?.emoji || '😐';
};

export const getMoodLabel = (score) => {
  const mood = getMoodByScore(score);
  return mood?.label || 'Okay';
};

export const getMoodColor = (score) => {
  const mood = getMoodByScore(score);
  return mood?.color || 'bg-yellow-500';
};

export const getMoodTextColor = (score) => {
  const mood = getMoodByScore(score);
  return mood?.textColor || 'text-yellow-500';
};
