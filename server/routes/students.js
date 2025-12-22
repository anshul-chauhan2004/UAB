const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get student profile
router.get('/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
router.put('/:id', async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
