const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const pool = require('../../database/config');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, department, author, createdAt FROM announcements ORDER BY createdAt DESC LIMIT 20'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, department, author } = req.body;
    const id = randomUUID();
    await pool.query(
      'INSERT INTO announcements (id, title, content, department, author) VALUES (?, ?, ?, ?, ?)',
      [id, title, content, department || null, author || 'Admin']
    );
    res.status(201).json({ id, title, content, department: department || null, author: author || 'Admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
