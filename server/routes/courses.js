const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const pool = require('../../database/config');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { department, semester, stream } = req.query;
    const where = [];
    const params = [];
    if (department) { where.push('department = ?'); params.push(department); }
    if (semester) { where.push('semester = ?'); params.push(semester); }
    if (stream) { where.push('stream = ?'); params.push(stream); }
    const sql = `SELECT id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled, description FROM courses ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY courseCode ASC`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled, description FROM courses WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create course (teachers can add courses)
router.post('/', async (req, res) => {
  try {
    const { courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, description } = req.body;
    const id = randomUUID();
    await pool.query(
      'INSERT INTO courses (id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, courseCode, courseName, instructor, instructorEmail || null, department, semester, credits || 4, stream || null, capacity || 60, 0, description || null]
    );
    res.status(201).json({ id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled: 0, description });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const fields = ['courseCode','courseName','instructor','instructorEmail','department','semester','credits','stream','capacity','description'];
    const sets = [];
    const params = [];
    fields.forEach(f => {
      if (req.body[f] !== undefined) { sets.push(`${f} = ?`); params.push(req.body[f]); }
    });
    if (sets.length === 0) return res.status(400).json({ message: 'No fields to update' });
    params.push(req.params.id);
    const [result] = await pool.query(`UPDATE courses SET ${sets.join(', ')} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    const [rows] = await pool.query('SELECT id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled, description FROM courses WHERE id = ? LIMIT 1', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll in course
router.post('/:id/enroll', async (req, res) => {
  try {
    const courseId = req.params.id;
    const [rows] = await pool.query('SELECT capacity, enrolled, courseCode, courseName FROM courses WHERE id = ? LIMIT 1', [courseId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const course = rows[0];
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }
    await pool.query('UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?', [courseId]);
    res.json({ message: 'Enrolled successfully', course: { ...course, enrolled: course.enrolled + 1 } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
