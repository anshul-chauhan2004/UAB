import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Course extends RowDataPacket {
    id: number;
    code: string;
    name: string;
    department: string;
    teacher_id: number;
    semester: string;
    year: number;
    description: string;
    teacher_name?: string;
}

export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const browse = req.query.browse === 'true'; // Check if browsing all courses
        let query = '';
        let params: any[] = [];

        if (browse) {
            // When browsing, show all courses in the department
            query = `
        SELECT c.*, u.name as teacher_name 
        FROM courses c 
        LEFT JOIN users u ON c.teacher_id = u.id 
        WHERE c.department = ?
      `;
            params = [user.department];
        } else if (user.role === 'teacher') {
            // Teachers see only their assigned courses
            query = `
        SELECT c.*, u.name as teacher_name 
        FROM courses c 
        LEFT JOIN users u ON c.teacher_id = u.id 
        WHERE c.teacher_id = ?
      `;
            params = [user.userId];
        } else {
            // Students see courses in their department
            query = `
        SELECT c.*, u.name as teacher_name 
        FROM courses c 
        LEFT JOIN users u ON c.teacher_id = u.id 
        WHERE c.department = ?
      `;
            params = [user.department];
        }

        const [courses] = await pool.query<Course[]>(query, params);
        res.json({ courses });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { code, name, semester, year, description } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO courses (code, name, department, teacher_id, semester, year, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [code, name, user.department, user.userId, semester, year, description]
        );

        const courseId = result.insertId;

        // Fetch the created course
        const [courses] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ?',
            [courseId]
        );

        const course = courses[0];

        // Broadcast to department room
        getIO().to(`dept_${user.department}`).emit('course:created', course);

        res.status(201).json({
            message: 'Course created successfully',
            course
        });
    } catch (error: any) {
        console.error('Create course error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Course code already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create course' });
        }
    }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const courseId = parseInt(req.params.id);
        const { code, name, semester, year, description } = req.body;

        // Verify ownership
        const [courses] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
            [courseId, user.userId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or unauthorized' });
            return;
        }

        await pool.query(
            `UPDATE courses 
       SET code = ?, name = ?, semester = ?, year = ?, description = ? 
       WHERE id = ?`,
            [code, name, semester, year, description, courseId]
        );

        // Fetch updated course
        const [updated] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ?',
            [courseId]
        );

        const course = updated[0];

        // Broadcast to course room
        getIO().to(`course_${courseId}`).emit('course:updated', course);

        res.json({
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const courseId = parseInt(req.params.id);

        // Verify ownership
        const [courses] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
            [courseId, user.userId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or unauthorized' });
            return;
        }

        await pool.query('DELETE FROM courses WHERE id = ?', [courseId]);

        // Broadcast to course room
        getIO().to(`course_${courseId}`).emit('course:deleted', { courseId });

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};

export const getCourseStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseId = parseInt(req.params.id);

        const [students] = await pool.query<RowDataPacket[]>(
            `SELECT u.id, u.name, u.email, e.enrolled_at 
       FROM enrollments e 
       JOIN users u ON e.student_id = u.id 
       WHERE e.course_id = ?
       ORDER BY u.name`,
            [courseId]
        );

        res.json(students);
    } catch (error) {
        console.error('Get course students error:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

export const assignTeacherToCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const courseId = parseInt(req.params.id);

        // Check if course exists
        const [courses] = await pool.query<Course[]>(
            'SELECT * FROM courses WHERE id = ?',
            [courseId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }

        const course = courses[0];

        // Check if teacher is already assigned to this course
        if (course.teacher_id === user.userId) {
            res.status(400).json({ error: 'You are already teaching this course' });
            return;
        }

        // Assign/reassign teacher to course
        await pool.query(
            'UPDATE courses SET teacher_id = ? WHERE id = ?',
            [user.userId, courseId]
        );

        // Fetch updated course
        const [updated] = await pool.query<Course[]>(
            'SELECT c.*, u.name as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.id = ?',
            [courseId]
        );

        // Broadcast to department room
        getIO().to(`dept_${user.department}`).emit('course:assigned', updated[0]);

        res.json({
            message: 'Course assigned successfully',
            course: updated[0]
        });
    } catch (error) {
        console.error('Assign teacher error:', error);
        res.status(500).json({ error: 'Failed to assign teacher to course' });
    }
};
