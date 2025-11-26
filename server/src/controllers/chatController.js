import { ChatConversation } from '../models/ChatConversation.js';

// ==================== CONVERSATIONS ====================

// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status = 'active' } = req.query;

    const result = await ChatConversation.getUserConversations(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });

    res.json(result);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

// Get a single conversation with all messages
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await ChatConversation.findOne({
      _id: id,
      user: userId,
      status: { $ne: 'deleted' }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, moodAtStart } = req.body;

    const conversation = new ChatConversation({
      user: userId,
      title: title || 'New Conversation',
      moodAtStart: moodAtStart || undefined
    });

    await conversation.save();

    res.status(201).json({ 
      message: 'Conversation created',
      conversation 
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
};

// Add a message to a conversation
export const addMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { role, content, metadata } = req.body;

    if (!role || !content) {
      return res.status(400).json({ message: 'Role and content are required' });
    }

    let conversation = await ChatConversation.findOne({
      _id: id,
      user: userId,
      status: 'active'
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    await conversation.addMessage(role, content, metadata || {});

    res.json({ 
      message: 'Message added',
      conversation
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Failed to add message' });
  }
};

// Update conversation (title, status, mood, etc.)
export const updateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, status, moodAtEnd, summary, wasEscalated } = req.body;

    const conversation = await ChatConversation.findOne({
      _id: id,
      user: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (title) conversation.title = title;
    if (status) conversation.status = status;
    if (moodAtEnd !== undefined) conversation.moodAtEnd = moodAtEnd;
    if (summary) conversation.summary = summary;
    if (wasEscalated !== undefined) {
      conversation.wasEscalated = wasEscalated;
      if (wasEscalated) conversation.escalatedAt = new Date();
    }

    await conversation.save();

    res.json({ 
      message: 'Conversation updated',
      conversation 
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ message: 'Failed to update conversation' });
  }
};

// Delete (archive) a conversation
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await ChatConversation.findOne({
      _id: id,
      user: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.status = 'deleted';
    await conversation.save();

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Failed to delete conversation' });
  }
};

// Get or create active conversation for chat
export const getOrCreateActiveConversation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Try to find the most recent active conversation
    let conversation = await ChatConversation.findOne({
      user: userId,
      status: 'active'
    }).sort({ lastMessageAt: -1 });

    // If no active conversation exists, create one
    if (!conversation) {
      conversation = new ChatConversation({
        user: userId,
        title: 'New Conversation'
      });
      await conversation.save();
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get/create conversation error:', error);
    res.status(500).json({ message: 'Failed to get or create conversation' });
  }
};

// Get chat history for AI context (recent messages across conversations)
export const getChatContext = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageCount = 20 } = req.query;

    // Get recent conversations
    const conversations = await ChatConversation.find({
      user: userId,
      status: { $ne: 'deleted' }
    })
      .sort({ lastMessageAt: -1 })
      .limit(5)
      .select('messages summary title');

    // Flatten and get recent messages
    const allMessages = [];
    for (const conv of conversations) {
      for (const msg of conv.messages.slice(-10)) {
        allMessages.push({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          conversationId: conv._id
        });
      }
    }

    // Sort by timestamp and take most recent
    allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentMessages = allMessages.slice(0, parseInt(messageCount));

    res.json({ 
      messages: recentMessages.reverse(),
      conversationCount: conversations.length
    });
  } catch (error) {
    console.error('Get chat context error:', error);
    res.status(500).json({ message: 'Failed to fetch chat context' });
  }
};
