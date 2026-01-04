import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import coursesData from '../data/courses.json';
import announcementsData from '../data/announcements.json';
import * as DataManager from '../utils/dataManager';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [streamCourses, setStreamCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Initialize data manager with predefined courses
    DataManager.initializeData(coursesData);
  }, []);

  const filterCoursesByStream = React.useCallback(() => {
    const allCourses = DataManager.getAllCourses();
    
    if (!user.stream) {
      setStreamCourses(allCourses);
      return;
    }

    const filtered = DataManager.getCoursesByStream(user.stream, user.department);
    setStreamCourses(filtered);
  }, [user.stream, user.department]);

  const getDepartmentTeachers = () => {
    // Sample teachers data based on user's department
    const allTeachers = [
      {
        id: 'T001',
        name: 'Dr. Sarah Johnson',
        designation: 'Professor',
        department: 'Computer Science',
        email: 'sarah.johnson@uab.edu',
        phone: '+1-205-934-8227',
        courses: ['Data Structures', 'Algorithms', 'Machine Learning']
      },
      {
        id: 'T002',
        name: 'Dr. Michael Chen',
        designation: 'Associate Professor',
        department: 'Computer Science',
        email: 'michael.chen@uab.edu',
        phone: '+1-205-934-8228',
        courses: ['Database Systems', 'Web Development', 'Software Engineering']
      },
      {
        id: 'T003',
        name: 'Dr. Emily Rodriguez',
        designation: 'Assistant Professor',
        department: 'Computer Science',
        email: 'emily.rodriguez@uab.edu',
        phone: '+1-205-934-8229',
        courses: ['Computer Networks', 'Cybersecurity', 'Operating Systems']
      },
      {
        id: 'T004',
        name: 'Dr. Robert Williams',
        designation: 'Professor',
        department: 'Electrical Engineering',
        email: 'robert.williams@uab.edu',
        phone: '+1-205-934-8230',
        courses: ['Circuit Analysis', 'Digital Signal Processing', 'Power Systems']
      },
      {
        id: 'T005',
        name: 'Dr. Lisa Anderson',
        designation: 'Associate Professor',
        department: 'Mechanical Engineering',
        email: 'lisa.anderson@uab.edu',
        phone: '+1-205-934-8231',
        courses: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer']
      },
      {
        id: 'T006',
        name: 'Dr. James Brown',
        designation: 'Assistant Professor',
        department: 'Civil Engineering',
        email: 'james.brown@uab.edu',
        phone: '+1-205-934-8232',
        courses: ['Structural Analysis', 'Construction Management', 'Transportation']
      }
    ];
    
    // Filter teachers by user's department
    return allTeachers.filter(teacher => teacher.department === user.department);
  };

  const fetchDashboardData = React.useCallback(async () => {
    try {
      // Try to fetch announcements from backend
      try {
        const announcementsRes = await axios.get('/api/announcements');
        setAnnouncements(announcementsRes.data);
      } catch (error) {
        setAnnouncements(announcementsData);
      }
      
      // Get courses from centralized data manager
      filterCoursesByStream();
      
      // Get enrolled courses from data manager
      const enrolledCoursesData = DataManager.getStudentEnrollments(user.id);
      setEnrolledCourses(enrolledCoursesData);
      
      // Get notifications
      const userNotifications = DataManager.getUserNotifications(user.id);
      setNotifications(userNotifications);
      
      // Get assignments
      const studentAssignments = DataManager.getStudentAssignments(user.id);
      setAssignments(studentAssignments);
      
      // Get assessments
      const studentAssessments = DataManager.getStudentAssessments(user.id);
      setAssessments(studentAssessments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAnnouncements(announcementsData);
      filterCoursesByStream();
      const enrolledCoursesData = DataManager.getStudentEnrollments(user.id);
      setEnrolledCourses(enrolledCoursesData);
    } finally {
      setLoading(false);
    }
  }, [user.id, filterCoursesByStream]);

  const handleEnrollCourse = async (course) => {
    const result = DataManager.enrollStudent(user.id, course.id, {
      fullName: user.fullName,
      email: user.email
    });
    
    if (!result.success) {
      alert(result.message);
      return;
    }
    
    alert('Successfully enrolled in the course!');
    fetchDashboardData();
  };

  const handleUnenroll = (courseId) => {
    DataManager.unenrollStudent(user.id, courseId);
    alert('Successfully unenrolled from the course!');
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
            className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button 
            className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Courses
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
            Alerts {DataManager.getUnreadCount(user.id) > 0 && `(${DataManager.getUnreadCount(user.id)})`}
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
                  <h3>{enrolledCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
                <div className="stat-card card">
                  <h3>{streamCourses.length}</h3>
                  <p>Available Courses</p>
                </div>
                <div className="stat-card card">
                  <h3>-</h3>
                  <p>GPA</p>
                </div>
                <div className="stat-card card">
                  <h3>{enrolledCourses.reduce((sum, c) => sum + c.credits, 0)}</h3>
                  <p>Credits Enrolled</p>
                </div>
              </div>

              <div className="section">
                <div className="info-box card">
                  <h3> Your Stream: {user.stream || user.department}</h3>
                  <p>Showing {streamCourses.length} courses relevant to your stream</p>
                  <p className="student-info">
                    Student ID: {user.studentId} | Department: {user.department}
                  </p>
                </div>
              </div>

              <div className="section">
                <h2>Department Teachers</h2>
                <div className="teachers-grid">
                  {getDepartmentTeachers().map((teacher, index) => (
                    <div key={teacher.id || index} className="teacher-card card">
                      <div className="teacher-info">
                        <h4>{teacher.name}</h4>
                        <p className="teacher-designation">{teacher.designation}</p>
                        <p className="teacher-department">{teacher.department}</p>
                        <div className="teacher-contact">
                          <p>Email: {teacher.email}</p>
                          <p>Phone: {teacher.phone}</p>
                        </div>
                        <div className="teacher-courses">
                          <small>Courses: {teacher.courses?.join(', ') || 'Not specified'}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2>Latest Announcements</h2>
                <div className="announcements-grid">
                  {announcements.slice(0, 3).map((announcement, index) => (
                    <div key={announcement.id || announcement._id || index} className="announcement-card card">
                      <div className={`announcement-badge ${announcement.type}`}>
                        {announcement.type}
                      </div>
                      <h3>{announcement.title}</h3>
                      <p>{announcement.content}</p>
                      <small>
                        {announcement.date 
                          ? new Date(announcement.date).toLocaleDateString()
                          : announcement.createdAt 
                          ? new Date(announcement.createdAt).toLocaleDateString()
                          : 'Recent'}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-tab">
              <h2>My Enrolled Courses</h2>
              {enrolledCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>You haven't enrolled in any courses yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="courses-grid">
                  {enrolledCourses.map(course => (
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
                      </div>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: `${course.progress || 65}%` }}></div>
                      </div>
                      <small>{course.progress || 65}% Complete</small>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleUnenroll(course.id)}
                        style={{ marginTop: '10px' }}
                      >
                        Unenroll
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="browse-tab">
              <h2>Courses for {user.stream || user.department}</h2>
              <p className="stream-info">Showing courses relevant to your stream</p>
              
              {streamCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>No courses available for your stream at the moment.</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {streamCourses.map(course => (
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
                        <span>{course.enrolled || 0}/{course.capacity} enrolled</span>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEnrollCourse(course)}
                        disabled={
                          enrolledCourses.some(c => c.id === course.id) ||
                          (course.enrolled >= course.capacity)
                        }
                      >
                        {enrolledCourses.some(c => c.id === course.id) 
                          ? 'Enrolled' 
                          : (course.enrolled >= course.capacity ? 'Full' : 'Enroll Now')
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="assignments-tab">
              <h2>My Assignments</h2>
              {assignments.length === 0 ? (
                <div className="empty-state card">
                  <p>No assignments yet</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {assignments.map(assignment => {
                    const submission = DataManager.getStudentSubmission(user.id, assignment.id);
                    const course = enrolledCourses.find(c => c.id === assignment.courseId);
                    return (
                      <div key={assignment.id} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h4>{assignment.title}</h4>
                            <p style={{ color: '#666', fontSize: '14px' }}>{course?.courseName}</p>
                          </div>
                          {submission && (
                            <span style={{
                              background: submission.status === 'graded' ? '#4caf50' : '#ff9800',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {submission.status === 'graded' ? `Graded: ${submission.grade}/${assignment.maxMarks}` : 'Submitted'}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '10px 0' }}>{assignment.description}</p>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          <div>Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                          <div>Max Marks: {assignment.maxMarks}</div>
                          {submission?.feedback && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
                              <strong>Feedback:</strong> {submission.feedback}
                            </div>
                          )}
                        </div>
                        {!submission ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '10px' }}
                            onClick={() => {
                              const content = prompt('Enter your submission:');
                              if (content) {
                                DataManager.submitAssignment(user.id, assignment.id, {
                                  studentName: user.fullName,
                                  content,
                                  attachments: []
                                });
                                alert('Assignment submitted successfully!');
                                fetchDashboardData();
                              }
                            }}
                          >
                            Submit Assignment
                          </button>
                        ) : (
                          <div style={{ marginTop: '10px', color: '#4caf50', fontWeight: 'bold' }}>
                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="assessments-tab">
              <h2>My Assessments</h2>
              {assessments.length === 0 ? (
                <div className="empty-state card">
                  <p>No assessments scheduled</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {assessments.map(assessment => {
                    const attempt = DataManager.getStudentAttempt(user.id, assessment.id);
                    const course = enrolledCourses.find(c => c.id === assessment.courseId);
                    const now = new Date();
                    const startTime = new Date(assessment.startTime);
                    const endTime = new Date(assessment.endTime);
                    const isActive = now >= startTime && now <= endTime;
                    const isPast = now > endTime;
                    return (
                      <div key={assessment.id} className="card" style={{ 
                        padding: '20px',
                        background: isActive ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : isPast ? '#f5f5f5' : 'white',
                        color: isActive ? 'white' : 'inherit'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h4>{assessment.title}</h4>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>{course?.courseName}</p>
                          </div>
                          {attempt && (
                            <span style={{
                              background: attempt.status === 'graded' ? '#4caf50' : '#ff9800',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {attempt.status === 'graded' ? `Score: ${attempt.score}/${assessment.totalMarks}` : 'Submitted'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '10px', opacity: isActive ? 0.95 : 1 }}>
                          <div> Type: {assessment.type.toUpperCase()}</div>
                          <div>Duration: {assessment.duration} minutes</div>
                          <div>Total Marks: {assessment.totalMarks}</div>
                          <div>Start: {startTime.toLocaleString()}</div>
                          <div>End: {endTime.toLocaleString()}</div>
                          {attempt?.feedback && (
                            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                              <strong>Feedback:</strong> {attempt.feedback}
                            </div>
                          )}
                        </div>
                        {isActive && !attempt ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '10px', background: 'white', color: '#43e97b', fontWeight: 'bold' }}
                            onClick={() => {
                              const confirm = window.confirm(`Start ${assessment.title}?\\nDuration: ${assessment.duration} minutes\\nThis action cannot be undone.`);
                              if (confirm) {
                                DataManager.startAssessmentAttempt(user.id, assessment.id, user.fullName);
                                alert('Assessment started! Complete within the time limit.');
                                fetchDashboardData();
                              }
                            }}
                          >
                            Start Assessment
                          </button>
                        ) : attempt?.status === 'in_progress' ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '10px' }}
                            onClick={() => {
                              const confirm = window.confirm('Submit assessment?');
                              if (confirm) {
                                DataManager.submitAssessment(attempt.id, []);
                                alert('Assessment submitted!');
                                fetchDashboardData();
                              }
                            }}
                          >
                            Submit Assessment
                          </button>
                        ) : isPast && !attempt ? (
                          <div style={{ marginTop: '10px', color: '#f44336', fontWeight: 'bold' }}>
                            Warning: Missed
                          </div>
                        ) : attempt ? (
                          <div style={{ marginTop: '10px', color: '#4caf50', fontWeight: 'bold' }}>
                            Completed
                          </div>
                        ) : (
                          <div style={{ marginTop: '10px', color: '#666' }}>
                            Scheduled
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-tab">
              <h2>My Attendance & Performance</h2>
              {enrolledCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>Enroll in courses to track attendance</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {enrolledCourses.map(course => {
                    const percentage = DataManager.getAttendancePercentage(user.id, course.id);
                    const attendance = DataManager.getStudentAttendance(user.id, course.id);
                    const marks = DataManager.getStudentInternalMarks(user.id, course.id);
                    const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
                    const maxTotalMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
                    return (
                      <div key={course.id} className="card" style={{ padding: '20px' }}>
                        <h4>{course.courseName}</h4>
                        <div style={{ marginTop: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Attendance:</span>
                            <span style={{ 
                              background: percentage >= 75 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontWeight: 'bold'
                            }}>
                              {percentage}%
                            </span>
                          </div>
                          <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                            {attendance.filter(a => a.status === 'present').length} present / {attendance.length} total classes
                          </div>
                        </div>
                        
                        {marks.length > 0 && (
                          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <h5>Internal Marks:</h5>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
                              {totalMarks} / {maxTotalMarks}
                            </div>
                            <div style={{ marginTop: '10px' }}>
                              {marks.map((mark, index) => (
                                <div key={index} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  padding: '8px',
                                  background: index % 2 === 0 ? '#f9f9f9' : 'white',
                                  borderRadius: '4px',
                                  marginBottom: '5px'
                                }}>
                                  <span style={{ textTransform: 'capitalize' }}>{mark.type}</span>
                                  <span style={{ fontWeight: 'bold' }}>{mark.marks}/{mark.maxMarks}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {percentage < 75 && (
                          <div style={{ 
                            marginTop: '15px', 
                            padding: '10px', 
                            background: '#fff3cd', 
                            borderLeft: '4px solid #ffc107',
                            borderRadius: '4px'
                          }}>
                            <strong>Warning: Warning:</strong> Attendance below 75% threshold
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                        borderLeft: notif.read ? '4px solid #ddd' : '4px solid #667eea',
                        cursor: 'pointer'
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
                    <label>Student ID:</label>
                    <span>{user?.studentId}</span>
                  </div>
                  <div className="info-row">
                    <label>Department:</label>
                    <span>{user?.department}</span>
                  </div>
                  <div className="info-row">
                    <label>Stream:</label>
                    <span>{user?.stream || 'Not specified'}</span>
                  </div>
                  <div className="info-row">
                    <label>Role:</label>
                    <span className="role-badge">{user?.role}</span>
                  </div>
                  <div className="info-row">
                    <label>Enrolled Courses:</label>
                    <span>{enrolledCourses.length}</span>
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

export default StudentDashboard;
