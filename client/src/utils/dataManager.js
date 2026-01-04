// Centralized data management for courses and enrollments

const STORAGE_KEYS = {
  COURSES: 'uab_all_courses',
  ENROLLMENTS: 'uab_enrollments',
  TEACHER_COURSES: 'uab_teacher_courses',
  ASSIGNMENTS: 'uab_assignments',
  SUBMISSIONS: 'uab_submissions',
  ATTENDANCE: 'uab_attendance',
  NOTIFICATIONS: 'uab_notifications',
  ASSESSMENTS: 'uab_assessments',
  ASSESSMENT_ATTEMPTS: 'uab_assessment_attempts',
  INTERNAL_MARKS: 'uab_internal_marks'
};

// Initialize with predefined courses if not exists
export const initializeData = (coursesData) => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(coursesData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify([]));
  }
};

// Get all courses (predefined + teacher added)
export const getAllCourses = () => {
  const coursesStr = localStorage.getItem(STORAGE_KEYS.COURSES);
  return coursesStr ? JSON.parse(coursesStr) : [];
};

// Add a new course (by teacher)
export const addCourse = (course, teacherId) => {
  const courses = getAllCourses();
  const newCourse = {
    ...course,
    id: `teacher_${teacherId}_${Date.now()}`,
    addedBy: teacherId,
    dateAdded: new Date().toISOString(),
    enrolled: 0,
    isTeacherAdded: true
  };
  courses.push(newCourse);
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  
  // Track teacher's courses
  const teacherCourses = getTeacherCourses(teacherId);
  teacherCourses.push(newCourse.id);
  localStorage.setItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`, JSON.stringify(teacherCourses));
  
  return newCourse;
};

// Remove a course (by teacher)
export const removeCourse = (courseId, teacherId) => {
  let courses = getAllCourses();
  courses = courses.filter(c => c.id !== courseId);
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  
  // Update teacher's courses
  let teacherCourses = getTeacherCourses(teacherId);
  teacherCourses = teacherCourses.filter(id => id !== courseId);
  localStorage.setItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`, JSON.stringify(teacherCourses));
  
  // Remove all enrollments for this course
  let enrollments = getAllEnrollments();
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
};

