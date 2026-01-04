import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Enrollment extends RowDataPacket {
    id: number;
    student_id: number;
    course_id: number;
    enrolled_at: Date;
}

interface Course extends RowDataPacket {
    id: number;
    code: string;
    name: string;
    department: string;
    teacher_id: number;
    semester: string;
    year: number;
}

export const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId } = req.body;

        // Verify course exists and is in student's department
        const [courses] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ? AND department = ?',
            [courseId, user.department]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or not in your department' });
            return;
        }

        // Check if already enrolled
        const [existing] = await pool.query<Enrollment[]>(
            'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
            [user.userId, courseId]
        );

        if (existing.length > 0) {
            res.status(400).json({ error: 'Already enrolled in this course' });
            return;
        }

        // Enroll student
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [user.userId, courseId]
        );

        // Create notification for teacher only if assigned
        if (courses[0].teacher_id) {
            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'enrollment', 'New Enrollment', ?, ?)`,
                [
                    courses[0].teacher_id,
                    `${user.email} enrolled in ${courses[0].name}`,
                    courseId
                ]
            );

            // Broadcast to teacher
            getIO().to(`user_${courses[0].teacher_id}`).emit('enrollment:created', {
                studentId: user.userId,
                studentEmail: user.email,
                courseId,
                courseName: courses[0].name
            });
        }

        res.status(201).json({
            message: 'Enrolled successfully',
            enrollmentId: result.insertId
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Failed to enroll' });
    }
};

export const unenrollFromCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const enrollmentId = parseInt(req.params.id);

        // Verify ownership
        const [enrollments] = await pool.query<Enrollment[]>(
            'SELECT * FROM enrollments WHERE id = ? AND student_id = ?',
            [enrollmentId, user.userId]
        );

        if (enrollments.length === 0) {
            res.status(404).json({ error: 'Enrollment not found' });
            return;
        }

        await pool.query('DELETE FROM enrollments WHERE id = ?', [enrollmentId]);

        res.json({ message: 'Unenrolled successfully' });
    } catch (error) {
        console.error('Unenrollment error:', error);
        res.status(500).json({ error: 'Failed to unenroll' });
    }
};

export const getMyCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const [courses] = await pool.query<RowDataPacket[]>(
            `SELECT c.*, u.name as teacher_name, u.email as teacher_email, e.enrolled_at, e.id as enrollment_id 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       LEFT JOIN users u ON c.teacher_id = u.id 
       WHERE e.student_id = ?
       ORDER BY c.name`,
            [user.userId]
        );

        res.json(courses);
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

export const getCourseEnrollments = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseId = parseInt(req.params.courseId);

        const [enrollments] = await pool.query<RowDataPacket[]>(
            `SELECT u.id, u.name, u.email, e.enrolled_at 
       FROM enrollments e 
       JOIN users u ON e.student_id = u.id 
       WHERE e.course_id = ?
       ORDER BY u.name`,
            [courseId]
        );

        res.json({ enrollments });
    } catch (error) {
        console.error('Get course enrollments error:', error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
};
