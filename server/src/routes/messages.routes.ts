import { Router } from 'express';
import { body } from 'express-validator';
import {
    getMessages,
    sendMessage,
    markMessageAsRead,
    getConversations
} from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get conversations list
router.get('/conversations', getConversations);

// Get messages with specific user
router.get('/', getMessages);

// Send message
router.post(
    '/',
    validate([
        body('receiverId').isInt(),
        body('content').notEmpty().trim()
    ]),
    sendMessage
);

// Mark message as read
router.put('/:id/read', markMessageAsRead);

export default router;
