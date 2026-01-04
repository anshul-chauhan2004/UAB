import { Router } from 'express';
import { body } from 'express-validator';
import {
    getAssessments,
    createAssessment,
    updateAssessment,
    submitAttempt,
    gradeAttempt,
    getAttempts
} from '../controllers/assessments.controller';
import { authenticate, requireTeacher, requireStudent } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get assessments (filtered by role)
router.get('/', getAssessments);

// Create assessment (teacher only)
router.post(
    '/',
    requireTeacher,
    validate([
        body('courseId').isInt(),
        body('title').notEmpty().trim(),
        body('type').isIn(['quiz', 'midterm', 'final', 'test']),
        body('maxMarks').isInt({ min: 1 }),
        body('scheduledAt').isISO8601(),
        body('durationMinutes').isInt({ min: 1 }),
        body('questions').isArray()
    ]),
    createAssessment
);

// Update assessment (teacher only)
router.put(
    '/:id',
    requireTeacher,
    validate([
        body('title').notEmpty().trim(),
        body('type').isIn(['quiz', 'midterm', 'final', 'test']),
        body('maxMarks').isInt({ min: 1 }),
        body('scheduledAt').isISO8601(),
        body('durationMinutes').isInt({ min: 1 }),
        body('questions').isArray()
    ]),
    updateAssessment
);

// Submit attempt (student only)
router.post(
    '/:id/attempt',
    requireStudent,
    validate([
        body('answers').isArray()
    ]),
    submitAttempt
);

// Grade attempt (teacher only)
router.put(
    '/:id/grade/:attemptId',
    requireTeacher,
    validate([
        body('grade').isInt({ min: 0 }),
        body('feedback').optional().trim()
    ]),
    gradeAttempt
);

// Get attempts for assessment (teacher only)
router.get('/:id/attempts', requireTeacher, getAttempts);

export default router;
