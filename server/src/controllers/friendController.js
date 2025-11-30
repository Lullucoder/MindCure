import { Friendship } from '../models/Friendship.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { Achievement } from '../models/Achievement.js';

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { recipientId } = req.params;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friendship already exists
    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already pending' });
      }
      if (existing.status === 'blocked') {
        return res.status(400).json({ message: 'Cannot send friend request' });
      }
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    // Notify recipient
    const requester = await User.findById(requesterId);
    await Notification.notify({
      recipient: recipientId,
      type: 'friend-request',
      title: 'New Support Buddy Request',
      message: `${requester.firstName} ${requester.lastName} wants to be your support buddy`,
      relatedUser: requesterId,
      relatedEntity: {
        entityType: 'friendship',
        entityId: friendship._id
      }
    });

    res.status(201).json({ 
      message: 'Friend request sent',
      friendship: {
        _id: friendship._id,
        status: friendship.status
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Failed to send friend request' });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendshipId } = req.params;

    const friendship = await Friendship.findOne({
      _id: friendshipId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    friendship.status = 'accepted';
    await friendship.save();

    // Notify the requester
    const accepter = await User.findById(userId);
    await Notification.notify({
      recipient: friendship.requester,
      type: 'friend-accepted',
      title: 'Friend Request Accepted',
      message: `${accepter.firstName} ${accepter.lastName} is now your support buddy!`,
      relatedUser: userId,
      relatedEntity: {
        entityType: 'friendship',
        entityId: friendship._id
      }
    });

    // Check for achievements
    const friendCount1 = await Friendship.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });
    const friendCount2 = await Friendship.countDocuments({
      $or: [
        { requester: friendship.requester, status: 'accepted' },
        { recipient: friendship.requester, status: 'accepted' }
      ]
    });

    // Update achievements for both users
    const [achievement1, achievement2] = await Promise.all([
      Achievement.getOrCreate(userId),
      Achievement.getOrCreate(friendship.requester)
    ]);

    if (friendCount1 === 1) await achievement1.unlock('first-friend');
    if (friendCount1 >= 5) await achievement1.unlock('five-friends');
    if (friendCount2 === 1) await achievement2.unlock('first-friend');
    if (friendCount2 >= 5) await achievement2.unlock('five-friends');

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ message: 'Failed to accept friend request' });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendshipId } = req.params;

    const friendship = await Friendship.findOne({
      _id: friendshipId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    friendship.status = 'rejected';
    await friendship.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ message: 'Failed to reject friend request' });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId, status: 'accepted' },
        { requester: friendId, recipient: userId, status: 'accepted' }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    res.json({ message: 'Friend removed' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

// Get all friends
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await Friendship.getFriends(userId);
    res.json({ friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
};

// Get pending friend requests (received)
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Friendship.getPendingRequests(userId);
    res.json({ requests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests' });
  }
};

// Get sent friend requests
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Friendship.find({
      requester: userId,
      status: 'pending'
    }).populate('recipient', 'firstName lastName email');
    res.json({ requests });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ message: 'Failed to fetch sent requests' });
  }
};

// Check friendship status with another user
export const checkFriendshipStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.params;

    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: targetUserId },
        { requester: targetUserId, recipient: userId }
      ]
    });

    if (!friendship) {
      return res.json({ status: 'none' });
    }

    let status = friendship.status;
    
    // Add direction info for pending requests
    if (status === 'pending') {
      if (friendship.requester.toString() === userId) {
        status = 'pending-sent';
      } else {
        status = 'pending-received';
      }
    }

    res.json({ 
      status,
      friendshipId: friendship._id
    });
  } catch (error) {
    console.error('Check friendship status error:', error);
    res.status(500).json({ message: 'Failed to check friendship status' });
  }
};

// Search for users by name or email
export const searchUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    // Find users matching the search query (exclude current user)
    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { name: searchRegex }
      ]
    })
    .select('firstName lastName email role name')
    .limit(20);

    // Get friendship statuses for found users
    const userIds = users.map(u => u._id);
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, recipient: { $in: userIds } },
        { requester: { $in: userIds }, recipient: userId }
      ]
    });

    // Map friendship status to each user
    const usersWithStatus = users.map(user => {
      const friendship = friendships.find(f => 
        f.requester.toString() === user._id.toString() ||
        f.recipient.toString() === user._id.toString()
      );
      
      return {
        _id: user._id,
        name: user.name || `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        friendshipStatus: friendship ? friendship.status : 'none'
      };
    });

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};
