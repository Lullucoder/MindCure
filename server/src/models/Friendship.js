import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  // Custom name for the connection (e.g., "Support Circle", "Buddy")
  connectionType: {
    type: String,
    default: 'support-buddy'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique friendships
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });

// Static method to check if two users are friends
friendshipSchema.statics.areFriends = async function(userId1, userId2) {
  const friendship = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });
  return !!friendship;
};

// Static method to get all friends of a user
friendshipSchema.statics.getFriends = async function(userId) {
  const friendships = await this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester recipient', 'firstName lastName email role');

  return friendships.map(f => {
    const friend = f.requester._id.toString() === userId.toString() 
      ? f.recipient 
      : f.requester;
    return {
      friendshipId: f._id,
      friend,
      connectionType: f.connectionType,
      since: f.updatedAt
    };
  });
};

// Static method to get pending friend requests for a user
friendshipSchema.statics.getPendingRequests = async function(userId) {
  return this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'firstName lastName email');
};

export const Friendship = mongoose.model('Friendship', friendshipSchema);
