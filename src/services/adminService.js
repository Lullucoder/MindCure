// Admin Service - API calls for admin panel

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'mental-health-app.auth';

const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

export const adminService = {
  // Get dashboard stats
  async getDashboardStats() {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Get all users
  async getUsers(options = {}) {
    const params = new URLSearchParams();
    if (options.role) params.append('role', options.role);
    if (options.search) params.append('search', options.search);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const response = await fetch(`${API_BASE}/admin/users?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Update user role
  async updateUserRole(userId, role) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },

  // Get all appointments
  async getAppointments(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.page) params.append('page', options.page);

    const response = await fetch(`${API_BASE}/admin/appointments?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  // ==================== RESOURCES ====================

  async getResources(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.type) params.append('type', options.type);
    if (options.isPublished !== undefined) params.append('isPublished', options.isPublished);
    if (options.page) params.append('page', options.page);

    const response = await fetch(`${API_BASE}/admin/resources?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch resources');
    return response.json();
  },

  async createResource(data) {
    const response = await fetch(`${API_BASE}/admin/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return response.json();
  },

  async updateResource(resourceId, data) {
    const response = await fetch(`${API_BASE}/admin/resources/${resourceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update resource');
    return response.json();
  },

  async deleteResource(resourceId) {
    const response = await fetch(`${API_BASE}/admin/resources/${resourceId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete resource');
    return response.json();
  },

  // ==================== FORUM MODERATION ====================

  async getPostsForModeration(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.page) params.append('page', options.page);

    const response = await fetch(`${API_BASE}/forum/moderation/posts?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async moderatePost(postId, action, reason = '') {
    const response = await fetch(`${API_BASE}/forum/moderation/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ action, reason })
    });
    if (!response.ok) throw new Error('Failed to moderate post');
    return response.json();
  },

  // ==================== CATEGORIES ====================

  async createCategory(data) {
    const response = await fetch(`${API_BASE}/forum/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  async updateCategory(categoryId, data) {
    const response = await fetch(`${API_BASE}/admin/categories/${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  async deleteCategory(categoryId) {
    const response = await fetch(`${API_BASE}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  },

  // ==================== FORUM ACCESS ====================

  async getCategories() {
    const response = await fetch(`${API_BASE}/admin/forum/categories`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getPosts(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const response = await fetch(`${API_BASE}/admin/forum/posts?${params}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async getPost(postId) {
    const response = await fetch(`${API_BASE}/admin/forum/posts/${postId}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  async createPost(data) {
    const response = await fetch(`${API_BASE}/admin/forum/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  async addComment(postId, content, isAnonymous = false) {
    const response = await fetch(`${API_BASE}/admin/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ content, isAnonymous })
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  async togglePostLike(postId) {
    const response = await fetch(`${API_BASE}/admin/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  },

  async deletePost(postId) {
    const response = await fetch(`${API_BASE}/admin/forum/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  }
};

export default adminService;
