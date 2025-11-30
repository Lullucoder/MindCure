import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// Get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
      .populate('participants', 'firstName lastName email role')
      .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 });

    // Format response with other participant info
    const formatted = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== userId.toString()
      );
      return {
        _id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount.get(userId.toString()) || 0,
        updatedAt: conv.updatedAt
      };
    });

    res.json({ conversations: formatted });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

// Get or create a conversation with another user
export const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantId } = req.params;

    if (userId === participantId) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversation = await Conversation.findOrCreateConversation(userId, participantId);
    await conversation.populate('participants', 'firstName lastName email role');

    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== userId.toString()
    );

    res.json({
      conversation: {
        _id: conversation._id,
        participant: otherParticipant,
        messages: conversation.messages.slice(-50), // Last 50 messages
        unreadCount: conversation.unreadCount.get(userId.toString()) || 0
      }
    });
  } catch (error) {
    console.error('Get/Create conversation error:', error);
    res.status(500).json({ message: 'Failed to get conversation' });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { before, limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    }).populate('messages.sender', 'firstName lastName');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    let messages = conversation.messages.filter(m => !m.isDeleted);
    
    if (before) {
      const beforeDate = new Date(before);
      messages = messages.filter(m => m.createdAt < beforeDate);
    }

    // Get last N messages
    messages = messages.slice(-parseInt(limit));

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = {
      sender: userId,
      content: content.trim(),
      createdAt: new Date()
    };

    conversation.messages.push(message);
    conversation.lastMessage = {
      content: content.trim().substring(0, 100),
      sender: userId,
      createdAt: new Date()
    };

    // Update unread count for other participant
    const otherParticipantId = conversation.participants.find(
      p => p.toString() !== userId.toString()
    );
    const currentUnread = conversation.unreadCount.get(otherParticipantId.toString()) || 0;
    conversation.unreadCount.set(otherParticipantId.toString(), currentUnread + 1);

    await conversation.save();

    // Create notification for recipient
    const sender = await User.findById(userId);
    await Notification.notify({
      recipient: otherParticipantId,
      type: 'new-message',
      title: 'New Message',
      message: `${sender.firstName} sent you a message`,
      relatedUser: userId,
      relatedEntity: {
        entityType: 'conversation',
        entityId: conversation._id
      }
    });

    // Get the added message with populated sender
    const addedMessage = conversation.messages[conversation.messages.length - 1];

    res.status(201).json({
      message: {
        _id: addedMessage._id,
        sender: { _id: userId, firstName: sender.firstName, lastName: sender.lastName },
        content: addedMessage.content,
        createdAt: addedMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Mark all unread messages from other users as read
    const now = new Date();
    conversation.messages.forEach(msg => {
      if (msg.sender.toString() !== userId.toString() && !msg.readAt) {
        msg.readAt = now;
      }
    });

    // Reset unread count for current user
    conversation.unreadCount.set(userId.toString(), 0);

    await conversation.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};

// Get total unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      totalUnread += conv.unreadCount.get(userId.toString()) || 0;
    });

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};
