import { Request, Response } from 'express';
import pool from '../config/database';
import { getIO } from '../config/socket';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Assessment extends RowDataPacket {
    id: number;
    course_id: number;
    title: string;
    type: string;
    max_marks: number;
    scheduled_at: Date;
    duration_minutes: number;
    questions: any;
    course_name?: string;
}

interface Attempt extends RowDataPacket {
    id: number;
    assessment_id: number;
    student_id: number;
    answers: any;
    submitted_at: Date;
    grade: number | null;
    graded_at: Date | null;
    feedback: string | null;
    student_name?: string;
    student_email?: string;
}

export const getAssessments = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId } = req.query;

        let query = '';
        let params: any[] = [];

        if (user.role === 'teacher') {
            query = `
        SELECT a.*, c.name as course_name 
        FROM assessments a 
        JOIN courses c ON a.course_id = c.id 
        WHERE c.teacher_id = ?
      `;
            params = [user.userId];

            if (courseId) {
                query += ' AND a.course_id = ?';
                params.push(courseId);
            }
        } else {
            query = `
        SELECT a.*, c.name as course_name, at.grade, at.submitted_at 
        FROM assessments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN enrollments e ON c.id = e.course_id 
        LEFT JOIN assessment_attempts at ON a.id = at.assessment_id AND at.student_id = ?
        WHERE e.student_id = ?
      `;
            params = [user.userId, user.userId];

            if (courseId) {
                query += ' AND a.course_id = ?';
                params.push(courseId);
            }
        }

        query += ' ORDER BY a.scheduled_at DESC';

        const [assessments] = await pool.query<Assessment[]>(query, params);
        res.json(assessments);
    } catch (error) {
        console.error('Get assessments error:', error);
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
};

export const createAssessment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { courseId, title, type, maxMarks, scheduledAt, durationMinutes, questions } = req.body;

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
            `INSERT INTO assessments (course_id, title, type, max_marks, scheduled_at, duration_minutes, questions) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [courseId, title, type, maxMarks, scheduledAt, durationMinutes, JSON.stringify(questions)]
        );

        const assessmentId = result.insertId;

        // Fetch created assessment
        const [assessments] = await pool.query<Assessment[]>(
            'SELECT * FROM assessments WHERE id = ?',
            [assessmentId]
        );

        const assessment = assessments[0];

        // Get enrolled students
        const [students] = await pool.query<RowDataPacket[]>(
            'SELECT student_id FROM enrollments WHERE course_id = ?',
            [courseId]
        );

        // Create notifications for all enrolled students
        for (const student of students) {
            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, related_id) 
         VALUES (?, 'assessment', 'New Assessment', ?, ?)`,
                [student.student_id, `New ${type}: ${title}`, assessmentId]
            );

            // Broadcast to each student
            getIO().to(`user_${student.student_id}`).emit('assessment:created', assessment);
        }

        // Broadcast to course room
        getIO().to(`course_${courseId}`).emit('assessment:created', assessment);

        res.status(201).json({
            message: 'Assessment created successfully',
            assessment
        });
    } catch (error) {
        console.error('Create assessment error:', error);
        res.status(500).json({ error: 'Failed to create assessment' });
    }
};

