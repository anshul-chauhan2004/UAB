import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Notification extends RowDataPacket {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    related_id: number | null;
    is_read: boolean;
    created_at: Date;
}

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { limit = 50, offset = 0 } = req.query;

        const [notifications] = await pool.query<Notification[]>(
            `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
            [user.userId, parseInt(limit as string), parseInt(offset as string)]
        );

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const [result] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [user.userId]
        );

        res.json({ unreadCount: result[0].count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const notificationId = parseInt(req.params.id);

        // Verify ownership
        const [notifications] = await pool.query<Notification[]>(
            'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, user.userId]
        );

        if (notifications.length === 0) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }

        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ?',
            [notificationId]
        );

        // Get updated unread count
        const [result] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [user.userId]
        );

        // Broadcast updated count to user
        getIO().to(`user_${user.userId}`).emit('notifications:unread_count', {
            unreadCount: result[0].count
        });

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
            [user.userId]
        );

        // Broadcast updated count to user
        getIO().to(`user_${user.userId}`).emit('notifications:unread_count', {
            unreadCount: 0
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
};
