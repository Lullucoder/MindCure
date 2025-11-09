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
    enum: ['student', 'counselor'],
    default: 'student'
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
