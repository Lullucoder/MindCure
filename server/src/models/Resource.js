import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  content: {
    type: String,
    maxlength: 50000  // Increased for rich content
  },
  type: {
    type: String,
    enum: ['article', 'video', 'audio', 'pdf', 'link', 'exercise', 'guide', 'breathing', 'meditation', 'assessment'],
    default: 'article'
  },
  category: {
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'sleep', 'relationships', 'self-esteem', 'mindfulness', 'academic', 'general', 'self-care', 'breathing', 'meditation'],
    default: 'general'
  },
  // YouTube video URL (embed format)
  videoUrl: {
    type: String,
    default: ''
  },
  // External link URL
  url: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  // Emoji icon for display
  icon: {
    type: String,
    default: '📚'
  },
  duration: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  // For breathing exercises - pattern configuration
  breathingPattern: {
    inhale: { type: Number, default: 4 },
    holdAfterInhale: { type: Number, default: 0 },
    exhale: { type: Number, default: 4 },
    holdAfterExhale: { type: Number, default: 0 },
    totalCycles: { type: Number, default: 5 }
  },
  // Source attribution
  source: {
    label: { type: String, default: '' },
    url: { type: String, default: '' }
  },
  // Counselor who created this resource
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Is this a built-in/system resource (not editable)
  isBuiltIn: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
resourceSchema.index({ category: 1, isPublished: 1 });
resourceSchema.index({ createdBy: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ isFeatured: 1 });

export const Resource = mongoose.model('Resource', resourceSchema);