export const updateAssessment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assessmentId = parseInt(req.params.id);
        const { title, type, maxMarks, scheduledAt, durationMinutes, questions } = req.body;

        // Verify ownership
        const [assessments] = await pool.query<Assessment[]>(
            `SELECT a.* FROM assessments a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [assessmentId, user.userId]
        );

        if (assessments.length === 0) {
            res.status(404).json({ error: 'Assessment not found or unauthorized' });
            return;
        }

        await pool.query(
            `UPDATE assessments 
       SET title = ?, type = ?, max_marks = ?, scheduled_at = ?, duration_minutes = ?, questions = ? 
       WHERE id = ?`,
            [title, type, maxMarks, scheduledAt, durationMinutes, JSON.stringify(questions), assessmentId]
        );

        // Fetch updated assessment
        const [updated] = await pool.query<Assessment[]>(
            'SELECT * FROM assessments WHERE id = ?',
            [assessmentId]
        );

        const assessment = updated[0];

        // Broadcast to course room
        getIO().to(`course_${assessment.course_id}`).emit('assessment:updated', assessment);

        res.json({
            message: 'Assessment updated successfully',
            assessment
        });
    } catch (error) {
        console.error('Update assessment error:', error);
        res.status(500).json({ error: 'Failed to update assessment' });
    }
};

export const submitAttempt = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assessmentId = parseInt(req.params.id);
        const { answers } = req.body;

        // Verify enrollment
        const [assessments] = await pool.query<Assessment[]>(
            `SELECT a.*, c.teacher_id 
       FROM assessments a 
       JOIN courses c ON a.course_id = c.id 
       JOIN enrollments e ON c.id = e.course_id 
       WHERE a.id = ? AND e.student_id = ?`,
            [assessmentId, user.userId]
        );

        if (assessments.length === 0) {
            res.status(404).json({ error: 'Assessment not found or not enrolled' });
            return;
        }

        const assessment = assessments[0];

        // Insert attempt
        await pool.query(
            `INSERT INTO assessment_attempts (assessment_id, student_id, answers) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE answers = ?, submitted_at = CURRENT_TIMESTAMP`,
            [assessmentId, user.userId, JSON.stringify(answers), JSON.stringify(answers)]
        );

        // Fetch attempt
        const [attempts] = await pool.query<Attempt[]>(
            `SELECT at.*, u.name as student_name, u.email as student_email 
       FROM assessment_attempts at 
       JOIN users u ON at.student_id = u.id 
       WHERE at.assessment_id = ? AND at.student_id = ?`,
            [assessmentId, user.userId]
        );

        const attempt = attempts[0];

        // Notify teacher
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'attempt', 'New Assessment Attempt', ?, ?)`,
            [assessment.teacher_id, `${user.email} completed ${assessment.title}`, assessmentId]
        );

        // Broadcast to teacher
        getIO().to(`user_${assessment.teacher_id}`).emit('attempt:created', {
            ...attempt,
            assessmentTitle: assessment.title
        });

        res.status(201).json({
            message: 'Assessment attempt submitted successfully',
            attempt
        });
    } catch (error) {
        console.error('Submit attempt error:', error);
        res.status(500).json({ error: 'Failed to submit attempt' });
    }
};

export const gradeAttempt = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assessmentId = parseInt(req.params.id);
        const attemptId = parseInt(req.params.attemptId);
        const { grade, feedback } = req.body;

        // Verify ownership
        const [attempts] = await pool.query<Attempt[]>(
            `SELECT at.*, a.max_marks, a.course_id 
       FROM assessment_attempts at 
       JOIN assessments a ON at.assessment_id = a.id 
       JOIN courses c ON a.course_id = c.id 
       WHERE at.id = ? AND a.id = ? AND c.teacher_id = ?`,
            [attemptId, assessmentId, user.userId]
        );

        if (attempts.length === 0) {
            res.status(404).json({ error: 'Attempt not found or unauthorized' });
            return;
        }

        const attempt = attempts[0];

        // Validate grade
        if (grade < 0 || grade > attempt.max_marks) {
            res.status(400).json({ error: `Grade must be between 0 and ${attempt.max_marks}` });
            return;
        }

        await pool.query(
            `UPDATE assessment_attempts 
       SET grade = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
            [grade, feedback, attemptId]
        );

        // Notify student
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, 'grade', 'Assessment Graded', ?, ?)`,
            [attempt.student_id, `Your assessment has been graded: ${grade}/${attempt.max_marks}`, assessmentId]
        );

        // Broadcast to student
        getIO().to(`user_${attempt.student_id}`).emit('assessment:graded', {
            assessmentId,
            attemptId,
            grade,
            feedback,
            maxMarks: attempt.max_marks
        });

        res.json({
            message: 'Attempt graded successfully',
            grade,
            feedback
        });
    } catch (error) {
        console.error('Grade attempt error:', error);
        res.status(500).json({ error: 'Failed to grade attempt' });
    }
};

export const getAttempts = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const assessmentId = parseInt(req.params.id);

        // Verify ownership
        const [assessments] = await pool.query<Assessment[]>(
            `SELECT a.* FROM assessments a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.id = ? AND c.teacher_id = ?`,
            [assessmentId, user.userId]
        );

        if (assessments.length === 0) {
            res.status(404).json({ error: 'Assessment not found or unauthorized' });
            return;
        }

        const [attempts] = await pool.query<Attempt[]>(
            `SELECT at.*, u.name as student_name, u.email as student_email 
       FROM assessment_attempts at 
       JOIN users u ON at.student_id = u.id 
       WHERE at.assessment_id = ? 
       ORDER BY at.submitted_at DESC`,
            [assessmentId]
        );

        res.json(attempts);
    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({ error: 'Failed to fetch attempts' });
    }
};
