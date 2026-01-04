const express = require('express');
const router = express.Router();
const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO attendance (id, studentId, courseId, date, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?, markedAt = NOW()',
      [id, studentId, courseId, date, status, status]
    );

    // Notify student
    await db.query(
      'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), studentId, 'Attendance Marked', `Your attendance has been marked as ${status}`, 'attendance', id, false]
    );

    res.status(201).json({ id, studentId, courseId, date, status });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
});

// Get attendance for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const [attendance] = await db.query(
      'SELECT * FROM attendance WHERE courseId = ? ORDER BY date DESC',
      [req.params.courseId]
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course attendance', error: error.message });
  }
});

// Get attendance for a student in a course
router.get('/student/:studentId/course/:courseId', async (req, res) => {
  try {
    const [attendance] = await db.query(
      'SELECT * FROM attendance WHERE studentId = ? AND courseId = ? ORDER BY date DESC',
      [req.params.studentId, req.params.courseId]
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance', error: error.message });
  }
});

// Get attendance percentage
router.get('/student/:studentId/course/:courseId/percentage', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
      FROM attendance 
      WHERE studentId = ? AND courseId = ?
    `, [req.params.studentId, req.params.courseId]);

    const total = result[0].total || 0;
    const present = result[0].present || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ total, present, percentage });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating percentage', error: error.message });
  }
});

// Add internal marks
router.post('/marks', async (req, res) => {
  try {
    const { studentId, courseId, type, marks, maxMarks, date } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO internal_marks (id, studentId, courseId, type, marks, maxMarks, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, studentId, courseId, type, marks, maxMarks, date]
    );

    // Notify student
    await db.query(
      'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), studentId, 'Internal Marks Added', `You received ${marks}/${maxMarks} marks for ${type}`, 'marks', id, false]
    );

    res.status(201).json({ id, studentId, courseId, type, marks, maxMarks, date });
  } catch (error) {
    res.status(500).json({ message: 'Error adding internal marks', error: error.message });
  }
});

// Get internal marks for a student in a course
router.get('/marks/student/:studentId/course/:courseId', async (req, res) => {
  try {
    const [marks] = await db.query(
      'SELECT * FROM internal_marks WHERE studentId = ? AND courseId = ? ORDER BY date DESC',
      [req.params.studentId, req.params.courseId]
    );
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internal marks', error: error.message });
  }
});

module.exports = router;
