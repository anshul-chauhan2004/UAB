import { Router } from 'express';
import { body } from 'express-validator';
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStudents,
    assignTeacherToCourse
} from '../controllers/courses.controller';
import { authenticate, requireTeacher } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get courses (filtered by role)
router.get('/', getCourses);

// Create course (teacher only)
router.post(
    '/',
    requireTeacher,
    validate([
        body('code').notEmpty().trim(),
        body('name').notEmpty().trim(),
        body('semester').notEmpty().trim(),
        body('year').isInt({ min: 2000, max: 2100 }),
        body('description').optional().trim()
    ]),
    createCourse
);

// Update course (teacher only)
router.put(
    '/:id',
    requireTeacher,
    validate([
        body('code').notEmpty().trim(),
        body('name').notEmpty().trim(),
        body('semester').notEmpty().trim(),
        body('year').isInt({ min: 2000, max: 2100 }),
        body('description').optional().trim()
    ]),
    updateCourse
);

// Delete course (teacher only)
router.delete('/:id', requireTeacher, deleteCourse);

// Assign teacher to course (teacher only)
router.post('/:id/assign', requireTeacher, assignTeacherToCourse);

// Get course students
router.get('/:id/students', getCourseStudents);

export default router;
