import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
} from '../controllers/messageController.js';

const messageRouter = Router();

// All routes require authentication
messageRouter.use(requireAuth);

// Get all conversations
messageRouter.get('/conversations', getConversations);

// Get/create conversation with a user
messageRouter.get('/conversations/user/:participantId', getOrCreateConversation);

// Get messages for a conversation
messageRouter.get('/conversations/:conversationId/messages', getMessages);

// Send a message
messageRouter.post('/conversations/:conversationId/messages', sendMessage);

// Mark messages as read
messageRouter.patch('/conversations/:conversationId/read', markAsRead);

// Get total unread count
messageRouter.get('/unread-count', getUnreadCount);

export default messageRouter;
