import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'friend-request',
      'friend-accepted',
      'friend-low-mood',
      'new-message',
      'achievement-unlocked',
      'mood-improved',
      'appointment-reminder',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  // Reference to related entity
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['conversation', 'friendship', 'mood', 'achievement', 'appointment']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Static method to create and return a notification
notificationSchema.statics.notify = async function(data) {
  const notification = await this.create(data);
  return notification.populate('relatedUser', 'firstName lastName');
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

export const Notification = mongoose.model('Notification', notificationSchema);
