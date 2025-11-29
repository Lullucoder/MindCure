import { User } from '../models/User.js';
import { Friendship } from '../models/Friendship.js';
import { MoodEntry } from '../models/MoodEntry.js';
import { Achievement, achievementDefinitions } from '../models/Achievement.js';
import { ForumPost } from '../models/ForumPost.js';

// Get another user's public profile
export const getUserPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;

    // Get user basic info
    const user = await User.findById(userId).select(
      'firstName lastName email bio avatar role createdAt'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get friendship status with viewer
    let friendshipStatus = 'none';
    let friendshipId = null;
    if (viewerId && viewerId !== userId) {
      const friendship = await Friendship.findOne({
        $or: [
          { requester: viewerId, recipient: userId },
          { requester: userId, recipient: viewerId }
        ]
      });
      
      if (friendship) {
        friendshipId = friendship._id;
        if (friendship.status === 'accepted') {
          friendshipStatus = 'friends';
        } else if (friendship.status === 'pending') {
          friendshipStatus = friendship.requester.toString() === viewerId ? 'pending-sent' : 'pending-received';
        }
      }
    }

    // Get friends count
    const friendsCount = await Friendship.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted'
    });

    // Get today's mood (if they have one)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysMood = await MoodEntry.findOne({
      user: userId,
      date: { $gte: today }
    }).select('moodScore moodLabel');

    // Get achievements
    const achievementDoc = await Achievement.getOrCreate(userId);
    const achievements = achievementDoc.achievements.map(a => ({
      id: a.achievementId,
      ...achievementDefinitions[a.achievementId],
      unlockedAt: a.unlockedAt
    }));

    // Get stats
    const stats = {
      moodsHelped: achievementDoc.stats.moodsHelped || 0,
      checkInStreak: achievementDoc.stats.checkInStreak || 0,
      longestStreak: achievementDoc.stats.longestStreak || 0,
      totalCheckIns: achievementDoc.stats.totalCheckIns || 0
    };

    // Get recent forum posts count
    const postsCount = await ForumPost.countDocuments({ 
      author: userId,
      status: 'active'
    });

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        bio: user.bio || '',
        avatar: user.avatar || '',
        role: user.role,
        joinedAt: user.createdAt
      },
      friendshipStatus,
      friendshipId,
      friendsCount,
      currentMood: todaysMood ? {
        score: todaysMood.moodScore,
        label: todaysMood.moodLabel
      } : null,
      achievements,
      stats,
      postsCount,
      isOwnProfile: viewerId === userId
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// Get user's public mood history (last 7 days for friends only)
export const getUserMoodHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.id;

    // Check if they are friends
    const friendship = await Friendship.findOne({
      $or: [
        { requester: viewerId, recipient: userId },
        { requester: userId, recipient: viewerId }
      ],
      status: 'accepted'
    });

    if (!friendship && viewerId !== userId) {
      return res.status(403).json({ 
        message: 'You can only view mood history of friends' 
      });
    }

    // Get last 7 days of mood
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodHistory = await MoodEntry.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    })
    .select('date moodScore moodLabel')
    .sort({ date: -1 });

    res.json({ moodHistory });
  } catch (error) {
    console.error('Get user mood history error:', error);
    res.status(500).json({ message: 'Failed to fetch mood history' });
  }
};

// Search users (for finding friends)
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }

    // Search by name or email
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('firstName lastName email avatar bio role')
    .limit(20);

    // Get friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await Friendship.findOne({
          $or: [
            { requester: currentUserId, recipient: user._id },
            { requester: user._id, recipient: currentUserId }
          ]
        });

        let friendshipStatus = 'none';
        if (friendship) {
          if (friendship.status === 'accepted') {
            friendshipStatus = 'friends';
          } else if (friendship.status === 'pending') {
            friendshipStatus = friendship.requester.toString() === currentUserId 
              ? 'pending-sent' 
              : 'pending-received';
          }
        }

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
          friendshipStatus
        };
      })
    );

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

// Get all students (for counselors to view)
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const students = await User.find({ role: 'student' })
      .select('firstName lastName email avatar bio createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: 'student' });

    res.json({
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
