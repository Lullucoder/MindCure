import { MoodEntry } from '../models/MoodEntry.js';
import { Friendship } from '../models/Friendship.js';
import { Notification } from '../models/Notification.js';
import { Achievement } from '../models/Achievement.js';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';

// Check in mood for today
export const checkInMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moodScore, notes, factors } = req.body;

    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ message: 'Invalid mood score (1-5)' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await MoodEntry.getTodaysMood(userId);
    if (existing) {
      return res.status(400).json({ 
        message: 'Already checked in today. Use update endpoint to modify.',
        existingEntry: existing
      });
    }

    const moodLabel = MoodEntry.scoreToLabel(moodScore);

    const moodEntry = await MoodEntry.create({
      user: userId,
      date: today,
      moodScore,
      moodLabel,
      notes: notes || '',
      factors: factors || []
    });

    // Update achievement stats
    const achievement = await Achievement.getOrCreate(userId);
    const newAchievements = await achievement.recordCheckIn();

    // If mood is low (<=2), notify friends
    if (moodScore <= 2) {
      await notifyFriendsOfLowMood(userId, moodScore);
      moodEntry.friendsNotified = true;
      await moodEntry.save();
    }

    res.status(201).json({
      message: 'Mood checked in successfully',
      moodEntry,
      newAchievements
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    console.error('Check in mood error:', error);
    res.status(500).json({ message: 'Failed to check in mood' });
  }
};

// Update today's mood
export const updateTodaysMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moodScore, notes, factors, reason } = req.body;

    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ message: 'Invalid mood score (1-5)' });
    }

    const moodEntry = await MoodEntry.getTodaysMood(userId);
    if (!moodEntry) {
      return res.status(404).json({ message: 'No mood entry for today. Please check in first.' });
    }

    const previousScore = moodEntry.moodScore;

    // Track the update
    moodEntry.updates.push({
      previousScore,
      newScore: moodScore,
      reason: reason || 'Mood changed',
      updatedAt: new Date()
    });

    moodEntry.moodScore = moodScore;
    moodEntry.moodLabel = MoodEntry.scoreToLabel(moodScore);
    if (notes !== undefined) moodEntry.notes = notes;
    if (factors !== undefined) moodEntry.factors = factors;

    await moodEntry.save();

    // Check for mood improvement achievement
    let newAchievements = [];
    if (previousScore <= 2 && moodScore >= 4) {
      const achievement = await Achievement.getOrCreate(userId);
      const result = await achievement.unlock('mood-improved');
      if (result.newAchievement) {
        newAchievements.push(result.achievement);
      }
    }

    res.json({
      message: 'Mood updated successfully',
      moodEntry,
      newAchievements
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Failed to update mood' });
  }
};

// Check if user has checked in today
export const hasCheckedInToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const hasCheckedIn = await MoodEntry.hasCheckedInToday(userId);
    const todaysMood = hasCheckedIn ? await MoodEntry.getTodaysMood(userId) : null;

    res.json({
      hasCheckedIn,
      todaysMood
    });
  } catch (error) {
    console.error('Check today status error:', error);
    res.status(500).json({ message: 'Failed to check today status' });
  }
};

// Get mood history
export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const history = await MoodEntry.getMoodHistory(userId, parseInt(days));

    // Calculate stats
    const scores = history.map(h => h.moodScore);
    const average = scores.length > 0 
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : null;

    res.json({
      history,
      stats: {
        average,
        total: history.length,
        lastEntry: history[0] || null
      }
    });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ message: 'Failed to fetch mood history' });
  }
};

// Record that chatting with someone improved mood
export const recordMoodImprovement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { helperId, newMoodScore } = req.body;

    if (!helperId || !newMoodScore) {
      return res.status(400).json({ message: 'Helper ID and new mood score required' });
    }

    const moodEntry = await MoodEntry.getTodaysMood(userId);
    if (!moodEntry) {
      return res.status(404).json({ message: 'No mood entry for today' });
    }

    const previousScore = moodEntry.moodScore;

    // Only record if mood actually improved
    if (newMoodScore <= previousScore) {
      return res.status(400).json({ message: 'New mood score must be higher than current' });
    }

    // Record the improvement
    moodEntry.improvedAfterChat = {
      helpedBy: helperId,
      previousScore,
      improvedAt: new Date()
    };

    moodEntry.moodScore = newMoodScore;
    moodEntry.moodLabel = MoodEntry.scoreToLabel(newMoodScore);
    moodEntry.updates.push({
      previousScore,
      newScore: newMoodScore,
      reason: 'Mood improved after chatting',
      updatedAt: new Date()
    });

    await moodEntry.save();

    // Update helper's achievement stats
    const helperAchievement = await Achievement.getOrCreate(helperId);
    const newAchievements = await helperAchievement.incrementMoodsHelped();

    // Notify helper about the positive impact
    const user = await User.findById(userId);
    await Notification.notify({
      recipient: helperId,
      type: 'mood-improved',
      title: 'You Made a Difference! 🌟',
      message: `Your chat with ${user.firstName} helped improve their mood!`,
      relatedUser: userId
    });

    // Send any new achievements to the helper
    for (const achievement of newAchievements) {
      await Notification.notify({
        recipient: helperId,
        type: 'achievement-unlocked',
        title: 'Achievement Unlocked! 🏆',
        message: `You earned "${achievement.name}" - ${achievement.description}`,
        relatedEntity: {
          entityType: 'achievement',
          entityId: achievement.id
        }
      });
    }

    res.json({
      message: 'Mood improvement recorded',
      moodEntry
    });
  } catch (error) {
    console.error('Record mood improvement error:', error);
    res.status(500).json({ message: 'Failed to record mood improvement' });
  }
};

// Helper function to notify friends of low mood
async function notifyFriendsOfLowMood(userId, moodScore) {
  try {
    const friends = await Friendship.getFriends(userId);
    const user = await User.findById(userId);

    const moodEmoji = moodScore === 1 ? '😢' : '😔';
    
    for (const { friend } of friends) {
      await Notification.notify({
        recipient: friend._id,
        type: 'friend-low-mood',
        title: 'A Friend Needs Support',
        message: `${user.firstName} is feeling down today ${moodEmoji}. Consider reaching out!`,
        relatedUser: userId
      });
    }
  } catch (error) {
    console.error('Error notifying friends:', error);
  }
}

// Get mood options/labels
export const getMoodOptions = async (req, res) => {
  res.json({
    options: [
      { score: 1, label: 'very-bad', emoji: '😢', text: 'Very Bad' },
      { score: 2, label: 'bad', emoji: '😔', text: 'Bad' },
      { score: 3, label: 'okay', emoji: '😐', text: 'Okay' },
      { score: 4, label: 'good', emoji: '🙂', text: 'Good' },
      { score: 5, label: 'great', emoji: '😄', text: 'Great' }
    ],
    factors: [
      { id: 'sleep', label: 'Sleep', icon: '😴' },
      { id: 'exercise', label: 'Exercise', icon: '🏃' },
      { id: 'social', label: 'Social', icon: '👥' },
      { id: 'work', label: 'Work/Study', icon: '💼' },
      { id: 'health', label: 'Health', icon: '🏥' },
      { id: 'relationships', label: 'Relationships', icon: '❤️' },
      { id: 'weather', label: 'Weather', icon: '🌤️' },
      { id: 'other', label: 'Other', icon: '📝' }
    ]
  });
};