// Get courses added by a specific teacher
export const getTeacherCourses = (teacherId) => {
  const coursesStr = localStorage.getItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`);
  const courseIds = coursesStr ? JSON.parse(coursesStr) : [];
  const allCourses = getAllCourses();
  return allCourses.filter(c => courseIds.includes(c.id));
};

// Get all enrollments
export const getAllEnrollments = () => {
  const enrollmentsStr = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
  return enrollmentsStr ? JSON.parse(enrollmentsStr) : [];
};

// Enroll a student in a course
export const enrollStudent = (studentId, courseId, studentInfo) => {
  const enrollments = getAllEnrollments();
  
  // Check if already enrolled
  if (enrollments.some(e => e.studentId === studentId && e.courseId === courseId)) {
    return { success: false, message: 'Already enrolled' };
  }
  
  // Check capacity
  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found' };
  }
  
  const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
  if (courseEnrollments.length >= course.capacity) {
    return { success: false, message: 'Course is full' };
  }
  
  // Add enrollment
  const enrollment = {
    id: `enroll_${Date.now()}`,
    studentId,
    courseId,
    studentName: studentInfo.fullName,
    studentEmail: studentInfo.email,
    enrolledDate: new Date().toISOString(),
    progress: 0
  };
  
  enrollments.push(enrollment);
  localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  
  // Update course enrollment count
  updateCourseEnrollmentCount(courseId);
  
  return { success: true, enrollment };
};

// Unenroll a student from a course
export const unenrollStudent = (studentId, courseId) => {
  let enrollments = getAllEnrollments();
  enrollments = enrollments.filter(e => !(e.studentId === studentId && e.courseId === courseId));
  localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  
  // Update course enrollment count
  updateCourseEnrollmentCount(courseId);
};

// Get student's enrolled courses
export const getStudentEnrollments = (studentId) => {
  const enrollments = getAllEnrollments();
  const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
  const allCourses = getAllCourses();
  
  return studentEnrollments.map(enrollment => {
    const course = allCourses.find(c => c.id === enrollment.courseId);
    return course ? { ...course, ...enrollment } : null;
  }).filter(Boolean);
};

// Get students enrolled in a course
export const getCourseEnrollments = (courseId) => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(e => e.courseId === courseId);
};

// Update course enrollment count
export const updateCourseEnrollmentCount = (courseId) => {
  const courses = getAllCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  
  if (courseIndex !== -1) {
    const enrollments = getCourseEnrollments(courseId);
    courses[courseIndex].enrolled = enrollments.length;
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }
};

// Get course by ID
export const getCourseById = (courseId) => {
  const courses = getAllCourses();
  return courses.find(c => c.id === courseId);
};

// Get courses by stream/department
export const getCoursesByStream = (stream, department) => {
  const courses = getAllCourses();
  
  const streamMapping = {
    'Software Engineering': ['Computer Science', 'Software'],
    'Data Science': ['Computer Science', 'Data Science', 'Statistics'],
    'Cybersecurity': ['Computer Science', 'Cybersecurity'],
    'AI/ML': ['Computer Science', 'Artificial Intelligence'],
    'Civil Engineering': ['Engineering', 'Civil'],
    'Mechanical Engineering': ['Engineering', 'Mechanical'],
    'Electrical Engineering': ['Engineering', 'Electrical'],
    'Biomedical Engineering': ['Engineering', 'Biomedical'],
    'Finance': ['Business', 'Finance'],
    'Marketing': ['Business', 'Marketing'],
    'Management': ['Business', 'Management'],
    'Accounting': ['Business', 'Accounting']
  };
  
  const relevantDepartments = streamMapping[stream] || [department];
  
  return courses.filter(course => {
    return relevantDepartments.some(dept => 
      course.department.toLowerCase().includes(dept.toLowerCase()) ||
      course.courseName.toLowerCase().includes(stream.toLowerCase())
    );
  });
};

// Get teacher's statistics
export const getTeacherStats = (teacherId) => {
  const teacherCourseIds = getTeacherCourses(teacherId).map(c => c.id);
  const enrollments = getAllEnrollments();
  
  const totalStudents = enrollments.filter(e => 
    teacherCourseIds.includes(e.courseId)
  ).length;
  
  const uniqueStudents = new Set(
    enrollments
      .filter(e => teacherCourseIds.includes(e.courseId))
      .map(e => e.studentId)
  ).size;
  
  return {
    totalCourses: teacherCourseIds.length,
    totalEnrollments: totalStudents,
    uniqueStudents
  };
};

// Add a teacher course (from predefined catalog)
export const addTeacherCourse = (teacherId, courseId, teacherInfo) => {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === courseId);
  
  if (!course) {
    return { success: false, message: 'Course not found' };
  }
  
  // Check if teacher already added this course
  const teacherCourses = getTeacherCourses(teacherId);
  if (teacherCourses.some(c => c.id === courseId)) {
    return { success: false, message: 'Course already added' };
  }
  
  // Add to teacher's courses
  const teacherCourseIdsStr = localStorage.getItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`);
  const teacherCourseIds = teacherCourseIdsStr ? JSON.parse(teacherCourseIdsStr) : [];
  teacherCourseIds.push(courseId);
  localStorage.setItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`, JSON.stringify(teacherCourseIds));
  
  // Add metadata to course
  const courseIndex = allCourses.findIndex(c => c.id === courseId);
  if (courseIndex !== -1) {
    allCourses[courseIndex] = {
      ...allCourses[courseIndex],
      addedBy: teacherId,
      teacherName: teacherInfo.teacherName,
      teacherEmail: teacherInfo.teacherEmail,
      addedDate: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(allCourses));
  }
  
  return { success: true, course: allCourses[courseIndex] };
};

// Remove a teacher's course
export const removeTeacherCourse = (teacherId, courseId) => {
  const teacherCourseIdsStr = localStorage.getItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`);
  let teacherCourseIds = teacherCourseIdsStr ? JSON.parse(teacherCourseIdsStr) : [];
  teacherCourseIds = teacherCourseIds.filter(id => id !== courseId);
  localStorage.setItem(`${STORAGE_KEYS.TEACHER_COURSES}_${teacherId}`, JSON.stringify(teacherCourseIds));
  
  // Remove all enrollments for this course (if teacher removes it)
  let enrollments = getAllEnrollments();
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  
  return { success: true };
};

// Get course enrollment count
export const getCourseEnrollmentCount = (courseId) => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(e => e.courseId === courseId).length;
};

