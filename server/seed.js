require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Department = require('./models/Department');
const Announcement = require('./models/Announcement');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uab-institute';

// Sample data
const departments = [
  {
    name: 'School of Engineering',
    code: 'ENG',
    description: 'Leading engineering programs focused on innovation and practical application',
    head: 'Dr. James Martinez',
    faculty: [
      { name: 'Dr. James Martinez', position: 'Dean', email: 'jmartinez@uab.edu' },
      { name: 'Dr. Sarah Chen', position: 'Professor', email: 'schen@uab.edu' },
      { name: 'Dr. Michael Roberts', position: 'Associate Professor', email: 'mroberts@uab.edu' }
    ],
    programs: ['Biomedical Engineering', 'Civil Engineering', 'Electrical and Computer Engineering', 'Materials Science and Engineering'],
    contactEmail: 'engineering@uab.edu',
    contactPhone: '(205) 934-5680',
    building: 'Engineering Building',
    image: '/assets/images/box1.png'
  },
  {
    name: 'School of Medicine',
    code: 'MED',
    description: 'World-class medical education and research programs',
    head: 'Dr. Patricia Williams',
    faculty: [
      { name: 'Dr. Patricia Williams', position: 'Dean', email: 'pwilliams@uab.edu' },
      { name: 'Dr. Robert Johnson', position: 'Professor', email: 'rjohnson@uab.edu' },
      { name: 'Dr. Emily Zhang', position: 'Professor', email: 'ezhang@uab.edu' }
    ],
    programs: ['Anesthesiology and Perioperative Medicine', 'Biochemistry and Molecular Genetics', 'Cell, Developmental and Integrative Biology', 'Neurology'],
    contactEmail: 'medicine@uab.edu',
    contactPhone: '(205) 934-5681',
    building: 'Medical Center',
    image: '/assets/images/box2.png'
  },
  {
    name: 'College of Arts and Sciences',
    code: 'CAS',
    description: 'Diverse academic programs in humanities, social sciences, and natural sciences',
    head: 'Dr. David Anderson',
    faculty: [
      { name: 'Dr. David Anderson', position: 'Dean', email: 'danderson@uab.edu' },
      { name: 'Dr. Lisa Brown', position: 'Professor', email: 'lbrown@uab.edu' },
      { name: 'Dr. Thomas Lee', position: 'Associate Professor', email: 'tlee@uab.edu' }
    ],
    programs: ['Anthropology', 'Biology', 'Computer Science', 'History', 'Mathematics', 'Physics'],
    contactEmail: 'cas@uab.edu',
    contactPhone: '(205) 934-5682',
    building: 'Arts and Sciences Complex',
    image: '/assets/images/box3.png'
  },
  {
    name: 'School of Business',
    code: 'BUS',
    description: 'Comprehensive business education with focus on leadership and innovation',
    head: 'Dr. Robert Williams',
    faculty: [
      { name: 'Dr. Robert Williams', position: 'Dean', email: 'rwilliams@uab.edu' },
      { name: 'Dr. Jennifer Taylor', position: 'Professor', email: 'jtaylor@uab.edu' },
      { name: 'Dr. Mark Davis', position: 'Associate Professor', email: 'mdavis@uab.edu' }
    ],
    programs: ['Accounting and Finance', 'Management, Information Systems and Quantitative Methods', 'Marketing, Industrial Distribution and Economics'],
    contactEmail: 'business@uab.edu',
    contactPhone: '(205) 934-5683',
    building: 'Business School',
    image: '/assets/images/news1.png'
  },
  {
    name: 'School of Nursing',
    code: 'NUR',
    description: 'Excellence in nursing education and healthcare leadership',
    head: 'Dr. Karen Mitchell',
    faculty: [
      { name: 'Dr. Karen Mitchell', position: 'Dean', email: 'kmitchell@uab.edu' },
      { name: 'Dr. Susan Clark', position: 'Professor', email: 'sclark@uab.edu' },
      { name: 'Dr. Maria Garcia', position: 'Associate Professor', email: 'mgarcia@uab.edu' }
    ],
    programs: ['Adult Health Nursing', 'Community Health, Outcomes and Systems', 'Family, Community and Health Systems'],
    contactEmail: 'nursing@uab.edu',
    contactPhone: '(205) 934-5684',
    building: 'Nursing Building',
    image: '/assets/images/news2.png'
  },
  {
    name: 'School of Public Health',
    code: 'SPH',
    description: 'Leading public health programs addressing global health challenges',
    head: 'Dr. Jonathan Harris',
    faculty: [
      { name: 'Dr. Jonathan Harris', position: 'Dean', email: 'jharris@uab.edu' },
      { name: 'Dr. Rachel Green', position: 'Professor', email: 'rgreen@uab.edu' },
      { name: 'Dr. Ahmed Khan', position: 'Associate Professor', email: 'akhan@uab.edu' }
    ],
    programs: ['Biostatistics', 'Environmental Health Sciences', 'Epidemiology', 'Health Behavior'],
    contactEmail: 'publichealth@uab.edu',
    contactPhone: '(205) 934-5685',
    building: 'Public Health Building',
    image: '/assets/images/news3.png'
  }
];

