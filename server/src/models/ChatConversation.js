import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // For analytics - track message sentiment/topics
  metadata: {
    sentiment: String,  // positive, negative, neutral
    topics: [String],   // anxiety, depression, stress, etc.
    isEmergency: Boolean
  }
}, { _id: true });

const chatConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: 200
  },
  messages: [messageSchema],
  // Conversation summary for context
  summary: {
    type: String,
    maxlength: 1000
  },
  // Track conversation state
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  // Track if conversation was escalated to counselor
  wasEscalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: Date,
  // Track mood at start/end of conversation
  moodAtStart: {
    type: Number,
    min: 1,
    max: 10
  },
  moodAtEnd: {
    type: Number,
    min: 1,
    max: 10
  },
  // Last activity timestamp
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatConversationSchema.index({ user: 1, status: 1, lastMessageAt: -1 });
chatConversationSchema.index({ user: 1, createdAt: -1 });

// Virtual for message count
chatConversationSchema.virtual('messageCount').get(function() {
  return this.messages?.length || 0;
});

// Method to get last N messages for context
chatConversationSchema.methods.getRecentMessages = function(count = 10) {
  return this.messages.slice(-count);
};

// Method to add a message
chatConversationSchema.methods.addMessage = async function(role, content, metadata = {}) {
  this.messages.push({ role, content, metadata });
  this.lastMessageAt = new Date();
  
  // Auto-generate title from first user message if not set
  if (this.title === 'New Conversation' && role === 'user' && this.messages.length <= 2) {
    this.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
  }
  
  return this.save();
};

// Static method to get user's conversations with pagination
chatConversationSchema.statics.getUserConversations = async function(userId, options = {}) {
  const { page = 1, limit = 20, status = 'active' } = options;
  
  const query = { user: userId };
  if (status !== 'all') {
    query.status = status;
  }
  
  const total = await this.countDocuments(query);
  const conversations = await this.find(query)
    .select('title status lastMessageAt createdAt moodAtStart moodAtEnd messageCount')
    .sort({ lastMessageAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    conversations,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);