// Get list of enrolled students for a course
export const getEnrolledStudents = (courseId) => {
  const enrollments = getAllEnrollments();
  return enrollments
    .filter(e => e.courseId === courseId)
    .map(e => ({
      fullName: e.studentName,
      email: e.studentEmail,
      enrolledDate: e.enrolledDate,
      studentId: e.studentId,
      progress: e.progress
    }));
};

// ==================== ASSIGNMENT MANAGEMENT ====================

// Create assignment
export const createAssignment = (teacherId, courseId, assignmentData) => {
  const assignments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
  const assignment = {
    id: `assign_${Date.now()}`,
    teacherId,
    courseId,
    title: assignmentData.title,
    description: assignmentData.description,
    dueDate: assignmentData.dueDate,
    maxMarks: assignmentData.maxMarks,
    attachments: assignmentData.attachments || [],
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  assignments.push(assignment);
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  
  // Create notification for enrolled students
  const enrolledStudents = getEnrolledStudents(courseId);
  enrolledStudents.forEach(student => {
    createNotification(student.studentId, {
      type: 'assignment',
      title: 'New Assignment',
      message: `New assignment "${assignment.title}" posted`,
      courseId,
      assignmentId: assignment.id
    });
  });
  
  return assignment;
};

// Get assignments for a course
export const getCourseAssignments = (courseId) => {
  const assignments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
  return assignments.filter(a => a.courseId === courseId);
};

// Get assignments for student
export const getStudentAssignments = (studentId) => {
  const enrollments = getStudentEnrollments(studentId);
  const courseIds = enrollments.map(e => e.id);
  const assignments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
  return assignments.filter(a => courseIds.includes(a.courseId));
};

// Submit assignment
export const submitAssignment = (studentId, assignmentId, submissionData) => {
  const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
  const submission = {
    id: `sub_${Date.now()}`,
    assignmentId,
    studentId,
    studentName: submissionData.studentName,
    content: submissionData.content,
    attachments: submissionData.attachments || [],
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    grade: null,
    feedback: null
  };
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  return submission;
};

// Get submissions for assignment
export const getAssignmentSubmissions = (assignmentId) => {
  const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
  return submissions.filter(s => s.assignmentId === assignmentId);
};

// Get student submission for assignment
export const getStudentSubmission = (studentId, assignmentId) => {
  const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
  return submissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId);
};

