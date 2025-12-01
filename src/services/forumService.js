// Forum Service - API calls for support groups/forum

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'mindcure.auth';

const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

export const forumService = {
  // Get all categories
  async getCategories() {
    const response = await fetch(`${API_BASE}/forum/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Get posts with filters
  async getPosts(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sort) params.append('sort', options.sort);

    const response = await fetch(`${API_BASE}/forum/posts?${params}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  // Get single post with comments
  async getPost(postId) {
    const response = await fetch(`${API_BASE}/forum/posts/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  // Create a new post
  async createPost(data) {
    const response = await fetch(`${API_BASE}/forum/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create post');
    }
    return response.json();
  },

  // Add comment to post
  async addComment(postId, data) {
    const response = await fetch(`${API_BASE}/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  // Like/unlike post
  async toggleLike(postId) {
    const response = await fetch(`${API_BASE}/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to update like');
    return response.json();
  },

  // Delete post
  async deletePost(postId) {
    const response = await fetch(`${API_BASE}/forum/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  }
};

export default forumService;
