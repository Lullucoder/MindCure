import { User } from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ profile: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      avatar,
      phone,
      dateOfBirth,
      gender,
      location,
      bio,
      emergencyContact,
      mentalHealthGoals,
      currentChallenges,
      preferredCopingStrategies,
      notificationPreferences
    } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    
    // Update nested objects
    if (location) {
      user.location = {
        ...user.location,
        ...location
      };
    }
    
    if (emergencyContact) {
      user.emergencyContact = {
        ...user.emergencyContact,
        ...emergencyContact
      };
    }
    
    // Update arrays
    if (mentalHealthGoals) user.mentalHealthGoals = mentalHealthGoals;
    if (currentChallenges) user.currentChallenges = currentChallenges;
    if (preferredCopingStrategies) user.preferredCopingStrategies = preferredCopingStrategies;
    
    // Update notification preferences
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      profile: user.toSafeObject() 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('stats createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate additional stats
    const daysSinceJoined = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    res.json({ 
      stats: user.stats,
      daysSinceJoined,
      memberSince: user.createdAt
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// Update user stats (increment values)
export const updateStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { statName, value = 1 } = req.body;

    const allowedStats = [
      'sessionsCompleted',
      'totalChatMessages',
      'appointmentsBooked',
      'resourcesViewed',
      'journalEntries',
      'moodCheckIns'
    ];

    if (!statName || !allowedStats.includes(statName)) {
      return res.status(400).json({ 
        message: 'Invalid stat name',
        allowedStats 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if not present
    if (!user.stats) {
      user.stats = {};
    }

    // Increment the stat
    user.stats[statName] = (user.stats[statName] || 0) + value;
    
    // Update last active
    user.stats.lastActive = new Date();

    await user.save();

    res.json({ 
      message: 'Stats updated',
      stats: user.stats 
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ message: 'Failed to update stats' });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Don't allow admin deletion through this endpoint
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted this way' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

// Upload avatar (placeholder - would need file upload middleware in real implementation)
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Avatar updated',
      profile: user 
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
