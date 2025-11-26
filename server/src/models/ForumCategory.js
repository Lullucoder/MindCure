import mongoose from 'mongoose';

const forumCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  icon: {
    type: String,
    default: '💬'
  },
  color: {
    type: String,
    default: '#6366f1' // Indigo
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const ForumCategory = mongoose.model('ForumCategory', forumCategorySchema);
