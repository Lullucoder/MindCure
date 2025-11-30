import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: ['breathing', 'meditation', 'journaling', 'mindfulness', 'custom'],
    required: true
  },
  durationSeconds: {
    type: Number,
    min: 0,
    default: 0
  },
  breathCycles: {
    type: Number,
    min: 0,
    default: 0
  },
  intensityLevel: {
    type: String,
    enum: ['gentle', 'moderate', 'deep'],
    default: 'moderate'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: () => ({})
  },
  completedAt: {
    type: Date,
    default: () => new Date()
  }
}, {
  timestamps: true
});

activitySchema.index({ user: 1, completedAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
