import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getConversations,
  getConversation,
  createConversation,
  addMessage,
  updateConversation,
  deleteConversation,
  getOrCreateActiveConversation,
  getChatContext
} from '../controllers/chatController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get chat context for AI (recent messages across conversations)
router.get('/context', getChatContext);

// Get or create active conversation
router.get('/active', getOrCreateActiveConversation);

// Get all conversations
router.get('/', getConversations);

// Create a new conversation
router.post('/', createConversation);

// Get a specific conversation
router.get('/:id', getConversation);

// Update a conversation
router.put('/:id', updateConversation);

// Delete (archive) a conversation
router.delete('/:id', deleteConversation);

// Add a message to a conversation
router.post('/:id/messages', addMessage);

export default router;
