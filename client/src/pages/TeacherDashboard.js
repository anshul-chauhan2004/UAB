import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import coursesData from '../data/courses.json';
import * as DataManager from '../utils/dataManager';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      // Initialize data manager
      DataManager.initializeData(coursesData);
      
      // Get teacher's courses from data manager
      const teacherCoursesData = DataManager.getTeacherCourses(user.id);
      setTeacherCourses(teacherCoursesData);
      
      // Set available courses from predefined list (courses.json)
      setAvailableCourses(coursesData);
      
      // Get notifications
      const userNotifications = DataManager.getUserNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to local data
      setAvailableCourses(coursesData);
      const teacherCoursesData = DataManager.getTeacherCourses(user.id);
      setTeacherCourses(teacherCoursesData);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddCourse = async (course) => {
    try {
      const result = DataManager.addTeacherCourse(user.id, course.id, {
        teacherName: user.fullName,
        teacherEmail: user.email
      });
      
      if (!result.success) {
        alert(result.message);
        return;
      }

      alert('Course added successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to add course');
      console.error(error);
    }
  };

  const handleRemoveCourse = (courseId) => {
    DataManager.removeTeacherCourse(user.id, courseId);
    alert('Course removed successfully!');
    fetchDashboardData();
  };

  const getCourseEnrollmentCount = (courseId) => {
    return DataManager.getCourseEnrollmentCount(courseId);
  };

  const getDepartmentStudents = () => {
    // Sample students data based on teacher's department
    const allStudents = [
      {
        id: 'S001',
        name: 'Alex Thompson',
        studentId: 'UAB2024001',
        department: 'Computer Science',
        stream: 'Computer Science',
        email: 'alex.thompson@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 5
      },
      {
        id: 'S002',
        name: 'Maria Garcia',
        studentId: 'UAB2024002',
        department: 'Computer Science',
        stream: 'Computer Science',
        email: 'maria.garcia@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 4
      },
      {
        id: 'S003',
        name: 'David Lee',
        studentId: 'UAB2024003',
        department: 'Computer Science',
        stream: 'Computer Science',
        email: 'david.lee@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 6
      },
      {
        id: 'S004',
        name: 'Jennifer Wilson',
        studentId: 'UAB2024004',
        department: 'Electrical Engineering',
        stream: 'Electrical Engineering',
        email: 'jennifer.wilson@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 5
      },
      {
        id: 'S005',
        name: 'Ryan Miller',
        studentId: 'UAB2024005',
        department: 'Mechanical Engineering',
        stream: 'Mechanical Engineering',
        email: 'ryan.miller@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 4
      },
      {
        id: 'S006',
        name: 'Sarah Davis',
        studentId: 'UAB2024006',
        department: 'Civil Engineering',
        stream: 'Civil Engineering',
        email: 'sarah.davis@student.uab.edu',
        semester: 'Fall 2026',
        enrolledCourses: 5
      }
    ];
    
    // Filter students by teacher's department
    return allStudents.filter(student => student.department === user.department);
  };

  const viewEnrolledStudents = (course) => {
    setSelectedCourse(course);
    setShowStudentList(true);
  };

  const getEnrolledStudents = (courseId) => {
    return DataManager.getEnrolledStudents(courseId);
  };

  const filteredAvailableCourses = availableCourses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(availableCourses.map(c => c.department))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'my-courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-courses')}
          >
            My Courses
          </button>
          <button 
            className={`tab ${activeTab === 'add-courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-courses')}
          >
            Add Courses
          </button>
          <button 
            className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button 
            className={`tab ${activeTab === 'assessments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessments')}
          >
            Assessments
          </button>
          <button 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications {DataManager.getUnreadCount(user.id) > 0 && `(${DataManager.getUnreadCount(user.id)})`}
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card card">
                  <h3>{teacherCourses.length}</h3>
                  <p>My Courses</p>
                </div>
                <div className="stat-card card">
                  <h3>{availableCourses.length}</h3>
                  <p>Available Courses</p>
                </div>
                <div className="stat-card card">
                  <h3>{teacherCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0)}</h3>
                  <p>Total Students</p>
                </div>getCourseEnrollmentCount(c.id
                <div className="stat-card card">
                  <h3>{user.department}</h3>
                  <p>Department</p>
                </div>
              </div>

              <div className="section">
                <h2>Welcome, {user.fullName}!</h2>
                <p className="teacher-info">
                  Teacher ID: {user.teacherId} | Department: {user.department}
                </p>
                
                <div className="info-box card">
                  <h3>Quick Actions</h3>
                  <ul>
                    <li>Add new courses from the predefined course catalog</li>
                    <li>Manage your existing courses</li>
                    <li>View student enrollment statistics</li>
                  </ul>
                </div>
              </div>

              <div className="section">
                <h2>Department Students</h2>
                <div className="students-grid">
                  {getDepartmentStudents().map((student, index) => (
                    <div key={student.id || index} className="student-card card">
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <p className="student-id">ID: {student.studentId}</p>
                        <p className="student-department">{student.department}</p>
                        <p className="student-stream">Stream: {student.stream}</p>
                        <div className="student-contact">
                          <p>Email: {student.email}</p>
                        </div>
                        <div className="student-stats">
                          <small>Enrolled Courses: {student.enrolledCourses || 0}</small>
                          <small>Current Semester: {student.semester}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-courses' && (
            <div className="courses-tab">
              <h2>My Added Courses</h2>
              {teacherCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>You haven't added any courses yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('add-courses')}
                  >
                    Add Courses
                  </button>
                </div>
              ) : (
                <div className="courses-grid">
                  {teacherCourses.map(course => {
                    const enrollmentCount = getCourseEnrollmentCount(course.id);
                    return (
                      <div key={course.id} className="course-card card">
                        <div className="course-header">
                          <h3>{course.courseCode}</h3>
                          <span className="credits">{course.credits} Credits</span>
                        </div>
                        <h4>{course.courseName}</h4>
                        <p>{course.description}</p>
                        <div className="course-meta">
                          <span> {course.department}</span>
                          <span>‍ {course.instructor}</span>
                          <span>{course.semester}</span>
                        </div>
                        <div className="enrollment-info" style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          marginTop: '10px',
                          fontWeight: 'bold'
                        }}>
                          <span>{enrollmentCount}/{course.capacity} enrolled</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => viewEnrolledStudents(course)}
                            style={{ flex: 1 }}
                          >
                            View Students
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveCourse(course.id)}
                            style={{ flex: 1 }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {showStudentList && selectedCourse && (
                <div className="modal-overlay" onClick={() => setShowStudentList(false)} style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '800px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}>
                    <div className="modal-header" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '20px',
                      borderBottom: '2px solid #eee',
                      paddingBottom: '15px'
                    }}>
                      <h3>Enrolled Students - {selectedCourse.courseName}</h3>
                      <button 
                        className="close-modal-btn"
                        onClick={() => setShowStudentList(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '28px',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="students-list">
                      {getEnrolledStudents(selectedCourse.id).length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                          No students enrolled yet.
                        </p>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Enrolled Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getEnrolledStudents(selectedCourse.id).map((student, index) => (
                              <tr key={index} style={{ 
                                borderBottom: '1px solid #eee',
                                background: index % 2 === 0 ? '#f9f9f9' : 'white'
                              }}>
                                <td style={{ padding: '12px' }}>{student.fullName}</td>
                                <td style={{ padding: '12px' }}>{student.email}</td>
                                <td style={{ padding: '12px' }}>
                                  {new Date(student.enrolledDate).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add-courses' && (
            <div className="browse-tab">
              <h2>Add Courses from Catalog</h2>
              
              <div className="filters card">
                <div className="filter-group">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-group">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="courses-grid">
                {filteredAvailableCourses.map(course => (
                  <div key={course.id} className="course-card card">
                    <div className="course-header">
                      <h3>{course.courseCode}</h3>
                      <span className="credits">{course.credits} Credits</span>
                    </div>
                    <h4>{course.courseName}</h4>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span> {course.department}</span>
                      <span>‍ {course.instructor}</span>
                      <span>{course.semester}</span>
                    </div>
                    <div className="enrollment-info">
                      <span>Capacity: {course.capacity} students</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddCourse(course)}
                      disabled={teacherCourses.some(c => c.id === course.id)}
                    >
                      {teacherCourses.some(c => c.id === course.id) ? 'Already Added' : 'Add Course'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="assignments-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Assignments</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (teacherCourses.length === 0) {
                      alert('Please add a course first');
                      return;
                    }
                    const courseId = teacherCourses[0].id;
                    const title = prompt('Assignment Title:');
                    if (!title) return;
                    const description = prompt('Description:');
                    const dueDate = prompt('Due Date (YYYY-MM-DD):');
                    const maxMarks = parseInt(prompt('Max Marks:') || '100');
                    
                    DataManager.createAssignment(user.id, courseId, {
                      title, description, dueDate, maxMarks
                    });
                    alert('Assignment created successfully!');
                    fetchDashboardData();
                  }}
                >
                  + Create Assignment
                </button>
              </div>
              
              {teacherCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>Add a course first to create assignments</p>
                </div>
              ) : (
                teacherCourses.map(course => {
                  const assignments = DataManager.getCourseAssignments(course.id);
                  return (
                    <div key={course.id} className="course-assignments" style={{ marginBottom: '30px' }}>
                      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{course.courseName}</h3>
                      {assignments.length === 0 ? (
                        <p style={{ color: '#666', padding: '20px' }}>No assignments yet</p>
                      ) : (
                        <div className="courses-grid">
                          {assignments.map(assignment => {
                            const submissions = DataManager.getAssignmentSubmissions(assignment.id);
                            const graded = submissions.filter(s => s.status === 'graded').length;
                            return (
                              <div key={assignment.id} className="card" style={{ padding: '20px' }}>
                                <h4>{assignment.title}</h4>
                                <p>{assignment.description}</p>
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                                  <div>Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                                  <div>Max Marks: {assignment.maxMarks}</div>
                                  <div>Submissions: {submissions.length}</div>
                                  <div>Graded: {graded}/{submissions.length}</div>
                                </div>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  style={{ marginTop: '10px' }}
                                  onClick={() => {
                                    alert(`Submissions: ${submissions.length}\\nGraded: ${graded}\\n\\nClick individual submissions to grade them.`);
                                  }}
                                >
                                  View Submissions
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="assessments-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Assessments</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (teacherCourses.length === 0) {
                      alert('Please add a course first');
                      return;
                    }
                    const courseId = teacherCourses[0].id;
                    const title = prompt('Assessment Title:');
                    if (!title) return;
                    const type = prompt('Type (quiz/test/exam/midterm/final):', 'quiz');
                    const duration = parseInt(prompt('Duration (minutes):', '60'));
                    const totalMarks = parseInt(prompt('Total Marks:', '100'));
                    const startTime = prompt('Start Time (YYYY-MM-DD HH:MM):');
                    
                    DataManager.createAssessment(user.id, courseId, {
                      title,
                      type,
                      duration,
                      totalMarks,
                      startTime: new Date(startTime).toISOString(),
                      endTime: new Date(new Date(startTime).getTime() + duration * 60000).toISOString(),
                      questions: [],
                      instructions: 'Please read all questions carefully',
                      description: `${type.toUpperCase()} - ${title}`
                    });
                    alert('Assessment created successfully!');
                    fetchDashboardData();
                  }}
                >
                  + Create Assessment
                </button>
              </div>
              
              {teacherCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>Add a course first to create assessments</p>
                </div>
              ) : (
                teacherCourses.map(course => {
                  const assessments = DataManager.getCourseAssessments(course.id);
                  return (
                    <div key={course.id} className="course-assessments" style={{ marginBottom: '30px' }}>
                      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{course.courseName}</h3>
                      {assessments.length === 0 ? (
                        <p style={{ color: '#666', padding: '20px' }}>No assessments yet</p>
                      ) : (
                        <div className="courses-grid">
                          {assessments.map(assessment => {
                            const attempts = DataManager.getAssessmentAttempts(assessment.id);
                            const graded = attempts.filter(a => a.status === 'graded').length;
                            return (
                              <div key={assessment.id} className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <h4>{assessment.title}</h4>
                                <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.9 }}>
                                  <div> Type: {assessment.type.toUpperCase()}</div>
                                  <div>Duration: {assessment.duration} minutes</div>
                                  <div>Total Marks: {assessment.totalMarks}</div>
                                  <div>Start: {new Date(assessment.startTime).toLocaleString()}</div>
                                  <div>Attempts: {attempts.length}</div>
                                  <div>Graded: {graded}/{attempts.length}</div>
                                </div>
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  style={{ marginTop: '10px', background: 'white', color: '#667eea' }}
                                  onClick={() => {
                                    alert(`Assessment: ${assessment.title}\\nAttempts: ${attempts.length}\\nGraded: ${graded}\\n\\nView detailed results in assessment portal.`);
                                  }}
                                >
                                  View Results
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-tab">
              <h2>Manage Attendance</h2>
              {teacherCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>Add a course first to manage attendance</p>
                </div>
              ) : (
                teacherCourses.map(course => {
                  const enrolledStudents = DataManager.getEnrolledStudents(course.id);
                  return (
                    <div key={course.id} className="course-attendance" style={{ marginBottom: '30px' }}>
                      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{course.courseName}</h3>
                      {enrolledStudents.length === 0 ? (
                        <p style={{ color: '#666', padding: '20px' }}>No students enrolled</p>
                      ) : (
                        <div className="card" style={{ padding: '20px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Attendance %</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {enrolledStudents.map((student, index) => {
                                const percentage = DataManager.getAttendancePercentage(student.studentId, course.id);
                                return (
                                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{student.fullName}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                      <span style={{ 
                                        background: percentage >= 75 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold'
                                      }}>
                                        {percentage}%
                                      </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                      <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                          DataManager.markAttendance(course.id, student.studentId, new Date().toISOString().split('T')[0], 'present');
                                          alert('Attendance marked!');
                                          fetchDashboardData();
                                        }}
                                        style={{ marginRight: '5px' }}
                                      >
                                        Present
                                      </button>
                                      <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                          const marks = parseInt(prompt('Enter marks (0-100):') || '0');
                                          const maxMarks = parseInt(prompt('Out of:') || '100');
                                          const type = prompt('Type (quiz/test/practical/participation):', 'quiz');
                                          DataManager.addInternalMarks(course.id, student.studentId, {
                                            type, marks, maxMarks, comments: ''
                                          });
                                          alert('Marks added!');
                                          fetchDashboardData();
                                        }}
                                      >
                                        Add Marks
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-tab">
              <h2>Notifications</h2>
              {notifications.length === 0 ? (
                <div className="empty-state card">
                  <p>No notifications</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className="card" 
                      style={{ 
                        padding: '15px',
                        background: notif.read ? '#f9f9f9' : 'white',
                        borderLeft: notif.read ? '4px solid #ddd' : '4px solid #667eea'
                      }}
                      onClick={() => {
                        DataManager.markNotificationRead(notif.id);
                        fetchDashboardData();
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0' }}>{notif.title}</h4>
                          <p style={{ margin: '5px 0', color: '#666' }}>{notif.message}</p>
                          <small style={{ color: '#999' }}>
                            {new Date(notif.createdAt).toLocaleString()}
                          </small>
                        </div>
                        {!notif.read && (
                          <span style={{
                            background: '#667eea',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-card card">
                <h2>Profile Information</h2>
                <div className="profile-info">
                  <div className="info-row">
                    <label>Full Name:</label>
                    <span>{user?.fullName}</span>
                  </div>
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <label>Username:</label>
                    <span>{user?.username}</span>
                  </div>
                  <div className="info-row">
                    <label>Teacher ID:</label>
                    <span>{user?.teacherId}</span>
                  </div>
                  <div className="info-row">
                    <label>Department:</label>
                    <span>{user?.department}</span>
                  </div>
                  <div className="info-row">
                    <label>Role:</label>
                    <span className="role-badge">{user?.role}</span>
                  </div>
                  <div className="info-row">
                    <label>Courses Teaching:</label>
                    <span>{teacherCourses.length}</span>
                  </div>
                </div>
                <button className="btn btn-secondary">Edit Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
