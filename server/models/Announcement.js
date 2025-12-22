const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'academic', 'event', 'urgent'],
    default: 'general'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'faculty', 'staff'],
    default: 'all'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

module.exports = mongoose.model('Announcement', announcementSchema);
