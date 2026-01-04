const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const pool = require('../../database/config');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, code, description, head, contactEmail, contactPhone, building FROM departments ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get department by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, code, description, head, contactEmail, contactPhone, building FROM departments WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create department
router.post('/', async (req, res) => {
  try {
    const { name, code, description, head, contactEmail, contactPhone, building } = req.body;
    const id = randomUUID();
    await pool.query(
      'INSERT INTO departments (id, name, code, description, head, contactEmail, contactPhone, building) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, code, description || null, head || null, contactEmail || null, contactPhone || null, building || null]
    );
    res.status(201).json({ id, name, code, description, head, contactEmail, contactPhone, building });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
