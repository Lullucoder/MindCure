import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';

const calculateStreak = (previousLastSession, currentDate) => {
  if (!previousLastSession) {
    return { currentStreak: 1, longestStreak: 1 };
  }

  const lastSessionDate = new Date(previousLastSession);
  const diffInDays = Math.floor((currentDate - lastSessionDate) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Same day session does not change streak
    return null;
  }

  if (diffInDays === 1) {
    return { increment: true };
  }

  // Gap longer than a day resets streak
  return { reset: true };
};

const buildSummary = (userStats) => ({
  totalSessions: userStats.totalSessions,
  totalMinutes: userStats.totalMinutes,
  currentStreak: userStats.currentStreak,
  longestStreak: userStats.longestStreak,
  lastSessionAt: userStats.lastSessionAt
});

export const logActivity = async (req, res, next) => {
  try {
    const { activityType, durationSeconds, breathCycles, intensityLevel, metadata } = req.body;

    if (!activityType) {
      return res.status(400).json({ error: true, message: 'activityType is required' });
    }

    const parsedDuration = Number.parseInt(durationSeconds, 10) || 0;
    const session = await Activity.create({
      user: req.user._id,
      activityType,
      durationSeconds: parsedDuration,
      breathCycles: Number.parseInt(breathCycles, 10) || 0,
      intensityLevel: intensityLevel || 'moderate',
      metadata: metadata || {}
    });

    const user = await User.findById(req.user._id);

    user.stats.totalSessions += 1;
    user.stats.totalMinutes += Math.round((parsedDuration / 60) * 10) / 10;

    const now = session.completedAt || new Date();
    const streakResult = calculateStreak(user.stats.lastSessionAt, now);

    if (!user.stats.currentStreak) {
      user.stats.currentStreak = 0;
    }
    if (!user.stats.longestStreak) {
      user.stats.longestStreak = 0;
    }

    if (!streakResult) {
      // same day session, no streak change
    } else if (streakResult.increment) {
      user.stats.currentStreak += 1;
    } else if (streakResult.reset) {
      user.stats.currentStreak = 1;
    } else {
      user.stats.currentStreak = 1;
    }

    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak;
    }

    user.stats.lastSessionAt = now;
    await user.save();

    return res.status(201).json({
      activity: session,
      summary: buildSummary(user.stats)
    });
  } catch (error) {
    return next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ summary: buildSummary(user.stats) });
  } catch (error) {
    return next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(50)
      .lean();

    return res.json({ activities });
  } catch (error) {
    return next(error);
  }
};
