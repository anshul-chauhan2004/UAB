const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const pool = require('../../database/config');

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, username, password, role, department, stream } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if user exists (email or username)
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const id = randomUUID();
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role || 'student';
    const studentId = userRole === 'student' ? 'UAB' + Date.now().toString().slice(-6) : null;
    const teacherId = userRole === 'teacher' ? 'T' + Date.now().toString().slice(-4) : null;

    await pool.query(
      `INSERT INTO users (id, fullName, email, username, password, role, department, stream, studentId, teacherId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, fullName, email, username, hashed, userRole, department || null, stream || null, studentId, teacherId]
    );

    const token = jwt.sign(
      { userId: id, role: userRole },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id,
        fullName,
        email,
        username,
        role: userRole,
        studentId,
        teacherId,
        department: department || null,
        stream: stream || null
      }
    });
  } catch (error) {
    let message = 'Server error';
    if (error?.code === 'ER_DUP_ENTRY') {
      message = 'Email or username already exists';
    } else if (error?.sqlMessage) {
      message = error.sqlMessage;
    } else if (error?.message) {
      message = error.message;
    }
    res.status(500).json({ message, error: error?.code || 'UNKNOWN_ERROR' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      'SELECT id, fullName, email, username, password, role, department, stream, studentId, teacherId FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        studentId: user.studentId,
        teacherId: user.teacherId,
        department: user.department,
        stream: user.stream
      }
    });
  } catch (error) {
    let message = 'Server error';
    if (error?.message) message = error.message;
    res.status(500).json({ message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const [rows] = await pool.query(
      'SELECT id, fullName, email, username, role, department, stream, studentId, teacherId FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
