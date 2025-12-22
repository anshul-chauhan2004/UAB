const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  head: String,
  faculty: [{
    name: String,
    position: String,
    email: String
  }],
  programs: [String],
  contactEmail: String,
  contactPhone: String,
  building: String,
  image: {
    type: String,
    default: '/assets/images/image.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);
