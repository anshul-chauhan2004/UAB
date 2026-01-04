import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Attendance extends RowDataPacket {
    id: number;
    course_id: number;
    student_id: number;
    date: string;
    status: 'present' | 'absent' | 'late';
    marked_by: number;
    marked_at: Date;
    student_name?: string;
    course_name?: string;
}

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, date } = req.query;

        let query = '';
        let params: any[] = [];

        if (user.role === 'teacher') {
            query = `
        SELECT a.*, u.name as student_name, c.name as course_name 
        FROM attendance a 
        JOIN users u ON a.student_id = u.id 
        JOIN courses c ON a.course_id = c.id 
        WHERE c.teacher_id = ?
      `;
            params = [user.userId];
        } else {
            query = `
        SELECT a.*, c.name as course_name 
        FROM attendance a 
        JOIN courses c ON a.course_id = c.id 
        WHERE a.student_id = ?
      `;
            params = [user.userId];
        }

        if (courseId) {
            query += ' AND a.course_id = ?';
            params.push(courseId);
        }

        if (date) {
            query += ' AND a.date = ?';
            params.push(date);
        }

        query += ' ORDER BY a.date DESC, a.course_id';

        const [attendance] = await pool.query<Attendance[]>(query, params);
        res.json(attendance);
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, studentId, date, status } = req.body;

        // Verify course ownership
        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
            [courseId, user.userId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or unauthorized' });
            return;
        }

        // Mark attendance (insert or update)
        await pool.query(
            `INSERT INTO attendance (course_id, student_id, date, status, marked_by) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?, marked_by = ?, marked_at = CURRENT_TIMESTAMP`,
            [courseId, studentId, date, status, user.userId, status, user.userId]
        );

        // Fetch attendance record
        const [attendance] = await pool.query<Attendance[]>(
            `SELECT a.*, u.name as student_name, c.name as course_name 
       FROM attendance a 
       JOIN users u ON a.student_id = u.id 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.course_id = ? AND a.student_id = ? AND a.date = ?`,
            [courseId, studentId, date]
        );

        const record = attendance[0];

        // Notify student
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'attendance', 'Attendance Marked', ?, ?)`,
            [studentId, `Your attendance for ${date} has been marked as ${status}`, courseId]
        );

        // Broadcast to student
        getIO().to(`user_${studentId}`).emit('attendance:marked', record);

        res.status(201).json({
            message: 'Attendance marked successfully',
            attendance: record
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
};

export const markBulkAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, date, attendanceList } = req.body;

        // Verify course ownership
        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT id, name FROM courses WHERE id = ? AND teacher_id = ?',
            [courseId, user.userId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or unauthorized' });
            return;
        }

        const courseName = courses[0].name;

        // Mark attendance for each student
        for (const item of attendanceList) {
            await pool.query(
                `INSERT INTO attendance (course_id, student_id, date, status, marked_by) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE status = ?, marked_by = ?, marked_at = CURRENT_TIMESTAMP`,
                [courseId, item.studentId, date, item.status, user.userId, item.status, user.userId]
            );

            // Notify student
            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, related_id) 
         VALUES (?, 'attendance', 'Attendance Marked', ?, ?)`,
                [item.studentId, `Your attendance for ${courseName} on ${date} has been marked as ${item.status}`, courseId]
            );

            // Broadcast to student
            getIO().to(`user_${item.studentId}`).emit('attendance:marked', {
                courseId,
                courseName,
                date,
                status: item.status
            });
        }

        res.json({
            message: 'Bulk attendance marked successfully',
            count: attendanceList.length
        });
    } catch (error) {
        console.error('Bulk mark attendance error:', error);
        res.status(500).json({ error: 'Failed to mark bulk attendance' });
    }
};

export const updateAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const attendanceId = parseInt(req.params.id);
        const { status } = req.body;

        // Verify ownership
        const [attendance] = await pool.query<Attendance[]>(
            `SELECT a.*, c.teacher_id 
       FROM attendance a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [attendanceId, user.userId]
        );

        if (attendance.length === 0) {
            res.status(404).json({ error: 'Attendance record not found or unauthorized' });
            return;
        }

        const record = attendance[0];

        await pool.query(
            'UPDATE attendance SET status = ?, marked_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, attendanceId]
        );

        // Notify student
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'attendance', 'Attendance Updated', ?, ?)`,
            [record.student_id, `Your attendance has been updated to ${status}`, record.course_id]
        );

        // Broadcast to student
        getIO().to(`user_${record.student_id}`).emit('attendance:updated', {
            attendanceId,
            status,
            date: record.date
        });

        res.json({
            message: 'Attendance updated successfully',
            status
        });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ error: 'Failed to update attendance' });
    }
};
