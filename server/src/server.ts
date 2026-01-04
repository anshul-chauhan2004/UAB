import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initializeSocket } from './config/socket';
import pool from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import coursesRoutes from './routes/courses.routes';
import enrollmentsRoutes from './routes/enrollments.routes';
import assignmentsRoutes from './routes/assignments.routes';
import assessmentsRoutes from './routes/assessments.routes';
import attendanceRoutes from './routes/attendance.routes';
import marksRoutes from './routes/marks.routes';
import notificationsRoutes from './routes/notifications.routes';
import messagesRoutes from './routes/messages.routes';
import usersRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
initializeSocket(httpServer);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
// 404 handler (API only) - move this below static files
// app.use((_req, res) => {
//     res.status(404).json({ error: 'Route not found' });
// });

import path from 'path';

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
} else {
    // In development or if not matching static files, 404 for API
    app.use((_req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
}

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready for real-time connections`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    httpServer.close(() => {
        console.log('Server closed');
        pool.end();
        process.exit(0);
    });
});
