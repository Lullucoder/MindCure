import { Achievement, achievementDefinitions } from '../models/Achievement.js';
import { Notification } from '../models/Notification.js';

// Get user's achievements and stats
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievement = await Achievement.getOrCreate(userId);

    // Map achievements with full definitions
    const unlockedAchievements = achievement.achievements.map(a => ({
      ...achievementDefinitions[a.achievementId],
      id: a.achievementId,
      unlockedAt: a.unlockedAt,
      progress: a.progress
    }));

    // Calculate total XP from unlocked achievements
    const totalXP = unlockedAchievements.reduce((sum, a) => sum + (a.xp || 0), 0);

    // Get all achievements with locked status
    const allAchievements = Object.entries(achievementDefinitions).map(([id, def]) => {
      const unlocked = achievement.achievements.find(a => a.achievementId === id);
      return {
        id,
        ...def,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt || null
      };
    });

    res.json({
      stats: achievement.stats,
      achievements: allAchievements,
      totalXP,
      unlockedCount: unlockedAchievements.length,
      totalCount: Object.keys(achievementDefinitions).length
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};

// Get achievement definitions
export const getAchievementDefinitions = async (req, res) => {
  res.json({ definitions: achievementDefinitions });
};

// Get user stats summary (for profile display)
export const getStatsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievement = await Achievement.getOrCreate(userId);

    res.json({
      moodsHelped: achievement.stats.moodsHelped,
      checkInStreak: achievement.stats.checkInStreak,
      longestStreak: achievement.stats.longestStreak,
      totalCheckIns: achievement.stats.totalCheckIns,
      achievementsUnlocked: achievement.achievements.length,
      totalAchievements: Object.keys(achievementDefinitions).length
    });
  } catch (error) {
    console.error('Get stats summary error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// Get another user's public achievements (for profile viewing)
export const getUserPublicAchievements = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievement = await Achievement.getOrCreate(userId);

    // Only show unlocked achievements and select stats
    const unlockedAchievements = achievement.achievements.map(a => ({
      ...achievementDefinitions[a.achievementId],
      id: a.achievementId,
      unlockedAt: a.unlockedAt
    }));

    res.json({
      stats: {
        moodsHelped: achievement.stats.moodsHelped,
        checkInStreak: achievement.stats.checkInStreak,
        longestStreak: achievement.stats.longestStreak
      },
      achievements: unlockedAchievements
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ message: 'Failed to fetch user achievements' });
  }
};
