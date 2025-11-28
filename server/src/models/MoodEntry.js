import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Mood score from 1-5 (1=Very Bad, 2=Bad, 3=Okay, 4=Good, 5=Great)
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  moodLabel: {
    type: String,
    enum: ['very-bad', 'bad', 'okay', 'good', 'great'],
    required: true
  },
  // Optional notes about the mood
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  // Factors that influenced the mood
  factors: [{
    type: String,
    enum: ['sleep', 'exercise', 'social', 'work', 'health', 'relationships', 'weather', 'other']
  }],
  // Track if mood was updated later in the day
  updates: [{
    previousScore: Number,
    newScore: Number,
    reason: String,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // If mood improved after chatting, track who helped
  improvedAfterChat: {
    helpedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    previousScore: Number,
    improvedAt: Date
  },
  // Whether friends were notified about low mood
  friendsNotified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for user + date (one entry per day per user)
moodEntrySchema.index({ user: 1, date: 1 }, { unique: true });
moodEntrySchema.index({ user: 1, createdAt: -1 });

// Static method to get today's mood for a user
moodEntrySchema.statics.getTodaysMood = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.findOne({
    user: userId,
    date: { $gte: today, $lt: tomorrow }
  });
};

// Static method to check if user has checked in today
moodEntrySchema.statics.hasCheckedInToday = async function(userId) {
  const mood = await this.getTodaysMood(userId);
  return !!mood;
};

// Static method to get mood history for a user
moodEntrySchema.statics.getMoodHistory = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return this.find({
    user: userId,
    date: { $gte: startDate }
  }).sort({ date: -1 });
};

// Helper to convert score to label
moodEntrySchema.statics.scoreToLabel = function(score) {
  const labels = { 1: 'very-bad', 2: 'bad', 3: 'okay', 4: 'good', 5: 'great' };
  return labels[score] || 'okay';
};

// Helper to check if mood is low (score <= 2)
moodEntrySchema.methods.isLowMood = function() {
  return this.moodScore <= 2;
};

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
