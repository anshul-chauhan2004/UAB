const express = require('express');
const router = express.Router();
const pool = require('../../database/config');

// Get student profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await pool.query('SELECT id, fullName, email, username, role, department, stream, studentId, teacherId FROM users WHERE id = ? LIMIT 1', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const [courses] = await pool.query(
      `SELECT c.id, c.courseCode, c.courseName, c.department, c.semester, c.credits 
       FROM enrollments e JOIN courses c ON e.courseId = c.id WHERE e.studentId = ?`,
      [userId]
    );
    res.json({ ...users[0], enrolledCourses: courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
router.put('/:id', async (req, res) => {
  try {
    const fields = ['fullName','email','username','department','stream','studentId'];
    const sets = [];
    const params = [];
    fields.forEach(f => {
      if (req.body[f] !== undefined) { sets.push(`${f} = ?`); params.push(req.body[f]); }
    });
    if (sets.length === 0) return res.status(400).json({ message: 'No fields to update' });
    params.push(req.params.id);
    const [result] = await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
    const [rows] = await pool.query('SELECT id, fullName, email, username, role, department, stream, studentId, teacherId FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
