// Achievement Service - API calls for achievements and gamification
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mindcure-api.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('mental-health-app.auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API call failed');
  }

  return data;
};

const achievementService = {
  // Get all achievement definitions
  async getDefinitions() {
    try {
      const data = await apiCall('/achievements/definitions');
      return data; // Array of achievement definitions
    } catch (error) {
      console.error('Error getting achievement definitions:', error);
      throw error;
    }
  },

  // Get user's earned achievements
  async getMyAchievements() {
    try {
      const data = await apiCall('/achievements');
      return data; // { achievements: [], totalXP: number }
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  },

  // Get stats summary (moods fixed, streaks, etc.)
  async getStatsSummary() {
    try {
      const data = await apiCall('/achievements/stats');
      return data; // { moodsFixed, currentStreak, longestStreak, totalCheckIns, friendsHelped, totalXP }
    } catch (error) {
      console.error('Error getting stats summary:', error);
      throw error;
    }
  },

  // Get another user's public profile (achievements, stats)
  async getUserProfile(userId) {
    try {
      const data = await apiCall(`/achievements/user/${userId}`);
      return data; // { user: {name, avatar}, achievements: [], stats: {} }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Helper: Get achievement icon based on achievementId
  getAchievementIcon(achievementId) {
    const icons = {
      'first-checkin': '🎯',
      'streak-7': '🔥',
      'streak-30': '🏆',
      'mood-helper-1': '💪',
      'mood-helper-5': '🤝',
      'mood-helper-10': '👑',
      'community-first-post': '📝',
      'community-10-posts': '⭐',
      'first-message': '💬',
      'first-friend': '🤗',
    };
    return icons[achievementId] || '🏅';
  },

  // Helper: Get achievement color based on XP value
  getAchievementTier(xp) {
    if (xp >= 150) return { tier: 'gold', color: '#FFD700' };
    if (xp >= 50) return { tier: 'silver', color: '#C0C0C0' };
    return { tier: 'bronze', color: '#CD7F32' };
  },

  // Helper: Format achievement for display
  formatAchievement(achievement) {
    return {
      ...achievement,
      icon: this.getAchievementIcon(achievement.achievementId),
      tier: this.getAchievementTier(achievement.xp),
      earnedDate: achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : null,
    };
  },
};

export default achievementService;
