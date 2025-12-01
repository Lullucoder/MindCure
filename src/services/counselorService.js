// Counselor Service - API calls for counselor dashboard

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

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

// Dashboard
export const getCounselorDashboard = async () => {
  const response = await fetch(`${API_BASE}/counselor/dashboard`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Resources
export const getMyResources = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/counselor/resources?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const createResource = async (data) => {
  const response = await fetch(`${API_BASE}/counselor/resources`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const updateResource = async (id, data) => {
  const response = await fetch(`${API_BASE}/counselor/resources/${id}`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const deleteResource = async (id) => {
  const response = await fetch(`${API_BASE}/counselor/resources/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Appointments
export const getCounselorAppointments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/counselor/appointments?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const confirmAppointment = async (id, data = {}) => {
  const response = await fetch(`${API_BASE}/counselor/appointments/${id}/confirm`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const completeAppointment = async (id, data = {}) => {
  const response = await fetch(`${API_BASE}/counselor/appointments/${id}/complete`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const cancelAppointmentAsCounselor = async (id, data = {}) => {
  const response = await fetch(`${API_BASE}/counselor/appointments/${id}/cancel`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

// Forum Moderation
export const getPostsForModeration = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/counselor/forum/moderation?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const moderatePost = async (id, action) => {
  const response = await fetch(`${API_BASE}/counselor/forum/moderation/${id}`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  return { data: await handleResponse(response) };
};

export const createCategory = async (data) => {
  const response = await fetch(`${API_BASE}/counselor/forum/categories`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

// Forum Access (same as students)
export const getCategories = async () => {
  const response = await fetch(`${API_BASE}/counselor/forum/categories`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getPosts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/counselor/forum/posts?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getPost = async (id) => {
  const response = await fetch(`${API_BASE}/counselor/forum/posts/${id}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const createPost = async (data) => {
  const response = await fetch(`${API_BASE}/counselor/forum/posts`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const addComment = async (postId, content, isAnonymous = false) => {
  const response = await fetch(`${API_BASE}/counselor/forum/posts/${postId}/comments`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, isAnonymous })
  });
  return { data: await handleResponse(response) };
};

export const togglePostLike = async (id) => {
  const response = await fetch(`${API_BASE}/counselor/forum/posts/${id}/like`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE}/counselor/forum/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Profile
export const updateAvailability = async (isAvailable) => {
  const response = await fetch(`${API_BASE}/counselor/availability`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAvailable })
  });
  return { data: await handleResponse(response) };
};

// Students
export const getStudents = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/counselor/students?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export default {
  getCounselorDashboard,
  getMyResources,
  createResource,
  updateResource,
  deleteResource,
  getCounselorAppointments,
  confirmAppointment,
  completeAppointment,
  cancelAppointmentAsCounselor,
  getPostsForModeration,
  moderatePost,
  createCategory,
  updateAvailability,
  getStudents,
  // Forum
  getCategories,
  getPosts,
  getPost,
  createPost,
  addComment,
  togglePostLike,
  deletePost
};
