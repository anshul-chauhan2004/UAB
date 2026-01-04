import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Message extends RowDataPacket {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    sent_at: Date;
    is_read: boolean;
    sender_name?: string;
    receiver_name?: string;
}

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { otherUserId } = req.query;

        if (!otherUserId) {
            res.status(400).json({ error: 'otherUserId is required' });
            return;
        }

        const [messages] = await pool.query<Message[]>(
            `SELECT m.*, 
              s.name as sender_name, 
              r.name as receiver_name 
       FROM messages m 
       JOIN users s ON m.sender_id = s.id 
       JOIN users r ON m.receiver_id = r.id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) 
          OR (m.sender_id = ? AND m.receiver_id = ?) 
       ORDER BY m.sent_at ASC`,
            [user.userId, otherUserId, otherUserId, user.userId]
        );

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { receiverId, content } = req.body;

        // Verify receiver exists
        const [receivers] = await pool.query<RowDataPacket[]>(
            'SELECT id, name FROM users WHERE id = ?',
            [receiverId]
        );

        if (receivers.length === 0) {
            res.status(404).json({ error: 'Receiver not found' });
            return;
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [user.userId, receiverId, content]
        );

        const messageId = result.insertId;

        // Fetch the message
        const [messages] = await pool.query<Message[]>(
            `SELECT m.*, 
              s.name as sender_name, 
              r.name as receiver_name 
       FROM messages m 
       JOIN users s ON m.sender_id = s.id 
       JOIN users r ON m.receiver_id = r.id 
       WHERE m.id = ?`,
            [messageId]
        );

        const message = messages[0];

        // Broadcast to receiver
        getIO().to(`user_${receiverId}`).emit('message:received', message);

        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const messageId = parseInt(req.params.id);

        // Verify receiver
        const [messages] = await pool.query<Message[]>(
            'SELECT * FROM messages WHERE id = ? AND receiver_id = ?',
            [messageId, user.userId]
        );

        if (messages.length === 0) {
            res.status(404).json({ error: 'Message not found' });
            return;
        }

        await pool.query(
            'UPDATE messages SET is_read = TRUE WHERE id = ?',
            [messageId]
        );

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark message as read error:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
};

export const getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        // Get list of users with whom the current user has conversations
        const [conversations] = await pool.query<RowDataPacket[]>(
            `SELECT DISTINCT 
              u.id, 
              u.name, 
              u.email, 
              u.role,
              (SELECT content FROM messages 
               WHERE (sender_id = u.id AND receiver_id = ?) 
                  OR (sender_id = ? AND receiver_id = u.id) 
               ORDER BY sent_at DESC LIMIT 1) as last_message,
              (SELECT sent_at FROM messages 
               WHERE (sender_id = u.id AND receiver_id = ?) 
                  OR (sender_id = ? AND receiver_id = u.id) 
               ORDER BY sent_at DESC LIMIT 1) as last_message_at,
              (SELECT COUNT(*) FROM messages 
               WHERE sender_id = u.id AND receiver_id = ? AND is_read = FALSE) as unread_count
       FROM users u 
       WHERE u.id != ? 
         AND EXISTS (
           SELECT 1 FROM messages 
           WHERE (sender_id = u.id AND receiver_id = ?) 
              OR (sender_id = ? AND receiver_id = u.id)
         )
       ORDER BY last_message_at DESC`,
            [user.userId, user.userId, user.userId, user.userId, user.userId, user.userId, user.userId, user.userId]
        );

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};