const courses = [
  // School of Engineering
  {
    courseCode: 'BME301',
    courseName: 'Biomedical Engineering Fundamentals',
    department: 'School of Engineering',
    description: 'Introduction to biomedical engineering principles, medical devices, and biological systems.',
    credits: 3,
    instructor: 'Dr. Sarah Chen',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '10:00 AM - 11:00 AM' },
    capacity: 30,
    enrolled: 12,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'CE201',
    courseName: 'Civil Engineering Design',
    department: 'School of Engineering',
    description: 'Principles of structural design, materials science, and construction management.',
    credits: 4,
    instructor: 'Dr. Michael Roberts',
    schedule: { days: ['Tue', 'Thu'], time: '2:00 PM - 3:30 PM' },
    capacity: 25,
    enrolled: 18,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'ECE301',
    courseName: 'Electrical and Computer Engineering',
    department: 'School of Engineering',
    description: 'Introduction to circuits, digital systems, and computer architecture.',
    credits: 4,
    instructor: 'Dr. James Martinez',
    schedule: { days: ['Mon', 'Wed'], time: '1:00 PM - 2:30 PM' },
    capacity: 30,
    enrolled: 22,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'MSE401',
    courseName: 'Materials Science and Engineering',
    department: 'School of Engineering',
    description: 'Study of material properties, processing, and applications in engineering.',
    credits: 3,
    instructor: 'Dr. Sarah Chen',
    schedule: { days: ['Tue', 'Thu'], time: '9:00 AM - 10:30 AM' },
    capacity: 20,
    enrolled: 15,
    semester: 'Spring 2025',
    prerequisites: []
  },
  
  // School of Medicine
  {
    courseCode: 'MED501',
    courseName: 'Anesthesiology and Perioperative Medicine',
    department: 'School of Medicine',
    description: 'Advanced study of anesthesia techniques and perioperative patient care.',
    credits: 4,
    instructor: 'Dr. Robert Johnson',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '8:00 AM - 9:00 AM' },
    capacity: 25,
    enrolled: 20,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'BMG601',
    courseName: 'Biochemistry and Molecular Genetics',
    department: 'School of Medicine',
    description: 'Molecular mechanisms of genetic inheritance and biochemical processes.',
    credits: 4,
    instructor: 'Dr. Emily Zhang',
    schedule: { days: ['Tue', 'Thu'], time: '10:00 AM - 12:00 PM' },
    capacity: 20,
    enrolled: 16,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'CDIB501',
    courseName: 'Cell, Developmental and Integrative Biology',
    department: 'School of Medicine',
    description: 'Study of cellular processes, development, and integrative biological systems.',
    credits: 4,
    instructor: 'Dr. Patricia Williams',
    schedule: { days: ['Mon', 'Wed'], time: '1:00 PM - 3:00 PM' },
    capacity: 20,
    enrolled: 14,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'NEU601',
    courseName: 'Neurology',
    department: 'School of Medicine',
    description: 'Advanced topics in neurological disorders, diagnosis, and treatment.',
    credits: 4,
    instructor: 'Dr. Robert Johnson',
    schedule: { days: ['Thu'], time: '2:00 PM - 6:00 PM' },
    capacity: 15,
    enrolled: 12,
    semester: 'Spring 2025',
    prerequisites: []
  },
  
  // College of Arts and Sciences
  {
    courseCode: 'ANTH201',
    courseName: 'Introduction to Anthropology',
    department: 'College of Arts and Sciences',
    description: 'Study of human cultures, societies, and evolution.',
    credits: 3,
    instructor: 'Dr. Lisa Brown',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '11:00 AM - 12:00 PM' },
    capacity: 40,
    enrolled: 32,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'BIO301',
    courseName: 'General Biology',
    department: 'College of Arts and Sciences',
    description: 'Comprehensive introduction to biological systems and processes.',
    credits: 4,
    instructor: 'Dr. Thomas Lee',
    schedule: { days: ['Tue', 'Thu'], time: '10:00 AM - 12:00 PM' },
    capacity: 35,
    enrolled: 28,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'CS201',
    courseName: 'Computer Science Fundamentals',
    department: 'College of Arts and Sciences',
    description: 'Introduction to programming, algorithms, and data structures.',
    credits: 4,
    instructor: 'Dr. David Anderson',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '2:00 PM - 3:00 PM' },
    capacity: 30,
    enrolled: 25,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'HIST301',
    courseName: 'World History',
    department: 'College of Arts and Sciences',
    description: 'Survey of major historical events and their impact on modern society.',
    credits: 3,
    instructor: 'Dr. Lisa Brown',
    schedule: { days: ['Tue', 'Thu'], time: '1:00 PM - 2:30 PM' },
    capacity: 35,
    enrolled: 30,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'MATH301',
    courseName: 'Calculus III',
    department: 'College of Arts and Sciences',
    description: 'Multivariable calculus and differential equations.',
    credits: 4,
    instructor: 'Dr. Thomas Lee',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '9:00 AM - 10:00 AM' },
    capacity: 30,
    enrolled: 24,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'PHYS401',
    courseName: 'Quantum Physics',
    department: 'College of Arts and Sciences',
    description: 'Introduction to quantum mechanics and modern physics.',
    credits: 4,
    instructor: 'Dr. David Anderson',
    schedule: { days: ['Tue', 'Thu'], time: '3:00 PM - 5:00 PM' },
    capacity: 25,
    enrolled: 18,
    semester: 'Spring 2025',
    prerequisites: []
  },
  
  // School of Business
  {
    courseCode: 'ACCT301',
    courseName: 'Accounting and Finance',
    department: 'School of Business',
    description: 'Principles of financial accounting and corporate finance.',
    credits: 3,
    instructor: 'Dr. Jennifer Taylor',
    schedule: { days: ['Mon', 'Wed'], time: '9:00 AM - 10:30 AM' },
    capacity: 40,
    enrolled: 35,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'MGMT401',
    courseName: 'Management and Information Systems',
    department: 'School of Business',
    description: 'Business management principles and information technology integration.',
    credits: 3,
    instructor: 'Dr. Mark Davis',
    schedule: { days: ['Tue', 'Thu'], time: '11:00 AM - 12:30 PM' },
    capacity: 35,
    enrolled: 28,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'MKTG301',
    courseName: 'Marketing and Economics',
    department: 'School of Business',
    description: 'Marketing strategies, consumer behavior, and economic principles.',
    credits: 3,
    instructor: 'Dr. Robert Williams',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '1:00 PM - 2:00 PM' },
    capacity: 40,
    enrolled: 32,
    semester: 'Spring 2025',
    prerequisites: []
  },
  
  // School of Nursing
  {
    courseCode: 'NURS401',
    courseName: 'Adult Health Nursing',
    department: 'School of Nursing',
    description: 'Nursing care for adult patients with acute and chronic conditions.',
    credits: 4,
    instructor: 'Dr. Susan Clark',
    schedule: { days: ['Mon', 'Wed'], time: '8:00 AM - 10:00 AM' },
    capacity: 25,
    enrolled: 22,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'NURS501',
    courseName: 'Community Health and Outcomes',
    department: 'School of Nursing',
    description: 'Public health nursing and healthcare outcomes assessment.',
    credits: 3,
    instructor: 'Dr. Maria Garcia',
    schedule: { days: ['Tue', 'Thu'], time: '10:00 AM - 11:30 AM' },
    capacity: 30,
    enrolled: 26,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'NURS601',
    courseName: 'Family and Health Systems',
    department: 'School of Nursing',
    description: 'Family-centered care and healthcare system management.',
    credits: 3,
    instructor: 'Dr. Karen Mitchell',
    schedule: { days: ['Fri'], time: '9:00 AM - 12:00 PM' },
    capacity: 20,
    enrolled: 18,
    semester: 'Spring 2025',
    prerequisites: []
  },
  
  // School of Public Health
  {
    courseCode: 'BIOS501',
    courseName: 'Biostatistics',
    department: 'School of Public Health',
    description: 'Statistical methods for public health research and data analysis.',
    credits: 4,
    instructor: 'Dr. Rachel Green',
    schedule: { days: ['Mon', 'Wed'], time: '2:00 PM - 4:00 PM' },
    capacity: 25,
    enrolled: 20,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'EHS601',
    courseName: 'Environmental Health Sciences',
    department: 'School of Public Health',
    description: 'Study of environmental factors affecting human health.',
    credits: 3,
    instructor: 'Dr. Ahmed Khan',
    schedule: { days: ['Tue', 'Thu'], time: '1:00 PM - 2:30 PM' },
    capacity: 30,
    enrolled: 24,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'EPI501',
    courseName: 'Epidemiology',
    department: 'School of Public Health',
    description: 'Methods for studying disease distribution and determinants.',
    credits: 4,
    instructor: 'Dr. Jonathan Harris',
    schedule: { days: ['Mon', 'Wed', 'Fri'], time: '10:00 AM - 11:00 AM' },
    capacity: 25,
    enrolled: 22,
    semester: 'Spring 2025',
    prerequisites: []
  },
  {
    courseCode: 'HB601',
    courseName: 'Health Behavior',
    department: 'School of Public Health',
    description: 'Theories and methods for understanding and changing health behaviors.',
    credits: 3,
    instructor: 'Dr. Rachel Green',
    schedule: { days: ['Thu'], time: '3:00 PM - 6:00 PM' },
    capacity: 30,
    enrolled: 26,
    semester: 'Spring 2025',
    prerequisites: []
  }
];

