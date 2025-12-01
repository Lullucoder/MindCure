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

// Conversations
export const getConversations = async () => {
  const response = await fetch(`${API_BASE}/messages/conversations`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
};

export const getOrCreateConversation = async (participantId) => {
  const response = await fetch(`${API_BASE}/messages/conversations/user/${participantId}`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to get conversation');
  return response.json();
};

export const getMessages = async (conversationId, before = null, limit = 50) => {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (before) params.append('before', before);
  
  const response = await fetch(`${API_BASE}/messages/conversations/${conversationId}/messages?${params}`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const sendMessage = async (conversationId, content) => {
  const response = await fetch(`${API_BASE}/messages/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ content })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const markMessagesAsRead = async (conversationId) => {
  const response = await fetch(`${API_BASE}/messages/conversations/${conversationId}/read`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to mark as read');
  return response.json();
};

export const getUnreadMessageCount = async () => {
  const response = await fetch(`${API_BASE}/messages/unread-count`, {
    headers: { ...getAuthHeader() }
  });
  if (!response.ok) throw new Error('Failed to get unread count');
  return response.json();
};

export default {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  markAsRead: markMessagesAsRead, // alias
  getUnreadMessageCount
};
