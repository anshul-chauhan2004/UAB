import pool from '../config/database';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';

dotenv.config();

// Mapped based on Register.js departments and streams
const departments = {
    'Computer Science': [
        { code: 'CS110', name: 'Operating Systems', description: 'Study of operating system concepts and design' },
        { code: 'CS111', name: 'Computer Networks', description: 'Fundamentals of data communication and networking' },
        { code: 'CS112', name: 'Artificial Intelligence', description: 'Introduction to AI and intelligent agents' },
        { code: 'CS113', name: 'Software Engineering', description: 'Principles of software development life cycle' },
        { code: 'CS114', name: 'Cyber Security', description: 'Basics of information security and cryptography' },
        { code: 'CS115', name: 'Cloud Computing', description: 'Architecture and models of cloud services' },
        { code: 'CS116', name: 'Mobile App Development', description: 'Building applications for Android and iOS' }
    ],
    'Engineering': [
        { code: 'ENG101', name: 'Statics and Dynamics', description: 'Foundational mechanics for engineers' },
        { code: 'EE101', name: 'Circuit Theory', description: 'Analysis of DC and AC circuits' },
        { code: 'ME101', name: 'Thermodynamics', description: 'Energy conversion and heat transfer' },
        { code: 'CE101', name: 'Structural Analysis', description: 'Analysis of beams, trusses and frames' },
        { code: 'BME101', name: 'Biomedical Instrum', description: 'Medical device design and application' },
        { code: 'ENG102', name: 'Engineering Math', description: 'Advanced mathematics for engineering applications' },
        { code: 'ENG103', name: 'Material Science', description: 'Properties of engineering materials' }
    ],
    'Business Administration': [
        { code: 'BUS101', name: 'Principles of Management', description: 'Introduction to organizational management' },
        { code: 'MKT101', name: 'Marketing Management', description: 'Fundamentals of market research and strategy' },
        { code: 'ACC101', name: 'Financial Accounting', description: 'Basics of financial reporting and analysis' },
        { code: 'FIN101', name: 'Corporate Finance', description: 'Investment and financing decisions' },
        { code: 'BUS102', name: 'Business Ethics', description: 'Ethical decision making in business' },
        { code: 'BUS103', name: 'Organizational Behavior', description: 'Individual and group behavior in organizations' },
        { code: 'BUS104', name: 'International Business', description: 'Global trade and multinational operations' }
    ],
    'Medicine': [
        { code: 'MED101', name: 'Human Anatomy', description: 'Structure of the human body' },
        { code: 'MED102', name: 'Physiology', description: 'Function of biological systems' },
        { code: 'MED103', name: 'Pathology', description: 'Study of disease processes' },
        { code: 'MED104', name: 'Pharmacology', description: 'Drug action and effects' },
        { code: 'MED105', name: 'Clinical Skills', description: 'Patient examination and history taking' },
        { code: 'MED106', name: 'Internal Medicine', description: 'Prevention and treatment of adult diseases' },
        { code: 'MED107', name: 'Surgery Basics', description: 'Introduction to surgical procedures' }
    ],
    'Nursing': [
        { code: 'NUR101', name: 'Fundamentals of Nursing', description: 'Basic patient care and safety' },
        { code: 'NUR102', name: 'Pediatric Nursing', description: 'Care of infants and children' },
        { code: 'NUR103', name: 'Community Health', description: 'Public health and epidemiology' },
        { code: 'NUR104', name: 'Mental Health Nursing', description: 'Care of patients with mental illness' },
        { code: 'NUR105', name: 'Critical Care', description: 'Nursing in intensive care settings' },
        { code: 'NUR106', name: 'Maternal Nursing', description: 'Care during pregnancy and childbirth' },
        { code: 'NUR107', name: 'Nursing Management', description: 'Leadership in healthcare settings' }
    ],
    'Education': [
        { code: 'EDU101', name: 'Educational Psychology', description: 'Learning theories and development' },
        { code: 'EDU102', name: 'Curriculum Design', description: 'Planning and assessing instruction' },
        { code: 'EDU103', name: 'Special Education', description: 'Supporting students with special needs' },
        { code: 'EDU104', name: 'Classroom Management', description: 'Creating positive learning environments' },
        { code: 'EDU105', name: 'Instructional Tech', description: 'Using technology in the classroom' },
        { code: 'EDU106', name: 'Assessment Methods', description: 'Evaluating student learning' },
        { code: 'EDU107', name: 'History of Education', description: 'Evolution of educational systems' }
    ],
    'Arts & Sciences': [
        { code: 'BIO101', name: 'General Biology', description: 'Introduction to biological principles' },
        { code: 'CHEM101', name: 'General Chemistry', description: 'Introduction to chemical principles' },
        { code: 'PHY101', name: 'General Physics', description: 'Mechanics and thermodynamics' },
        { code: 'MATH101', name: 'Calculus I', description: 'Limits, derivatives and integrals' },
        { code: 'ENG101', name: 'English Lit', description: 'Analysis of literary works' },
        { code: 'HIST101', name: 'World History', description: 'Global historical events and trends' },
        { code: 'PSY101', name: 'Intro to Psychology', description: 'Study of mind and behavior' }
    ],
    'Public Health': [
        { code: 'PH101', name: 'Epidemiology', description: 'Distribution and determinants of health' },
        { code: 'PH102', name: 'Biostatistics', description: 'Statistical methods in health research' },
        { code: 'PH103', name: 'Health Policy', description: 'Healthcare systems and policy analysis' },
        { code: 'PH104', name: 'Environmental Health', description: 'Environmental factors affecting health' },
        { code: 'PH105', name: 'Global Health', description: 'Health issues transcending borders' },
        { code: 'PH106', name: 'Health Promotion', description: 'Strategies for improving public health' },
        { code: 'PH107', name: 'Occupational Health', description: 'Health and safety in the workplace' }
    ]
};

async function seedCourses() {
    try {
        console.log('🌱 Seeding courses (v2)...');

        // Check/Alter schema (same as before)
        try {
            const [columns] = await pool.query<RowDataPacket[]>('SHOW COLUMNS FROM courses LIKE "teacher_id"');
            if (columns.length > 0 && columns[0].Null === 'NO') {
                console.log('⚠️  teacher_id is NOT NULL. Modifying table...');
                await pool.query('ALTER TABLE courses MODIFY teacher_id INT NULL');
                console.log('✅ Adjusted schema: teacher_id is now NULLable');
            }
        } catch (e) {
            console.error('Could not check/alter schema:', e);
        }

        for (const [dept, courseList] of Object.entries(departments)) {
            console.log(`\nProcessing ${dept}...`);
            for (const course of courseList) {
                // Check if exists
                const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM courses WHERE code = ?', [course.code]);
                if (existing.length > 0) {
                    console.log(`  - Skipping ${course.code} (exists)`);
                    continue;
                }

                await pool.query(
                    'INSERT INTO courses (code, name, department, teacher_id, semester, year, description) VALUES (?, ?, ?, NULL, ?, ?, ?)',
                    [course.code, course.name, dept, 'Fall', 2024, course.description]
                );
                console.log(`  + Added ${course.code} - ${course.name}`);
            }
        }

        console.log('\n🎉 Course seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCourses();
