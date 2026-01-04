import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface InternalMark extends RowDataPacket {
    id: number;
    course_id: number;
    student_id: number;
    component: string;
    marks: number;
    max_marks: number;
    updated_at: Date;
    student_name?: string;
    course_name?: string;
}

export const getInternalMarks = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId } = req.query;

        let query = '';
        let params: any[] = [];

        if (user.role === 'teacher') {
            query = `
        SELECT im.*, u.name as student_name, c.name as course_name 
        FROM internal_marks im 
        JOIN users u ON im.student_id = u.id 
        JOIN courses c ON im.course_id = c.id 
        WHERE c.teacher_id = ?
      `;
            params = [user.userId];
        } else {
            query = `
        SELECT im.*, c.name as course_name 
        FROM internal_marks im 
        JOIN courses c ON im.course_id = c.id 
        WHERE im.student_id = ?
      `;
            params = [user.userId];
        }

        if (courseId) {
            query += ' AND im.course_id = ?';
            params.push(courseId);
        }

        query += ' ORDER BY c.name, im.component';

        const [marks] = await pool.query<InternalMark[]>(query, params);
        res.json(marks);
    } catch (error) {
        console.error('Get internal marks error:', error);
        res.status(500).json({ error: 'Failed to fetch internal marks' });
    }
};

export const setInternalMarks = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, studentId, component, marks, maxMarks } = req.body;

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

        // Validate marks
        if (marks < 0 || marks > maxMarks) {
            res.status(400).json({ error: `Marks must be between 0 and ${maxMarks}` });
            return;
        }

        // Insert or update internal marks
        await pool.query(
            `INSERT INTO internal_marks (course_id, student_id, component, marks, max_marks) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE marks = ?, max_marks = ?, updated_at = CURRENT_TIMESTAMP`,
            [courseId, studentId, component, marks, maxMarks, marks, maxMarks]
        );

        // Fetch the record
        const [internalMarks] = await pool.query<InternalMark[]>(
            `SELECT im.*, u.name as student_name, c.name as course_name 
       FROM internal_marks im 
       JOIN users u ON im.student_id = u.id 
       JOIN courses c ON im.course_id = c.id 
       WHERE im.course_id = ? AND im.student_id = ? AND im.component = ?`,
            [courseId, studentId, component]
        );

        const record = internalMarks[0];

        // Notify student
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'marks', 'Internal Marks Updated', ?, ?)`,
            [studentId, `${component} marks for ${courseName}: ${marks}/${maxMarks}`, courseId]
        );

        // Broadcast to student
        getIO().to(`user_${studentId}`).emit('marks:updated', record);

        res.status(201).json({
            message: 'Internal marks set successfully',
            marks: record
        });
    } catch (error) {
        console.error('Set internal marks error:', error);
        res.status(500).json({ error: 'Failed to set internal marks' });
    }
};
