// Mood Service - API calls for mood tracking
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

const moodService = {
  // Check if user has checked in today
  async hasCheckedInToday() {
    try {
      const data = await apiCall('/mood/today');
      // Map backend fields to frontend expected format
      if (data.todaysEntry) {
        data.todaysEntry.score = data.todaysEntry.moodScore;
        data.todaysEntry.mood = data.todaysEntry.moodLabel?.replace('-', '') || this.scoreToMood(data.todaysEntry.moodScore);
      }
      return data; // { hasCheckedIn: boolean, todaysEntry: MoodEntry | null }
    } catch (error) {
      console.error('Error checking today\'s mood:', error);
      throw error;
    }
  },

  // Daily mood check-in (create new entry)
  async checkIn(moodData) {
    try {
      // moodData: { score: 1-5, mood: 'great'|'good'|'okay'|'low'|'struggling', tags: [], activities: [], notes: '' }
      const data = await apiCall('/mood/checkin', {
        method: 'POST',
        body: JSON.stringify({
          moodScore: moodData.score,
          notes: moodData.notes,
          factors: [...(moodData.tags || []), ...(moodData.activities || [])]
        }),
      });
      return data; // { moodEntry, newAchievements: [] }
    } catch (error) {
      console.error('Error checking in mood:', error);
      throw error;
    }
  },

  // Update today's mood (if already checked in)
  async updateTodaysMood(moodData) {
    try {
      const data = await apiCall('/mood/today', {
        method: 'PATCH',
        body: JSON.stringify({
          moodScore: moodData.score,
          notes: moodData.notes,
          factors: [...(moodData.tags || []), ...(moodData.activities || [])],
          reason: 'Feeling better'
        }),
      });
      return data; // { moodEntry, previousMood, friendsNotified }
    } catch (error) {
      console.error('Error updating today\'s mood:', error);
      throw error;
    }
  },

  // Get mood history
  async getHistory(days = 30) {
    try {
      const data = await apiCall(`/mood/history?days=${days}`);
      return data; // { entries: MoodEntry[], count: number }
    } catch (error) {
      console.error('Error getting mood history:', error);
      throw error;
    }
  },

  // Get mood statistics
  async getStats() {
    try {
      const data = await apiCall('/mood/stats');
      return data; // { averageMood, moodDistribution, currentStreak, longestStreak, weeklyPattern, monthlyTrend }
    } catch (error) {
      console.error('Error getting mood stats:', error);
      throw error;
    }
  },

  // ========== LEGACY METHODS (for backward compatibility) ==========

  // Legacy: Add mood entry (maps to checkIn)
  async addMoodEntry(userId, moodData) {
    // Map old format to new format
    const newMoodData = {
      score: moodData.mood, // Old format used 'mood' as the score
      mood: this.scoreToMood(moodData.mood),
      tags: moodData.tags || [],
      notes: moodData.notes || '',
      activities: [],
    };
    
    const result = await this.checkIn(newMoodData);
    return result.moodEntry;
  },

  // Legacy: Get user mood entries (maps to getHistory)
  async getUserMoodEntries(userId, limitCount = 30) {
    const result = await this.getHistory(limitCount);
    return result.entries.map(entry => ({
      id: entry._id,
      userId: entry.user,
      mood: entry.score,
      energy: 3, // Default
      anxiety: 3, // Default
      sleep: 3, // Default
      notes: entry.notes,
      tags: entry.tags,
      timestamp: entry.date,
      createdAt: entry.createdAt,
    }));
  },

  // Legacy: Delete mood entry (not supported by new API)
  async deleteMoodEntry(userId, entryId) {
    console.warn('Delete mood entry is not supported in the new API');
    return false;
  },

  // Legacy: Get mood statistics
  async getMoodStatistics(userId, days = 30) {
    try {
      const stats = await this.getStats();
      return {
        averageMood: stats.averageMood || 0,
        averageEnergy: 3,
        averageAnxiety: 3,
        averageSleep: 3,
        totalEntries: stats.totalEntries || 0,
        moodTrend: stats.monthlyTrend?.trend || 'stable',
        bestDay: null,
        worstDay: null,
        currentStreak: stats.currentStreak || 0,
        commonTags: [],
      };
    } catch (error) {
      console.error('Error getting mood statistics:', error);
      return {
        averageMood: 0,
        averageEnergy: 0,
        averageAnxiety: 0,
        averageSleep: 0,
        totalEntries: 0,
        moodTrend: 'stable',
        bestDay: null,
        worstDay: null,
        currentStreak: 0,
        commonTags: [],
      };
    }
  },

  // Legacy: Get mood insights
  async getMoodInsights(userId) {
    try {
      const stats = await this.getStats();
      const insights = [];

      if (stats.monthlyTrend?.trend === 'improving') {
        insights.push({
          type: 'trend',
          title: 'Positive Trend! 📈',
          message: `Your mood has been improving. Average: ${stats.averageMood?.toFixed(1)}/5`,
          suggestion: 'Keep up the great work! Note what activities help your mood.',
        });
      } else if (stats.monthlyTrend?.trend === 'declining') {
        insights.push({
          type: 'trend',
          title: 'Mood Declining 📉',
          message: `Your mood has been lower recently. Average: ${stats.averageMood?.toFixed(1)}/5`,
          suggestion: 'Consider talking to someone or practicing self-care.',
        });
      }

      if (stats.currentStreak >= 7) {
        insights.push({
          type: 'achievement',
          title: 'Great Streak! 🔥',
          message: `You've checked in ${stats.currentStreak} days in a row!`,
          suggestion: 'Keep the momentum going!',
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating mood insights:', error);
      return [];
    }
  },

  // Helper: Convert score (1-5) to mood string
  scoreToMood(score) {
    const moods = {
      1: 'struggling',
      2: 'low',
      3: 'okay',
      4: 'good',
      5: 'great',
    };
    return moods[score] || 'okay';
  },

  // Helper: Convert mood string to score (1-5)
  moodToScore(mood) {
    const scores = {
      'struggling': 1,
      'low': 2,
      'okay': 3,
      'good': 4,
      'great': 5,
    };
    return scores[mood] || 3;
  },
};

export default moodService;