const announcements = [
  {
    title: 'Spring 2025 Registration Now Open!',
    content: 'Registration for Spring 2025 semester is now open. Browse courses and enroll through your student dashboard.',
    type: 'academic',
    targetAudience: 'students',
    isActive: true,
    createdAt: new Date()
  },
  {
    title: 'Campus Career Fair - February 15th',
    content: 'Join us for the annual campus career fair on February 15th. Meet recruiters from top companies!',
    type: 'event',
    targetAudience: 'all',
    isActive: true,
    createdAt: new Date()
  },
  {
    title: 'Important: Final Exam Schedule Released',
    content: 'The final examination schedule for Fall 2024 has been posted. Please check your student portal.',
    type: 'urgent',
    targetAudience: 'students',
    isActive: true,
    createdAt: new Date()
  },
  {
    title: 'New Research Lab Opening',
    content: 'The university is proud to announce the opening of a new state-of-the-art research laboratory in the Computer Science department.',
    type: 'general',
    targetAudience: 'all',
    isActive: true,
    createdAt: new Date()
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Department.deleteMany({});
    await Announcement.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert departments
    console.log('📚 Creating departments...');
    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    // Insert courses
    console.log('📖 Creating courses...');
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create sample users
    console.log('👥 Creating sample users...');
    
    // Admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@uab.edu',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      studentId: 'UAB000001',
      department: 'Administration'
    });
    await adminUser.save();
    console.log('✅ Created admin user (username: admin, password: admin123)');

    // Student user
    const studentUser = new User({
      fullName: 'John Student',
      email: 'john.student@uab.edu',
      username: 'jstudent',
      password: 'student123',
      role: 'student',
      studentId: 'UAB000002',
      department: 'Computer Science',
      enrolledCourses: [createdCourses[0]._id, createdCourses[1]._id]
    });
    await studentUser.save();
    console.log('✅ Created student user (username: jstudent, password: student123)');

    // Teacher user
    const teacherUser = new User({
      fullName: 'Dr. Sarah Teacher',
      email: 'sarah.teacher@uab.edu',
      username: 'steacher',
      password: 'teacher123',
      role: 'teacher',
      studentId: 'UAB000003',
      department: 'Computer Science'
    });
    await teacherUser.save();
    console.log('✅ Created teacher user (username: steacher, password: teacher123)');

    // Insert announcements with admin as author
    console.log('📢 Creating announcements...');
    const announcementsWithAuthor = announcements.map(ann => ({
      ...ann,
      author: adminUser._id
    }));
    const createdAnnouncements = await Announcement.insertMany(announcementsWithAuthor);
    console.log(`✅ Created ${createdAnnouncements.length} announcements`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('   Admin:   username: admin     password: admin123');
    console.log('   Student: username: jstudent  password: student123');
    console.log('   Teacher: username: steacher  password: teacher123');
    console.log('\n🌐 Access the application at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit();
  }
}

// Run the seed function
seedDatabase();
