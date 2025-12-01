// Student Service - API calls for student dashboard

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
export const getStudentDashboard = async () => {
  const response = await fetch(`${API_BASE}/student/dashboard`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Resources
export const getResources = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/student/resources?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getResource = async (id) => {
  const response = await fetch(`${API_BASE}/student/resources/${id}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const toggleResourceLike = async (id) => {
  const response = await fetch(`${API_BASE}/student/resources/${id}/like`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Counselors
export const getCounselors = async () => {
  const response = await fetch(`${API_BASE}/student/counselors`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getAvailableSlots = async (counselorId, date) => {
  const params = new URLSearchParams({ counselorId, date });
  const response = await fetch(`${API_BASE}/student/counselors/slots?${params}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

// Appointments
export const getMyAppointments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/student/appointments?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const bookAppointment = async (data) => {
  const response = await fetch(`${API_BASE}/student/appointments`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const cancelAppointment = async (id, reason = '') => {
  const response = await fetch(`${API_BASE}/student/appointments/${id}/cancel`, {
    method: 'PATCH',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  return { data: await handleResponse(response) };
};

// Forum
export const getCategories = async () => {
  const response = await fetch(`${API_BASE}/student/forum/categories`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getPosts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/student/forum/posts?${queryString}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const getPost = async (id) => {
  const response = await fetch(`${API_BASE}/student/forum/posts/${id}`, {
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const createPost = async (data) => {
  const response = await fetch(`${API_BASE}/student/forum/posts`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return { data: await handleResponse(response) };
};

export const addComment = async (postId, content, isAnonymous = false) => {
  const response = await fetch(`${API_BASE}/student/forum/posts/${postId}/comments`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, isAnonymous })
  });
  return { data: await handleResponse(response) };
};

export const togglePostLike = async (id) => {
  const response = await fetch(`${API_BASE}/student/forum/posts/${id}/like`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE}/student/forum/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return { data: await handleResponse(response) };
};

export default {
  getStudentDashboard,
  getResources,
  getResource,
  toggleResourceLike,
  getCounselors,
  getAvailableSlots,
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getCategories,
  getPosts,
  getPost,
  createPost,
  addComment,
  togglePostLike,
  deletePost
};
