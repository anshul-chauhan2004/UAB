import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Assignment extends RowDataPacket {
    id: number;
    course_id: number;
    title: string;
    description: string;
    due_date: Date;
    max_marks: number;
    course_name?: string;
}

interface Submission extends RowDataPacket {
    id: number;
    assignment_id: number;
    student_id: number;
    content: string;
    submitted_at: Date;
    grade: number | null;
    graded_at: Date | null;
    feedback: string | null;
    student_name?: string;
    student_email?: string;
}

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId } = req.query;

        let query = '';
        let params: any[] = [];

        if (user.role === 'teacher') {
            query = `
        SELECT a.*, c.name as course_name 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        WHERE c.teacher_id = ?
      `;
            params = [user.userId];

            if (courseId) {
                query += ' AND a.course_id = ?';
                params.push(courseId);
            }
        } else {
            // Students see assignments from enrolled courses
            query = `
        SELECT a.*, c.name as course_name, s.grade, s.submitted_at 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN enrollments e ON c.id = e.course_id 
        LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
        WHERE e.student_id = ?
      `;
            params = [user.userId, user.userId];

            if (courseId) {
                query += ' AND a.course_id = ?';
                params.push(courseId);
            }
        }

        query += ' ORDER BY a.due_date DESC';

        const [assignments] = await pool.query<Assignment[]>(query, params);
        res.json(assignments);
    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, title, description, dueDate, maxMarks } = req.body;

        // Verify course ownership
        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
            [courseId, user.userId]
        );

        if (courses.length === 0) {
            res.status(404).json({ error: 'Course not found or unauthorized' });
            return;
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO assignments (course_id, title, description, due_date, max_marks) 
       VALUES (?, ?, ?, ?, ?)`,
            [courseId, title, description, dueDate, maxMarks]
        );

        const assignmentId = result.insertId;

        // Fetch created assignment
        const [assignments] = await pool.query<Assignment[]>(
            'SELECT * FROM assignments WHERE id = ?',
            [assignmentId]
        );

        const assignment = assignments[0];

        // Get enrolled students
        const [students] = await pool.query<RowDataPacket[]>(
            'SELECT student_id FROM enrollments WHERE course_id = ?',
            [courseId]
        );

        // Create notifications for all enrolled students
        for (const student of students) {
            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, related_id) 
         VALUES (?, 'assignment', 'New Assignment', ?, ?)`,
                [student.student_id, `New assignment: ${title}`, assignmentId]
            );

            // Broadcast to each student
            getIO().to(`user_${student.student_id}`).emit('assignment:created', assignment);
        }

        // Broadcast to course room
        getIO().to(`course_${courseId}`).emit('assignment:created', assignment);

        res.status(201).json({
            message: 'Assignment created successfully',
            assignment
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
};

export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assignmentId = parseInt(req.params.id);
        const { title, description, dueDate, maxMarks } = req.body;

        // Verify ownership
        const [assignments] = await pool.query<Assignment[]>(
            `SELECT a.* FROM assignments a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [assignmentId, user.userId]
        );

        if (assignments.length === 0) {
            res.status(404).json({ error: 'Assignment not found or unauthorized' });
            return;
        }

        await pool.query(
            `UPDATE assignments 
       SET title = ?, description = ?, due_date = ?, max_marks = ? 
       WHERE id = ?`,
            [title, description, dueDate, maxMarks, assignmentId]
        );

        // Fetch updated assignment
        const [updated] = await pool.query<Assignment[]>(
            'SELECT * FROM assignments WHERE id = ?',
            [assignmentId]
        );

        const assignment = updated[0];

        // Broadcast to course room
        getIO().to(`course_${assignment.course_id}`).emit('assignment:updated', assignment);

        res.json({
            message: 'Assignment updated successfully',
            assignment
        });
    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({ error: 'Failed to update assignment' });
    }
};

export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assignmentId = parseInt(req.params.id);
        const { content } = req.body;

        // Verify enrollment
        const [assignments] = await pool.query<Assignment[]>(
            `SELECT a.*, c.teacher_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.id 
       JOIN enrollments e ON c.id = e.course_id 
       WHERE a.id = ? AND e.student_id = ?`,
            [assignmentId, user.userId]
        );

        if (assignments.length === 0) {
            res.status(404).json({ error: 'Assignment not found or not enrolled' });
            return;
        }

        const assignment = assignments[0];

        // Insert or update submission
        await pool.query(
            `INSERT INTO assignment_submissions (assignment_id, student_id, content) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE content = ?, submitted_at = CURRENT_TIMESTAMP`,
            [assignmentId, user.userId, content, content]
        );

        // Fetch submission
        const [submissions] = await pool.query<Submission[]>(
            `SELECT s.*, u.name as student_name, u.email as student_email 
       FROM assignment_submissions s 
       JOIN users u ON s.student_id = u.id 
       WHERE s.assignment_id = ? AND s.student_id = ?`,
            [assignmentId, user.userId]
        );

        const submission = submissions[0];

        // Notify teacher
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'submission', 'New Submission', ?, ?)`,
            [assignment.teacher_id, `${user.email} submitted ${assignment.title}`, assignmentId]
        );

        // Broadcast to teacher
        getIO().to(`user_${assignment.teacher_id}`).emit('submission:created', {
            ...submission,
            assignmentTitle: assignment.title
        });

        res.status(201).json({
            message: 'Assignment submitted successfully',
            submission
        });
    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({ error: 'Failed to submit assignment' });
    }
};

