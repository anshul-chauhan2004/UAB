# UAB Learning Management System - Setup Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd /Users/anshulchauhan/Desktop/Projects/UAB_Institute_Management_System/UAB/server
npm install
```

### 2. Configure Database
Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=uab_lms
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Setup Database Schema
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE uab_lms;"

# Run schema setup
npm run db:setup
```

### 4. Start Backend Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### 5. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 6. Start Frontend
```bash
npm start
```
Frontend runs on http://localhost:3000

## What's Been Built

### ✅ Complete Backend (Fully Functional)
- Express + TypeScript server
- MySQL database with complete schema
- JWT authentication
- Socket.IO real-time integration
- All REST APIs (courses, assignments, assessments, attendance, marks, notifications, messages)
- Role-based access control
- Real-time broadcasts for all actions

### ✅ Frontend Infrastructure
- React + TypeScript setup
- Axios API service with JWT interceptor
- Socket.IO client service
- Authentication context
- Custom hooks (useRealtime, useOptimistic)
- Login/Register page

### 🚧 To Complete (Frontend UI Components)
You need to create the dashboard pages using the provided infrastructure. All the API calls and real-time subscriptions are ready to use.

## Testing the System

### Register Users
```bash
# Teacher
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"test123","role":"teacher","department":"Computer Science","name":"Test Teacher"}'

# Student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"test123","role":"student","department":"Computer Science","name":"Test Student"}'
```

## Key Files Created

### Backend
- `server/src/server.ts` - Main server file
- `server/src/config/database.ts` - MySQL connection
- `server/src/config/socket.ts` - Socket.IO setup
- `server/src/controllers/*` - All business logic
- `server/src/routes/*` - All API routes
- `server/src/middleware/auth.ts` - JWT authentication
- `server/src/database/schema.sql` - Complete database schema

### Frontend
- `client/src/services/api.ts` - Axios instance with JWT
- `client/src/services/socket.ts` - Socket.IO client
- `client/src/context/AuthContext.tsx` - Authentication state
- `client/src/hooks/useRealtime.ts` - Real-time event hook
- `client/src/hooks/useOptimistic.ts` - Optimistic UI hook
- `client/src/pages/Login.tsx` - Login/Register page
