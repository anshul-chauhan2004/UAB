import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';

const router = Router();

// Register
router.post(
    '/register',
    validate([
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('role').isIn(['teacher', 'student']),
        body('department').notEmpty().trim(),
        body('name').notEmpty().trim()
    ]),
    register
);

// Login
router.post(
    '/login',
    validate([
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
    ]),
    login
);

export default router;
