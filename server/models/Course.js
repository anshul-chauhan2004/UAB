const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  description: String,
  credits: {
    type: Number,
    required: true
  },
  instructor: String,
  schedule: {
    days: [String],
    time: String
  },
  capacity: Number,
  enrolled: {
    type: Number,
    default: 0
  },
  semester: String,
  prerequisites: [String],
  syllabus: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
