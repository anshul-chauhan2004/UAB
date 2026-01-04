import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import dotenv from 'dotenv';

dotenv.config();

let io: Server;

export const initializeSocket = (httpServer: HTTPServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware for Socket.IO
    io.use((socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication token required'));
            }

            const decoded = verifyToken(token);
            socket.data.user = decoded;
            next();
        } catch (error) {
            next(new Error('Invalid authentication token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const user = socket.data.user;
        console.log(`✅ User connected: ${user.email} (${user.role})`);

        // Join user-specific room
        socket.join(`user_${user.userId}`);

        // Join department room
        socket.join(`dept_${user.department}`);

        // Handle joining course rooms
        socket.on('join_course', (courseId: number) => {
            socket.join(`course_${courseId}`);
            console.log(`User ${user.email} joined course_${courseId}`);
        });

        // Handle leaving course rooms
        socket.on('leave_course', (courseId: number) => {
            socket.leave(`course_${courseId}`);
            console.log(`User ${user.email} left course_${courseId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${user.email}`);
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};