export const gradeSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assignmentId = parseInt(req.params.id);
        const submissionId = parseInt(req.params.submissionId);
        const { grade, feedback } = req.body;

        // Verify ownership
        const [submissions] = await pool.query<Submission[]>(
            `SELECT s.*, a.max_marks, a.course_id 
       FROM assignment_submissions s 
       JOIN assignments a ON s.assignment_id = a.id 
       JOIN courses c ON a.course_id = c.id 
       WHERE s.id = ? AND a.id = ? AND c.teacher_id = ?`,
            [submissionId, assignmentId, user.userId]
        );

        if (submissions.length === 0) {
            res.status(404).json({ error: 'Submission not found or unauthorized' });
            return;
        }

        const submission = submissions[0];

        // Validate grade
        if (grade < 0 || grade > submission.max_marks) {
            res.status(400).json({ error: `Grade must be between 0 and ${submission.max_marks}` });
            return;
        }

        await pool.query(
            `UPDATE assignment_submissions 
       SET grade = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
            [grade, feedback, submissionId]
        );

        // Notify student
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'grade', 'Assignment Graded', ?, ?)`,
            [submission.student_id, `Your assignment has been graded: ${grade}/${submission.max_marks}`, assignmentId]
        );

        // Broadcast to student
        getIO().to(`user_${submission.student_id}`).emit('assignment:graded', {
            assignmentId,
            submissionId,
            grade,
            feedback,
            maxMarks: submission.max_marks
        });

        res.json({
            message: 'Submission graded successfully',
            grade,
            feedback
        });
    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({ error: 'Failed to grade submission' });
    }
};

export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assignmentId = parseInt(req.params.id);

        // Verify ownership
        const [assignments] = await pool.query<Assignment[]>(
            `SELECT a.* FROM assignments a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [assignmentId, user.userId]
        );

        if (assignments.length === 0) {
            res.status(404).json({ error: 'Assignment not found or unauthorized' });
            return;
        }

        const [submissions] = await pool.query<Submission[]>(
            `SELECT s.*, u.name as student_name, u.email as student_email 
       FROM assignment_submissions s 
       JOIN users u ON s.student_id = u.id 
       WHERE s.assignment_id = ? 
       ORDER BY s.submitted_at DESC`,
            [assignmentId]
        );

        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assignmentId = parseInt(req.params.id);

        // Verify ownership
        const [assignments] = await pool.query<Assignment[]>(
            `SELECT a.* FROM assignments a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [assignmentId, user.userId]
        );

        if (assignments.length === 0) {
            res.status(404).json({ error: 'Assignment not found or unauthorized' });
            return;
        }

        const assignment = assignments[0];

        await pool.query('DELETE FROM assignments WHERE id = ?', [assignmentId]);

        // Broadcast to course room
        getIO().to(`course_${assignment.course_id}`).emit('assignment:deleted', { id: assignmentId });

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({ error: 'Failed to delete assignment' });
    }
};
