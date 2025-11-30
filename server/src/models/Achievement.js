import mongoose from 'mongoose';

const achievementDefinitions = {
  'first-checkin': {
    name: 'First Check-in',
    description: 'Completed your first daily mood check-in',
    icon: '🌟',
    category: 'mood',
    xp: 10
  },
  'week-streak': {
    name: 'Week Warrior',
    description: 'Checked in for 7 consecutive days',
    icon: '🔥',
    category: 'mood',
    xp: 50
  },
  'month-streak': {
    name: 'Monthly Master',
    description: 'Checked in for 30 consecutive days',
    icon: '👑',
    category: 'mood',
    xp: 200
  },
  'mood-helper-1': {
    name: 'Mood Helper',
    description: 'Helped improve 1 friend\'s mood through chat',
    icon: '💝',
    category: 'social',
    xp: 25
  },
  'mood-helper-5': {
    name: 'Caring Friend',
    description: 'Helped improve 5 friends\' moods through chat',
    icon: '🤗',
    category: 'social',
    xp: 75
  },
  'mood-helper-10': {
    name: 'Support Champion',
    description: 'Helped improve 10 friends\' moods through chat',
    icon: '🏆',
    category: 'social',
    xp: 150
  },
  'mood-helper-25': {
    name: 'Mental Health Hero',
    description: 'Helped improve 25 friends\' moods through chat',
    icon: '🦸',
    category: 'social',
    xp: 300
  },
  'first-friend': {
    name: 'Making Connections',
    description: 'Added your first support buddy',
    icon: '🤝',
    category: 'social',
    xp: 15
  },
  'five-friends': {
    name: 'Support Network',
    description: 'Built a network of 5 support buddies',
    icon: '👥',
    category: 'social',
    xp: 50
  },
  'first-post': {
    name: 'Voice Found',
    description: 'Created your first forum post',
    icon: '📝',
    category: 'community',
    xp: 20
  },
  'helpful-comment': {
    name: 'Helpful Voice',
    description: 'Received 10 likes on your comments',
    icon: '💬',
    category: 'community',
    xp: 75
  },
  'mood-improved': {
    name: 'Rising Up',
    description: 'Improved your mood from low to good in a day',
    icon: '🌈',
    category: 'personal',
    xp: 30
  },
  'consistent-good': {
    name: 'Positive Streak',
    description: 'Maintained good mood for 5 consecutive days',
    icon: '☀️',
    category: 'personal',
    xp: 100
  }
};

const userAchievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    enum: Object.keys(achievementDefinitions)
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  // For progressive achievements, track progress
  progress: {
    current: { type: Number, default: 0 },
    target: { type: Number, default: 1 }
  }
});

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Stats for tracking
  stats: {
    moodsHelped: { type: Number, default: 0 },
    checkInStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCheckIns: { type: Number, default: 0 },
    lastCheckInDate: Date,
    goodMoodStreak: { type: Number, default: 0 },
    forumPosts: { type: Number, default: 0 },
    commentLikes: { type: Number, default: 0 }
  },
  achievements: [userAchievementSchema]
}, {
  timestamps: true
});

achievementSchema.index({ user: 1 });

// Static to get achievement definitions
achievementSchema.statics.getDefinitions = function() {
  return achievementDefinitions;
};

// Static to get or create user achievements document
achievementSchema.statics.getOrCreate = async function(userId) {
  let doc = await this.findOne({ user: userId });
  if (!doc) {
    doc = await this.create({ user: userId, achievements: [] });
  }
  return doc;
};

// Method to unlock an achievement
achievementSchema.methods.unlock = async function(achievementId) {
  const exists = this.achievements.find(a => a.achievementId === achievementId);
  if (exists) return { alreadyUnlocked: true };

  this.achievements.push({
    achievementId,
    unlockedAt: new Date(),
    progress: { current: 1, target: 1 }
  });

  await this.save();
  return { 
    newAchievement: true, 
    achievement: {
      ...achievementDefinitions[achievementId],
      id: achievementId,
      unlockedAt: new Date()
    }
  };
};

// Method to increment moodsHelped and check for achievements
achievementSchema.methods.incrementMoodsHelped = async function() {
  this.stats.moodsHelped += 1;
  const count = this.stats.moodsHelped;
  
  const newAchievements = [];
  
  if (count >= 1) {
    const result = await this.unlock('mood-helper-1');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }
  if (count >= 5) {
    const result = await this.unlock('mood-helper-5');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }
  if (count >= 10) {
    const result = await this.unlock('mood-helper-10');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }
  if (count >= 25) {
    const result = await this.unlock('mood-helper-25');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }

  await this.save();
  return newAchievements;
};

// Method to update check-in streak
achievementSchema.methods.recordCheckIn = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCheckIn = this.stats.lastCheckInDate;
  const newAchievements = [];

  this.stats.totalCheckIns += 1;

  if (lastCheckIn) {
    const lastDate = new Date(lastCheckIn);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      this.stats.checkInStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      this.stats.checkInStreak = 1;
    }
    // If diffDays === 0, same day, don't change streak
  } else {
    // First check-in ever
    this.stats.checkInStreak = 1;
    const result = await this.unlock('first-checkin');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }

  // Update longest streak
  if (this.stats.checkInStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.checkInStreak;
  }

  this.stats.lastCheckInDate = today;

  // Check for streak achievements
  if (this.stats.checkInStreak >= 7) {
    const result = await this.unlock('week-streak');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }
  if (this.stats.checkInStreak >= 30) {
    const result = await this.unlock('month-streak');
    if (result.newAchievement) newAchievements.push(result.achievement);
  }

  await this.save();
  return newAchievements;
};

export const Achievement = mongoose.model('Achievement', achievementSchema);
export { achievementDefinitions };
