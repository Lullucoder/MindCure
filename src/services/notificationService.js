// Notification Service - API calls for notifications
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

const notificationService = {
  // Get all notifications (paginated)
  async getNotifications(page = 1, limit = 20) {
    try {
      const data = await apiCall(`/notifications?page=${page}&limit=${limit}`);
      return data; // { notifications: [], pagination: { page, limit, total, pages } }
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Get unread notification count
  async getUnreadCount() {
    try {
      const data = await apiCall('/notifications/unread-count');
      return data; // { count: number }
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { count: 0 };
    }
  },

  // Mark a single notification as read
  async markAsRead(notificationId) {
    try {
      const data = await apiCall(`/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const data = await apiCall('/notifications/read-all', {
        method: 'PUT',
      });
      return data; // { modifiedCount: number }
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const data = await apiCall(`/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Helper: Get notification icon based on type
  getNotificationIcon(type) {
    const icons = {
      'friend_request': '👋',
      'friend_accepted': '🤝',
      'mood_alert': '💙',
      'achievement': '🏆',
      'message': '💬',
      'system': '📢',
    };
    return icons[type] || '🔔';
  },

  // Helper: Get notification color based on type
  getNotificationColor(type) {
    const colors = {
      'friend_request': '#3B82F6', // blue
      'friend_accepted': '#10B981', // green
      'mood_alert': '#F59E0B', // amber
      'achievement': '#8B5CF6', // purple
      'message': '#06B6D4', // cyan
      'system': '#6B7280', // gray
    };
    return colors[type] || '#6B7280';
  },

  // Helper: Format time ago
  formatTimeAgo(date) {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  },

  // Helper: Format notification for display
  formatNotification(notification) {
    return {
      ...notification,
      icon: this.getNotificationIcon(notification.type),
      color: this.getNotificationColor(notification.type),
      timeAgo: this.formatTimeAgo(notification.createdAt),
    };
  },
};

export default notificationService;
