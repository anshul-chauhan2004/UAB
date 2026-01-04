import { Router } from 'express';
import { body } from 'express-validator';
import {
    getAssignments,
    createAssignment,
    updateAssignment,
    submitAssignment,
    gradeSubmission,
    getSubmissions,
    deleteAssignment
} from '../controllers/assignments.controller';
import { authenticate, requireTeacher, requireStudent } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get assignments (filtered by role)
router.get('/', getAssignments);

// Create assignment (teacher only)
router.post(
    '/',
    requireTeacher,
    validate([
        body('courseId').isInt(),
        body('title').notEmpty().trim(),
        body('description').optional().trim(),
        body('dueDate').isISO8601(),
        body('maxMarks').isInt({ min: 1 })
    ]),
    createAssignment
);

// Update assignment (teacher only)
router.put(
    '/:id',
    requireTeacher,
    validate([
        body('title').notEmpty().trim(),
        body('description').optional().trim(),
        body('dueDate').isISO8601(),
        body('maxMarks').isInt({ min: 1 })
    ]),
    updateAssignment
);

// Submit assignment (student only)
router.post(
    '/:id/submit',
    requireStudent,
    validate([
        body('content').notEmpty().trim()
    ]),
    submitAssignment
);

// Grade submission (teacher only)
router.put(
    '/:id/grade/:submissionId',
    requireTeacher,
    validate([
        body('grade').isInt({ min: 0 }),
        body('feedback').optional().trim()
    ]),
    gradeSubmission
);

// Get submissions for assignment (teacher only)
router.get('/:id/submissions', requireTeacher, getSubmissions);

// Delete assignment (teacher only)
router.delete('/:id', requireTeacher, deleteAssignment);

export default router;
