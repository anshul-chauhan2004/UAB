import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { generateToken } from '../utils/jwt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
    role: 'teacher' | 'student';
    department: string;
    name: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, role, department, name } = req.body;

        // Check if user already exists
        const [existing] = await pool.query<User[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (email, password_hash, role, department, name) VALUES (?, ?, ?, ?, ?)',
            [email, password_hash, role, department, name]
        );

        const userId = result.insertId;

        // Generate token
        const token = generateToken({
            userId,
            email,
            role,
            department
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email,
                role,
                department,
                name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, role } = req.body; // Added role extraction

        // Find user
        const [users] = await pool.query<User[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = users[0];

        // 🔍 Verify Role Match
        if (role && user.role !== role) {
            res.status(401).json({ error: `Please log in as a ${user.role}` });
            return;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            department: user.department
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
