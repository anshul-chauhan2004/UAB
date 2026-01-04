const express = require('express');
const router = express.Router();
const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

// Get assessments for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const [assessments] = await db.query(
      'SELECT * FROM assessments WHERE courseId = ? ORDER BY startTime DESC',
      [req.params.courseId]
    );
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

// Get assessments for student
router.get('/student/:studentId', async (req, res) => {
  try {
    const [assessments] = await db.query(`
      SELECT a.*, c.courseName, c.courseCode
      FROM assessments a
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON e.courseId = c.id
      WHERE e.studentId = ?
      ORDER BY a.startTime DESC
    `, [req.params.studentId]);
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student assessments', error: error.message });
  }
});

// Create assessment
router.post('/', async (req, res) => {
  try {
    const { title, type, courseId, duration, totalMarks, startTime, endTime } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO assessments (id, title, type, courseId, duration, totalMarks, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, type, courseId, duration, totalMarks, startTime, endTime]
    );

    // Notify students
    const [students] = await db.query(
      'SELECT studentId FROM enrollments WHERE courseId = ?',
      [courseId]
    );

    const notificationValues = students.map(student => [
      uuidv4(), student.studentId, 'New Assessment', `New ${type} "${title}" scheduled`, 'assessment', id, false
    ]);

    if (notificationValues.length > 0) {
      await db.query(
        'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES ?',
        [notificationValues]
      );
    }

    res.status(201).json({ id, title, type, courseId, duration, totalMarks, startTime, endTime });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment', error: error.message });
  }
});

// Start assessment attempt
router.post('/:assessmentId/start', async (req, res) => {
  try {
    const { studentId, studentName } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO assessment_attempts (id, assessmentId, studentId, studentName) VALUES (?, ?, ?, ?)',
      [id, req.params.assessmentId, studentId, studentName]
    );

    res.status(201).json({ id, status: 'in_progress' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting assessment', error: error.message });
  }
});

// Submit assessment
router.put('/attempts/:attemptId/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    
    await db.query(
      'UPDATE assessment_attempts SET status = "submitted", answers = ?, submittedAt = NOW() WHERE id = ?',
      [JSON.stringify(answers), req.params.attemptId]
    );

    res.json({ message: 'Assessment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assessment', error: error.message });
  }
});

// Grade assessment
router.put('/attempts/:attemptId/grade', async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    await db.query(
      'UPDATE assessment_attempts SET status = "graded", score = ?, feedback = ? WHERE id = ?',
      [score, feedback, req.params.attemptId]
    );

    // Get attempt info for notification
    const [attempt] = await db.query(
      'SELECT a.studentId, ass.title FROM assessment_attempts a JOIN assessments ass ON a.assessmentId = ass.id WHERE a.id = ?',
      [req.params.attemptId]
    );

    if (attempt.length > 0) {
      await db.query(
        'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), attempt[0].studentId, 'Assessment Graded', `Your "${attempt[0].title}" has been graded: ${score}`, 'grade', req.params.attemptId, false]
      );
    }

    res.json({ message: 'Assessment graded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error grading assessment', error: error.message });
  }
});

// Get attempts for an assessment
router.get('/:assessmentId/attempts', async (req, res) => {
  try {
    const [attempts] = await db.query(
      'SELECT * FROM assessment_attempts WHERE assessmentId = ? ORDER BY startedAt DESC',
      [req.params.assessmentId]
    );
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
});

// Get student's attempt
router.get('/:assessmentId/attempt/:studentId', async (req, res) => {
  try {
    const [attempt] = await db.query(
      'SELECT * FROM assessment_attempts WHERE assessmentId = ? AND studentId = ?',
      [req.params.assessmentId, req.params.studentId]
    );
    res.json(attempt[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt', error: error.message });
  }
});

module.exports = router;
