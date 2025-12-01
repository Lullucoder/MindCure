// User Profile Service - API calls for viewing other users' profiles
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mindcure-api.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('mindcure.auth');
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

const userProfileService = {
  // Get a user's public profile
  async getUserProfile(userId) {
    try {
      const data = await apiCall(`/users/${userId}`);
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Get a user's mood history (requires friendship)
  async getUserMoodHistory(userId) {
    try {
      const data = await apiCall(`/users/${userId}/mood-history`);
      return data;
    } catch (error) {
      console.error('Error getting user mood history:', error);
      return { moodHistory: [] };
    }
  },

  // Search for users
  async searchUsers(query) {
    try {
      const data = await apiCall(`/users/search?q=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      return { users: [] };
    }
  },

  // Get all students (for counselors)
  async getAllStudents(page = 1, limit = 20) {
    try {
      const data = await apiCall(`/users/students?page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Error getting students:', error);
      return { students: [], pagination: {} };
    }
  }
};

export default userProfileService;
