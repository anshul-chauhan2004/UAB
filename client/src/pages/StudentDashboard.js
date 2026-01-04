import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [selectedCourseForAssignments, setSelectedCourseForAssignments] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState(null);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all courses in student's department
      const coursesRes = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAvailableCourses(coursesRes.data.courses || []);

      // Fetch student's enrolled courses
      try {
        const enrolledRes = await axios.get(`${API_URL}/api/enrollments/my-courses`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEnrolledCourses(enrolledRes.data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setEnrolledCourses([]);
      }


    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.token, user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`${API_URL}/api/enrollments`, {
        courseId: courseId
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Successfully enrolled in course!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to enroll: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      await axios.delete(`${API_URL}/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Successfully unenrolled from course!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to unenroll: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, editFormData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Update local storage with new user data while preserving token
      const updatedUser = { ...user, ...res.data.user };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profile updated successfully!');
      setShowEditProfile(false);
      window.location.reload();
    } catch (error) {
      alert('Failed to update profile: ' + (error.response?.data?.details || error.response?.data?.error || error.message));
    }
  };

  const handleViewAssignments = async (courseId, courseName) => {
    try {
      const res = await axios.get(`${API_URL}/api/assignments?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCourseAssignments(res.data);
      setSelectedCourseForAssignments({ id: courseId, name: courseName });
      setShowAssignmentsModal(true);
    } catch (error) {
      alert('Failed to fetch assignments: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewAttendance = async (courseId, courseName) => {
    try {
      const res = await axios.get(`${API_URL}/api/attendance?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAttendanceData(res.data);
      setSelectedCourseForAttendance({ id: courseId, name: courseName });
      setShowAttendanceModal(true);
    } catch (error) {
      alert('Failed to fetch attendance: ' + (error.response?.data?.error || error.message));
    }
  };

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
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'my-courses' ? 'active' : ''}`} onClick={() => setActiveTab('my-courses')}>My Courses</button>
          <button className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Browse Courses</button>

          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card card"><h3>{enrolledCourses.length}</h3><p>Enrolled Courses</p></div>
                <div className="stat-card card"><h3>{availableCourses.length}</h3><p>Available Courses</p></div>
                <div className="stat-card card department-card"><h3>{user.department ? user.department.replace(/ /g, '\n') : 'N/A'}</h3><p>Department</p></div>
              </div>

              <div className="section">
                <h2>Welcome, {user.name}!</h2>
                <p className="student-info">Student ID: {user.id} | Department: {user.department}</p>

                <div className="info-box card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 10px 20px', textAlign: 'center' }}>
                    <h3 style={{ color: '#1a472a', margin: '0' }}>Quick Actions</h3>
                  </div>
                  <div className="action-list">
                    <div className="action-item" onClick={() => setActiveTab('browse')}>
                      Browse and enroll in courses from your department
                    </div>
                    <div className="action-item" onClick={() => setActiveTab('my-courses')}>
                      View your enrolled courses and progress
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-courses' && (
            <div className="courses-tab">
              <h2>My Enrolled Courses</h2>
              {enrolledCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>You haven't enrolled in any courses yet.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('browse')}>Browse Courses</button>
                </div>
              ) : (
                <div className="courses-grid">
                  {enrolledCourses.map(course => (
                    <div key={course.id} className="course-card card">
                      <div className="course-header">
                        <h3>{course.code}</h3>
                        <span className="credits">{course.semester} {course.year}</span>
                      </div>
                      <h4>{course.name}</h4>
                      <p>{course.description}</p>
                      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                        <div><strong>Department:</strong> {course.department}</div>
                        <div><strong>Teacher:</strong> {course.teacher_name || 'TBA'}</div>
                        <div><strong>Email:</strong> {course.teacher_email || 'N/A'}</div>
                        <div><strong>Enrolled:</strong> {new Date(course.enrolled_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '15px' }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => handleViewAssignments(course.id, course.name)}
                        >
                          View Assignments
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%', background: 'white', color: '#1a472a', border: '2px solid #1a472a' }}
                          onClick={() => handleViewAttendance(course.id, course.name)}
                          onMouseOver={(e) => e.target.style.background = '#f0f9f4'}
                          onMouseOut={(e) => e.target.style.background = 'white'}
                        >
                          View Attendance
                        </button>
                        <button
                          className="btn"
                          style={{ width: '100%', background: 'none', border: 'none', color: '#dc3545', marginTop: '5px' }}
                          onClick={() => handleUnenroll(course.enrollment_id)}
                          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="browse-tab">
              <h2>Available Courses - {user.department}</h2>
              <p className="stream-info">Showing courses from your department</p>

              {availableCourses.length === 0 ? (
                <div className="empty-state card">
                  <p>No courses available in your department at the moment.</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {availableCourses.map(course => {
                    const isEnrolled = enrolledCourses.some(e => e.course_id === course.id);
                    return (
                      <div key={course.id} className="course-card card">
                        <div className="course-header">
                          <h3>{course.code}</h3>
                          <span className="credits">{course.semester} {course.year}</span>
                        </div>
                        <h4>{course.name}</h4>
                        <p>{course.description}</p>
                        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                          <div><strong>Department:</strong> {course.department}</div>
                          <div><strong>Teacher:</strong> {course.teacher_name || 'TBA'}</div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: '15px', width: '100%' }}
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolled}
                        >
                          {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}



          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-card card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Profile Information</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditFormData({ name: user.name, email: user.email });
                      setShowEditProfile(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="profile-info">
                  <div className="info-row"><strong>Name:</strong><span>{user.name}</span></div>
                  <div className="info-row"><strong>Email:</strong><span>{user.email}</span></div>
                  <div className="info-row"><strong>Role:</strong><span>Student</span></div>
                  <div className="info-row"><strong>Department:</strong><span>{user.department}</span></div>
                  <div className="info-row"><strong>Student ID:</strong><span>{user.id}</span></div>
                  <div className="info-row"><strong>Enrolled Courses:</strong><span>{enrolledCourses.length}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%' }}>
            <h3>Edit Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditProfile(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Assignments Modal */}
      {showAssignmentsModal && selectedCourseForAssignments && (
        <div className="modal-overlay" onClick={() => setShowAssignmentsModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Assignments - {selectedCourseForAssignments.name}</h3>
              <button
                onClick={() => setShowAssignmentsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                &times;
              </button>
            </div>

            {courseAssignments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No assignments found for this course.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {courseAssignments.map(assignment => (
                  <div key={assignment.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: '#2d3748' }}>{assignment.title}</h4>
                      <span style={{ fontSize: '12px', padding: '4px 8px', background: '#e2e8f0', borderRadius: '12px' }}>
                        Max Marks: {assignment.max_marks}
                      </span>
                    </div>
                    {assignment.description && <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4a5568' }}>{assignment.description}</p>}
                    <div style={{ fontSize: '12px', color: '#718096', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      {/* Placeholder for submission status if needed */}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowAssignmentsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedCourseForAttendance && (
        <div className="modal-overlay" onClick={() => setShowAttendanceModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Attendance - {selectedCourseForAttendance.name}</h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                &times;
              </button>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', justifyContent: 'space-between', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#1a472a', fontWeight: 'bold' }}>{attendanceData.length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#28a745', fontWeight: 'bold' }}>{attendanceData.filter(a => a.status === 'present').length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Present</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#dc3545', fontWeight: 'bold' }}>{attendanceData.filter(a => a.status === 'absent').length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Absent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
                  {attendanceData.length > 0 ? Math.round((attendanceData.filter(a => a.status !== 'absent').length / attendanceData.length) * 100) : 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Percentage</div>
              </div>
            </div>

            {attendanceData.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No attendance records found.</p>
            ) : (
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f1f1f1' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#555', borderBottom: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: '#555', borderBottom: '1px solid #ddd' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record, index) => (
                      <tr key={index} style={{ borderBottom: index < attendanceData.length - 1 ? '1px solid #eee' : 'none' }}>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(record.date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: record.status === 'present' ? '#d4edda' : record.status === 'absent' ? '#f8d7da' : '#fff3cd',
                            color: record.status === 'present' ? '#155724' : record.status === 'absent' ? '#721c24' : '#856404',
                            textTransform: 'capitalize'
                          }}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowAttendanceModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
