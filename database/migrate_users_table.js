require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const dbName = process.env.DB_NAME || 'uab_institute';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });
  try {
    console.log(`🔧 Running migrations against database: ${dbName}`);

    // Ensure database exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    // Helper to check column existence
    async function hasColumn(table, column) {
      const [rows] = await connection.query(
        `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
        [dbName, table, column]
      );
      return rows.length > 0;
    }

    // Users table columns
    if (!(await hasColumn('users', 'username'))) {
      console.log('➡️  Adding column users.username (nullable)');
      await connection.query(`ALTER TABLE users ADD COLUMN username VARCHAR(255) NULL AFTER email`);
      console.log('➡️  Backfilling users.username with id for uniqueness');
      await connection.query(`UPDATE users SET username = id WHERE username IS NULL OR username = ''`);
      console.log('➡️  Making users.username UNIQUE NOT NULL');
      await connection.query(`ALTER TABLE users MODIFY COLUMN username VARCHAR(255) NOT NULL, ADD UNIQUE (username)`);
    }
    if (!(await hasColumn('users', 'studentId'))) {
      console.log('➡️  Adding column users.studentId');
      await connection.query(`ALTER TABLE users ADD COLUMN studentId VARCHAR(50) AFTER stream`);
    }
    if (!(await hasColumn('users', 'teacherId'))) {
      console.log('➡️  Adding column users.teacherId');
      await connection.query(`ALTER TABLE users ADD COLUMN teacherId VARCHAR(50) AFTER studentId`);
    }

    // Courses table: enrolled
    async function hasTable(table) {
      const [rows] = await connection.query(
        `SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1`,
        [dbName, table]
      );
      return rows.length > 0;
    }

    if (!(await hasColumn('courses', 'enrolled'))) {
      console.log('➡️  Adding column courses.enrolled');
      await connection.query(`ALTER TABLE courses ADD COLUMN enrolled INT DEFAULT 0 AFTER capacity`);
    }

    // Departments table
    if (!(await hasTable('departments'))) {
      console.log('➡️  Creating table departments');
      await connection.query(`
        CREATE TABLE departments (
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
        ) ENGINE=InnoDB;
      `);
    }

    // Announcements table
    if (!(await hasTable('announcements'))) {
      console.log('➡️  Creating table announcements');
      await connection.query(`
        CREATE TABLE announcements (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          department VARCHAR(100),
          author VARCHAR(255),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
    }

    console.log('✅ Migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

migrate();
