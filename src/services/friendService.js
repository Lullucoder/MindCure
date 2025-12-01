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

// Get all friends
export const getFriends = async () => {
  const response = await fetch(`${API_BASE}/friends`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch friends');
  return response.json();
};

// Get pending friend requests (received)
export const getPendingRequests = async () => {
  const response = await fetch(`${API_BASE}/friends/requests/pending`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch pending requests');
  return response.json();
};

// Get sent friend requests
export const getSentRequests = async () => {
  const response = await fetch(`${API_BASE}/friends/requests/sent`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch sent requests');
  return response.json();
};

// Check friendship status with a user
export const checkFriendshipStatus = async (targetUserId) => {
  const response = await fetch(`${API_BASE}/friends/status/${targetUserId}`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to check friendship status');
  return response.json();
};

// Send friend request
export const sendFriendRequest = async (recipientId) => {
  const response = await fetch(`${API_BASE}/friends/request/${recipientId}`, {
    method: 'POST',
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send friend request');
  }
  return response.json();
};

// Accept friend request
export const acceptFriendRequest = async (friendshipId) => {
  const response = await fetch(`${API_BASE}/friends/accept/${friendshipId}`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to accept friend request');
  return response.json();
};

// Reject friend request
export const rejectFriendRequest = async (friendshipId) => {
  const response = await fetch(`${API_BASE}/friends/reject/${friendshipId}`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to reject friend request');
  return response.json();
};

// Remove friend
export const removeFriend = async (friendId) => {
  const response = await fetch(`${API_BASE}/friends/${friendId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to remove friend');
  return response.json();
};

// Search for users by name or email
export const searchUsers = async (query) => {
  const response = await fetch(`${API_BASE}/friends/search?q=${encodeURIComponent(query)}`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to search users');
  return response.json();
};

// Alias functions for component compatibility
export const sendRequest = sendFriendRequest;
export const acceptRequest = acceptFriendRequest;
export const rejectRequest = rejectFriendRequest;
export const getStatus = checkFriendshipStatus;

export default {
  getFriends,
  getPendingRequests,
  getSentRequests,
  checkFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  // Aliases
  sendRequest: sendFriendRequest,
  acceptRequest: acceptFriendRequest,
  rejectRequest: rejectFriendRequest,
  getStatus: checkFriendshipStatus
};
