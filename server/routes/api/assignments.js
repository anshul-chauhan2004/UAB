const express = require('express');
const router = express.Router();
const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

// Get all assignments for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const [assignments] = await db.query(
      'SELECT * FROM assignments WHERE courseId = ? ORDER BY dueDate DESC',
      [req.params.courseId]
    );
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// Get assignments for a student (enrolled courses)
router.get('/student/:studentId', async (req, res) => {
  try {
    const [assignments] = await db.query(`
      SELECT a.*, c.courseName, c.courseCode
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON e.courseId = c.id
      WHERE e.studentId = ?
      ORDER BY a.dueDate DESC
    `, [req.params.studentId]);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student assignments', error: error.message });
  }
});

// Create new assignment
router.post('/', async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxMarks } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO assignments (id, title, description, courseId, dueDate, maxMarks) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, description, courseId, dueDate, maxMarks]
    );

    // Get enrolled students for notification
    const [students] = await db.query(
      'SELECT studentId, studentName FROM enrollments WHERE courseId = ?',
      [courseId]
    );

    // Create notifications for all enrolled students
    const notificationValues = students.map(student => [
      uuidv4(),
      student.studentId,
      'New Assignment',
      `New assignment "${title}" has been posted`,
      'assignment',
      id,
      false
    ]);

    if (notificationValues.length > 0) {
      await db.query(
        'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES ?',
        [notificationValues]
      );
    }

    res.status(201).json({ id, title, description, courseId, dueDate, maxMarks });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
});

// Submit assignment
router.post('/:assignmentId/submit', async (req, res) => {
  try {
    const { studentId, studentName, content, attachments = [] } = req.body;
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO assignment_submissions (id, assignmentId, studentId, studentName, content, attachments) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.params.assignmentId, studentId, studentName, content, JSON.stringify(attachments)]
    );

    // Get assignment and course info for notification
    const [assignment] = await db.query(
      'SELECT a.title, c.instructor, c.instructorEmail FROM assignments a JOIN courses c ON a.courseId = c.id WHERE a.id = ?',
      [req.params.assignmentId]
    );

    res.status(201).json({ id, status: 'submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  }
});

// Get all submissions for an assignment
router.get('/:assignmentId/submissions', async (req, res) => {
  try {
    const [submissions] = await db.query(
      'SELECT * FROM assignment_submissions WHERE assignmentId = ? ORDER BY submittedAt DESC',
      [req.params.assignmentId]
    );
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Get student's submission for an assignment
router.get('/:assignmentId/submission/:studentId', async (req, res) => {
  try {
    const [submission] = await db.query(
      'SELECT * FROM assignment_submissions WHERE assignmentId = ? AND studentId = ?',
      [req.params.assignmentId, req.params.studentId]
    );
    res.json(submission[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
});

// Grade assignment
router.put('/submissions/:submissionId/grade', async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    
    await db.query(
      'UPDATE assignment_submissions SET status = "graded", grade = ?, feedback = ? WHERE id = ?',
      [grade, feedback, req.params.submissionId]
    );

    // Get submission info for notification
    const [submission] = await db.query(
      'SELECT s.studentId, a.title FROM assignment_submissions s JOIN assignments a ON s.assignmentId = a.id WHERE s.id = ?',
      [req.params.submissionId]
    );

    if (submission.length > 0) {
      await db.query(
        'INSERT INTO notifications (id, userId, title, message, type, relatedId, isRead) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), submission[0].studentId, 'Assignment Graded', `Your assignment "${submission[0].title}" has been graded: ${grade}`, 'grade', req.params.submissionId, false]
      );
    }

    res.json({ message: 'Assignment graded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error grading assignment', error: error.message });
  }
});

module.exports = router;
