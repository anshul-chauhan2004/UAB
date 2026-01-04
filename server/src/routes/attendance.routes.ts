import { Router } from 'express';
import { body } from 'express-validator';
import {
    getAttendance,
    markAttendance,
    markBulkAttendance,
    updateAttendance
} from '../controllers/attendance.controller';
import { authenticate, requireTeacher } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get attendance records
router.get('/', getAttendance);

// Mark attendance (teacher only)
router.post(
    '/mark',
    requireTeacher,
    validate([
        body('courseId').isInt(),
        body('studentId').isInt(),
        body('date').isDate(),
        body('status').isIn(['present', 'absent', 'late'])
    ]),
    markAttendance
);

// Mark bulk attendance (teacher only)
router.post(
    '/mark-bulk',
    requireTeacher,
    validate([
        body('courseId').isInt(),
        body('date').isDate(),
        body('attendanceList').isArray()
    ]),
    markBulkAttendance
);

// Update attendance (teacher only)
router.put(
    '/:id',
    requireTeacher,
    validate([
        body('status').isIn(['present', 'absent', 'late'])
    ]),
    updateAttendance
);

export default router;
