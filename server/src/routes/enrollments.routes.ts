import { Router } from 'express';
import { body } from 'express-validator';
import {
    enrollInCourse,
    unenrollFromCourse,
    getMyCourses,
    getCourseEnrollments
} from '../controllers/enrollments.controller';
import { authenticate, requireStudent } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Enroll in course (student only)
router.post(
    '/',
    requireStudent,
    validate([
        body('courseId').isInt()
    ]),
    enrollInCourse
);

// Unenroll from course (student only)
router.delete('/:id', requireStudent, unenrollFromCourse);

// Get my enrolled courses (student only)
router.get('/my-courses', requireStudent, getMyCourses);

// Get students enrolled in a course (for teachers)
router.get('/course/:courseId', getCourseEnrollments);

export default router;
