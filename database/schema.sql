-- UAB Institute Management System Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS uab_institute;
USE uab_institute;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  department VARCHAR(100),
  stream VARCHAR(50),
  studentId VARCHAR(50),
  teacherId VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  courseCode VARCHAR(20) UNIQUE NOT NULL,
  courseName VARCHAR(255) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  instructorEmail VARCHAR(255),
  department VARCHAR(100) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  credits INT DEFAULT 4,
  stream VARCHAR(50),
  capacity INT DEFAULT 60,
  enrolled INT DEFAULT 0,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id VARCHAR(36) PRIMARY KEY,
  studentId VARCHAR(36) NOT NULL,
  studentName VARCHAR(255) NOT NULL,
  courseId VARCHAR(36) NOT NULL,
  courseCode VARCHAR(20) NOT NULL,
  courseName VARCHAR(255) NOT NULL,
  enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (studentId, courseId)
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  courseId VARCHAR(36) NOT NULL,
  dueDate DATETIME NOT NULL,
  maxMarks INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id VARCHAR(36) PRIMARY KEY,
  assignmentId VARCHAR(36) NOT NULL,
  studentId VARCHAR(36) NOT NULL,
  studentName VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  attachments JSON,
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('submitted', 'graded') DEFAULT 'submitted',
  grade INT,
  feedback TEXT,
  FOREIGN KEY (assignmentId) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_submission (assignmentId, studentId)
);

-- Assessments Table (Quizzes, Tests, Exams)
CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('quiz', 'test', 'exam', 'midterm', 'final') NOT NULL,
  courseId VARCHAR(36) NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in minutes',
  totalMarks INT NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id VARCHAR(36) PRIMARY KEY,
  assessmentId VARCHAR(36) NOT NULL,
  studentId VARCHAR(36) NOT NULL,
  studentName VARCHAR(255) NOT NULL,
  startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submittedAt DATETIME,
  status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
  answers JSON,
  score INT,
  feedback TEXT,
  FOREIGN KEY (assessmentId) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attempt (assessmentId, studentId)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(36) PRIMARY KEY,
  studentId VARCHAR(36) NOT NULL,
  courseId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  markedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (studentId, courseId, date)
);

-- Internal Marks Table
CREATE TABLE IF NOT EXISTS internal_marks (
  id VARCHAR(36) PRIMARY KEY,
  studentId VARCHAR(36) NOT NULL,
  courseId VARCHAR(36) NOT NULL,
  type ENUM('assignment', 'test', 'quiz', 'project', 'lab') NOT NULL,
  marks INT NOT NULL,
  maxMarks INT NOT NULL,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  relatedId VARCHAR(36),
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (userId, isRead),
  INDEX idx_created_at (createdAt DESC)
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  head VARCHAR(255),
  contactEmail VARCHAR(255),
  contactPhone VARCHAR(50),
  building VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  department VARCHAR(100),
  author VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_enrollments_student ON enrollments(studentId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);
CREATE INDEX idx_assignments_course ON assignments(courseId);
CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignmentId);
CREATE INDEX idx_submissions_student ON assignment_submissions(studentId);
CREATE INDEX idx_assessments_course ON assessments(courseId);
CREATE INDEX idx_attempts_assessment ON assessment_attempts(assessmentId);
CREATE INDEX idx_attempts_student ON assessment_attempts(studentId);
CREATE INDEX idx_attendance_student ON attendance(studentId);
CREATE INDEX idx_attendance_course ON attendance(courseId);
CREATE INDEX idx_marks_student ON internal_marks(studentId);
CREATE INDEX idx_marks_course ON internal_marks(courseId);
