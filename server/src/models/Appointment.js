import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true // e.g., "09:00-10:00"
  },
  duration: {
    type: Number,
    default: 60, // minutes
    min: 15,
    max: 120
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  reason: {
    type: String,
    maxlength: 500,
    default: ''
  },
  notes: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  cancelReason: {
    type: String,
    maxlength: 500
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  meetingLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ student: 1, date: 1 });
appointmentSchema.index({ counselor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
