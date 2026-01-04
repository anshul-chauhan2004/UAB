const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

async function setupDatabase() {
  console.log('🔧 Setting up UAB Institute MySQL Database...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📝 Creating database and tables...');
    await connection.query(schema);
    console.log('✅ Database schema created successfully!\n');

    // Insert sample data
    console.log('📝 Inserting sample data...');
    
    // Sample users with hashed passwords and usernames
    const teacherId = 'teacher-1';
    const studentId = 'student-1';
    const teacherPassword = await bcrypt.hash('password123', 10);
    const studentPassword = await bcrypt.hash('password123', 10);

    await connection.query(
      `INSERT IGNORE INTO uab_institute.users 
        (id, fullName, email, username, password, role, department, teacherId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        teacherId, 'Dr. Smith Johnson', 'teacher@uab.edu', 'teacher', teacherPassword, 'teacher', 'Computer Science', 'T0001',
        studentId, 'John Doe', 'student@uab.edu', 'student', studentPassword, 'student', 'Computer Science', null
      ]
    );

    // Sample courses
    await connection.query(`
      INSERT IGNORE INTO uab_institute.courses (id, courseCode, courseName, instructor, instructorEmail, department, semester, credits, stream, capacity, enrolled) 
      VALUES 
        ('course-1', 'CSE101', 'Introduction to Programming', 'Dr. Smith Johnson', 'teacher@uab.edu', 'Computer Science', 'Fall 2026', 4, 'CSE', 60, 0),
        ('course-2', 'CSE201', 'Data Structures', 'Dr. Smith Johnson', 'teacher@uab.edu', 'Computer Science', 'Fall 2026', 4, 'CSE', 50, 0),
        ('course-3', 'CSE301', 'Database Systems', 'Dr. Smith Johnson', 'teacher@uab.edu', 'Computer Science', 'Spring 2026', 4, 'CSE', 45, 0);
    `);

    // Sample departments
    await connection.query(`
      INSERT IGNORE INTO uab_institute.departments (id, name, code, description, head, contactEmail, contactPhone, building) VALUES 
      ('dept-1', 'Computer Science', 'CSE', 'Department of Computer Science and Engineering', 'Dr. Alice Brown', 'cse@uab.edu', '555-0100', 'Engineering Block A');
    `);

    // Sample announcements
    await connection.query(`
      INSERT IGNORE INTO uab_institute.announcements (id, title, content, department, author) VALUES 
      ('ann-1', 'Welcome Back!', 'Welcome to the new semester at UAB.', 'Computer Science', 'Admin');
    `);

    console.log('✅ Sample data inserted successfully!\n');
    console.log('🎉 Database setup complete!');
    console.log('\n📋 Summary:');
    console.log('   - Database: uab_institute');
    console.log('   - Tables: 11 tables created');
    console.log('   - Sample users: 1 teacher, 1 student');
    console.log('   - Sample courses: 3 courses\n');
    console.log('🔐 Default credentials:');
    console.log('   Teacher: teacher@uab.edu / password123');
    console.log('   Student: student@uab.edu / password123\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('✅ Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