// Grade assignment
export const gradeAssignment = (submissionId, grade, feedback) => {
  const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
  const index = submissions.findIndex(s => s.id === submissionId);
  if (index !== -1) {
    submissions[index].grade = grade;
    submissions[index].feedback = feedback;
    submissions[index].gradedAt = new Date().toISOString();
    submissions[index].status = 'graded';
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    
    // Notify student
    createNotification(submissions[index].studentId, {
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your assignment has been graded: ${grade}`,
      submissionId
    });
  }
};

// ==================== ATTENDANCE MANAGEMENT ====================

// Mark attendance
export const markAttendance = (courseId, studentId, date, status) => {
  const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  const record = {
    id: `att_${Date.now()}`,
    courseId,
    studentId,
    date,
    status, // 'present', 'absent', 'late'
    markedAt: new Date().toISOString()
  };
  attendance.push(record);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  return record;
};

// Get attendance for course
export const getCourseAttendance = (courseId) => {
  const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  return attendance.filter(a => a.courseId === courseId);
};

// Get student attendance
export const getStudentAttendance = (studentId, courseId = null) => {
  const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  return attendance.filter(a => 
    a.studentId === studentId && (courseId === null || a.courseId === courseId)
  );
};

// Calculate attendance percentage
export const getAttendancePercentage = (studentId, courseId) => {
  const attendance = getStudentAttendance(studentId, courseId);
  if (attendance.length === 0) return 0;
  const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  return Math.round((present / attendance.length) * 100);
};

// Add internal marks
export const addInternalMarks = (courseId, studentId, marksData) => {
  const marks = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERNAL_MARKS) || '[]');
  const record = {
    id: `mark_${Date.now()}`,
    courseId,
    studentId,
    type: marksData.type, // 'quiz', 'test', 'practical', 'participation'
    marks: marksData.marks,
    maxMarks: marksData.maxMarks,
    comments: marksData.comments,
    date: new Date().toISOString()
  };
  marks.push(record);
  localStorage.setItem(STORAGE_KEYS.INTERNAL_MARKS, JSON.stringify(marks));
  
  // Notify student
  createNotification(studentId, {
    type: 'marks',
    title: 'Internal Marks Updated',
    message: `${marksData.type}: ${marksData.marks}/${marksData.maxMarks}`,
    courseId
  });
  
  return record;
};

// Get student internal marks
export const getStudentInternalMarks = (studentId, courseId = null) => {
  const marks = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERNAL_MARKS) || '[]');
  return marks.filter(m => 
    m.studentId === studentId && (courseId === null || m.courseId === courseId)
  );
};

// ==================== NOTIFICATION SYSTEM ====================

// Create notification
export const createNotification = (recipientId, notificationData) => {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  const notification = {
    id: `notif_${Date.now()}`,
    recipientId,
    type: notificationData.type, // 'assignment', 'grade', 'attendance', 'announcement', 'exam'
    title: notificationData.title,
    message: notificationData.message,
    data: notificationData,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.push(notification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  return notification;
};

// Get user notifications
export const getUserNotifications = (userId) => {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  return notifications
    .filter(n => n.recipientId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Mark notification as read
export const markNotificationRead = (notificationId) => {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

// Get unread count
export const getUnreadCount = (userId) => {
  const notifications = getUserNotifications(userId);
  return notifications.filter(n => !n.read).length;
};

// ==================== ASSESSMENT & EXAM MODULE ====================

// Create assessment
export const createAssessment = (teacherId, courseId, assessmentData) => {
  const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
  const assessment = {
    id: `assess_${Date.now()}`,
    teacherId,
    courseId,
    title: assessmentData.title,
    description: assessmentData.description,
    type: assessmentData.type, // 'quiz', 'test', 'exam', 'midterm', 'final'
    duration: assessmentData.duration, // in minutes
    totalMarks: assessmentData.totalMarks,
    questions: assessmentData.questions, // array of question objects
    startTime: assessmentData.startTime,
    endTime: assessmentData.endTime,
    instructions: assessmentData.instructions,
    createdAt: new Date().toISOString(),
    status: 'scheduled' // 'scheduled', 'active', 'completed'
  };
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  
  // Notify enrolled students
  const enrolledStudents = getEnrolledStudents(courseId);
  enrolledStudents.forEach(student => {
    createNotification(student.studentId, {
      type: 'exam',
      title: `${assessment.type.toUpperCase()} Scheduled`,
      message: `${assessment.title} on ${new Date(assessment.startTime).toLocaleDateString()}`,
      courseId,
      assessmentId: assessment.id
    });
  });
  
  return assessment;
};

// Get course assessments
export const getCourseAssessments = (courseId) => {
  const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
  return assessments.filter(a => a.courseId === courseId);
};

// Get student assessments
export const getStudentAssessments = (studentId) => {
  const enrollments = getStudentEnrollments(studentId);
  const courseIds = enrollments.map(e => e.id);
  const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
  return assessments.filter(a => courseIds.includes(a.courseId));
};

// Start assessment attempt
export const startAssessmentAttempt = (studentId, assessmentId, studentName) => {
  const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');
  const attempt = {
    id: `attempt_${Date.now()}`,
    assessmentId,
    studentId,
    studentName,
    startedAt: new Date().toISOString(),
    answers: [],
    status: 'in_progress',
    score: null
  };
  attempts.push(attempt);
  localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(attempts));
  return attempt;
};

// Submit assessment
export const submitAssessment = (attemptId, answers) => {
  const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');
  const index = attempts.findIndex(a => a.id === attemptId);
  if (index !== -1) {
    attempts[index].answers = answers;
    attempts[index].submittedAt = new Date().toISOString();
    attempts[index].status = 'submitted';
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(attempts));
    return attempts[index];
  }
};

// Grade assessment attempt
export const gradeAssessmentAttempt = (attemptId, score, feedback) => {
  const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');
  const index = attempts.findIndex(a => a.id === attemptId);
  if (index !== -1) {
    attempts[index].score = score;
    attempts[index].feedback = feedback;
    attempts[index].gradedAt = new Date().toISOString();
    attempts[index].status = 'graded';
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(attempts));
    
    // Notify student
    createNotification(attempts[index].studentId, {
      type: 'exam',
      title: 'Assessment Graded',
      message: `Your assessment has been evaluated. Score: ${score}`,
      attemptId
    });
  }
};

// Get student attempt
export const getStudentAttempt = (studentId, assessmentId) => {
  const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');
  return attempts.find(a => a.studentId === studentId && a.assessmentId === assessmentId);
};

// Get assessment attempts
export const getAssessmentAttempts = (assessmentId) => {
  const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');
  return attempts.filter(a => a.assessmentId === assessmentId);
};
