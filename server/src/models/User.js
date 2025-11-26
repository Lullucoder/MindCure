import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema({
  breathingPattern: {
    type: String,
    enum: ['box', '478', 'equal', 'custom'],
    default: 'box'
  },
  inhaleSeconds: {
    type: Number,
    default: 4,
    min: 1,
    max: 30
  },
  holdSeconds: {
    type: Number,
    default: 4,
    min: 0,
    max: 30
  },
  exhaleSeconds: {
    type: Number,
    default: 4,
    min: 1,
    max: 30
  },
  beepEnabled: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const statsSchema = new mongoose.Schema({
  totalSessions: {
    type: Number,
    default: 0
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastSessionAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /.+@.+\..+/u
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 80
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 80
  },
  role: {
    type: String,
    enum: ['student', 'counselor', 'admin'],
    default: 'student'
  },
  // Profile fields
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,  // URL or base64
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say', ''],
    default: ''
  },
  location: {
    city: String,
    country: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  // Mental health profile
  mentalHealthGoals: [{
    type: String,
    trim: true
  }],
  currentChallenges: [{
    type: String,
    trim: true
  }],
  preferredCopingStrategies: [{
    type: String,
    trim: true
  }],
  // Notification preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false }
  },
  // Counselor-specific fields
  specializations: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  preferences: {
    type: preferencesSchema,
    default: () => ({})
  },
  stats: {
    type: statsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

userSchema.methods.toSafeObject = function toSafeObject() {
  const doc = this.toObject({
    versionKey: false,
    transform: (_, ret) => {
      if (ret?._id) {
        ret.id = ret._id.toString();
      }
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    }
  });
  return doc;
};

export const User = mongoose.model('User', userSchema);
