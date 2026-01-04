import { Router } from 'express';
import { body } from 'express-validator';
import {
    getInternalMarks,
    setInternalMarks
} from '../controllers/marks.controller';
import { authenticate, requireTeacher } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get internal marks
router.get('/', getInternalMarks);

// Set internal marks (teacher only)
router.post(
    '/',
    requireTeacher,
    validate([
        body('courseId').isInt(),
        body('studentId').isInt(),
        body('component').notEmpty().trim(),
        body('marks').isInt({ min: 0 }),
        body('maxMarks').isInt({ min: 1 })
    ]),
    setInternalMarks
);

export default router;
