import { Router } from 'express';
import { body } from 'express-validator';
import { updateProfile } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Update profile
router.put(
    '/profile',
    validate([
        body('email').optional().isEmail().normalizeEmail(),
        body('name').optional().notEmpty().trim(),
        body('department').optional().trim()
    ]),
    updateProfile
);

export default router;
