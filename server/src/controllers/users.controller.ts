import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { name, email, department } = req.body;

        // Check if email is taken by another user
        if (email) {
            const [existing] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, user.userId]
            );

            if (existing.length > 0) {
                res.status(400).json({ error: 'Email already in use' });
                return;
            }
        }

        // Build update query dynamically based on provided fields
        const updates: string[] = [];
        const values: any[] = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }

        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email);
        }

        if (department !== undefined) {
            updates.push('department = ?');
            values.push(department);
        }

        if (updates.length > 0) {
            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
            values.push(user.userId);
            await pool.query(query, values);
        }

        // Fetch updated user
        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT id, name, email, role, department, created_at FROM users WHERE id = ?',
            [user.userId]
        );

        res.json({
            message: 'Profile updated successfully',
            user: users[0]
        });
    } catch (error: any) {
        console.error('Update profile error details:', error);
        res.status(500).json({
            error: 'Failed to update profile',
            details: error.sqlMessage || error.message
        });
    }
};
