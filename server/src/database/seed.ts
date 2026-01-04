import bcrypt from 'bcryptjs';
import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database with real data...');

        // Create teachers
        const teachers = [
            { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@uab.edu', department: 'Computer Science', password: 'teacher123' },
            { name: 'Dr. Michael Chen', email: 'michael.chen@uab.edu', department: 'Computer Science', password: 'teacher123' },
            { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@uab.edu', department: 'Computer Science', password: 'teacher123' },
            { name: 'Prof. David Williams', email: 'david.williams@uab.edu', department: 'Mathematics', password: 'teacher123' },
            { name: 'Dr. Lisa Anderson', email: 'lisa.anderson@uab.edu', department: 'Physics', password: 'teacher123' },
            { name: 'Prof. James Taylor', email: 'james.taylor@uab.edu', department: 'Chemistry', password: 'teacher123' }
        ];

        const teacherIds: number[] = [];

        for (const teacher of teachers) {
            const hashedPassword = await bcrypt.hash(teacher.password, 10);
            const [result] = await pool.query<any>(
                'INSERT INTO users (email, password_hash, role, department, name) VALUES (?, ?, ?, ?, ?)',
                [teacher.email, hashedPassword, 'teacher', teacher.department, teacher.name]
            );
            teacherIds.push(result.insertId);
            console.log(`✅ Created teacher: ${teacher.name}`);
        }

        // Create courses
        const courses = [
            { code: 'CS101', name: 'Introduction to Programming', department: 'Computer Science', teacherId: teacherIds[0], semester: 'Fall', year: 2024, description: 'Learn the fundamentals of programming using Python' },
            { code: 'CS201', name: 'Data Structures and Algorithms', department: 'Computer Science', teacherId: teacherIds[0], semester: 'Fall', year: 2024, description: 'Study essential data structures and algorithmic techniques' },
            { code: 'CS301', name: 'Database Systems', department: 'Computer Science', teacherId: teacherIds[1], semester: 'Fall', year: 2024, description: 'Design and implementation of database systems' },
            { code: 'CS401', name: 'Web Development', department: 'Computer Science', teacherId: teacherIds[1], semester: 'Fall', year: 2024, description: 'Modern web development with React and Node.js' },
            { code: 'CS501', name: 'Machine Learning', department: 'Computer Science', teacherId: teacherIds[2], semester: 'Fall', year: 2024, description: 'Introduction to machine learning algorithms and applications' },
            { code: 'MATH201', name: 'Calculus II', department: 'Mathematics', teacherId: teacherIds[3], semester: 'Fall', year: 2024, description: 'Advanced calculus topics including integration techniques' },
            { code: 'PHY101', name: 'Physics I', department: 'Physics', teacherId: teacherIds[4], semester: 'Fall', year: 2024, description: 'Classical mechanics and thermodynamics' },
            { code: 'CHEM101', name: 'General Chemistry', department: 'Chemistry', teacherId: teacherIds[5], semester: 'Fall', year: 2024, description: 'Fundamental principles of chemistry' }
        ];

        const courseIds: number[] = [];

        for (const course of courses) {
            const [result] = await pool.query<any>(
                'INSERT INTO courses (code, name, department, teacher_id, semester, year, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [course.code, course.name, course.department, course.teacherId, course.semester, course.year, course.description]
            );
            courseIds.push(result.insertId);
            console.log(`✅ Created course: ${course.code} - ${course.name}`);
        }

        // Create sample assignments for each course
        for (let i = 0; i < courseIds.length; i++) {
            const courseId = courseIds[i];
            const courseName = courses[i].name;

            // Assignment 1
            await pool.query(
                'INSERT INTO assignments (course_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?)',
                [
                    courseId,
                    `${courseName} - Assignment 1`,
                    'Complete the first assignment covering introductory topics',
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
                    100
                ]
            );

            // Assignment 2
            await pool.query(
                'INSERT INTO assignments (course_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?)',
                [
                    courseId,
                    `${courseName} - Assignment 2`,
                    'Mid-term assignment covering advanced concepts',
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 14 days
                    100
                ]
            );

            console.log(`✅ Created assignments for: ${courseName}`);
        }

        // Create sample assessments
        for (let i = 0; i < courseIds.length; i++) {
            const courseId = courseIds[i];
            const courseName = courses[i].name;

            await pool.query(
                'INSERT INTO assessments (course_id, title, type, max_marks, scheduled_at, duration_minutes, questions) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    courseId,
                    `${courseName} - Midterm Exam`,
                    'midterm',
                    100,
                    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // In 21 days
                    120,
                    JSON.stringify([
                        { question: 'Sample question 1', type: 'multiple-choice', options: ['A', 'B', 'C', 'D'] },
                        { question: 'Sample question 2', type: 'short-answer' }
                    ])
                ]
            );

            console.log(`✅ Created assessment for: ${courseName}`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Teachers: ${teachers.length}`);
        console.log(`   - Courses: ${courses.length}`);
        console.log(`   - Assignments: ${courses.length * 2}`);
        console.log(`   - Assessments: ${courses.length}`);
        console.log('\n🔐 Teacher Login Credentials:');
        console.log('   Email: sarah.johnson@uab.edu');
        console.log('   Password: teacher123');
        console.log('\n   (All teachers have password: teacher123)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
