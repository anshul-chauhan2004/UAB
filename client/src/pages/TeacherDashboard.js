import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalStudents, setTotalStudents] = useState(0);
  const [assignments, setAssignments] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: '100'
  });
  const [showViewAssignmentsModal, setShowViewAssignmentsModal] = useState(false);
  const [viewAssignments, setViewAssignments] = useState([]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);

      const coursesRes = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      console.log('Courses response:', coursesRes.data);
      setTeacherCourses(coursesRes.data.courses || []);

      let total = 0;
      const coursesList = coursesRes.data.courses || [];
      for (const course of coursesList) {
        try {
          const enrollRes = await axios.get(`${API_URL}/api/enrollments/course/${course.id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          total += enrollRes.data.enrollments?.length || 0;
        } catch (err) {
          console.error('Error fetching enrollments for course:', course.id, err);
        }
      }
      setTotalStudents(total);

      const allAssignments = [];
      for (const course of coursesList) {
        try {
          const assignRes = await axios.get(`${API_URL}/api/assignments?courseId=${course.id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          allAssignments.push(...(assignRes.data || []).map(a => ({ ...a, courseName: course.name })));
        } catch (err) {
          console.error('Error fetching assignments:', err);
        }
      }
      setAssignments(allAssignments);




    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateCourse = async () => {
    const code = prompt('Course Code (e.g., CS101):');
    if (!code) return;

    const name = prompt('Course Name:');
    if (!name) return;

    const description = prompt('Description:');
    const semester = prompt('Semester (e.g., Fall):', 'Fall');
    const year = prompt('Year:', '2024');

    try {
      await axios.post(`${API_URL}/api/courses`, {
        code,
        name,
        description,
        semester,
        year: parseInt(year),
        department: user.department
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert('Course created successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to create course: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBrowseCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses?browse=true`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAllCourses(res.data.courses || []);
      setShowBrowseModal(true);
    } catch (error) {
      alert('Failed to load courses: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddCourse = async (courseId) => {
    try {
      await axios.post(`${API_URL}/api/courses/${courseId}/assign`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert('Course added successfully!');
      setShowBrowseModal(false);
      fetchDashboardData(); // Refresh to show the new course
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      alert('Failed to add course: ' + errorMsg);
    }
  };


  const handleViewAssignments = async (course) => {
    try {
      const res = await axios.get(`${API_URL}/api/assignments?courseId=${course.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setViewAssignments(res.data || []);
      setSelectedCourse(course);
      setShowViewAssignmentsModal(true);
    } catch (error) {
      alert('Failed to load assignments: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`${API_URL}/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setViewAssignments(viewAssignments.filter(a => a.id !== assignmentId));
      alert('Assignment deleted successfully');
    } catch (error) {
      alert('Failed to delete assignment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCreateAssignment = async (courseId) => {
    const title = prompt('Assignment Title:');
    if (!title) return;

    const description = prompt('Description:');
    const dueDate = prompt('Due Date (YYYY-MM-DD):', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const maxMarks = prompt('Max Marks:', '100');

    try {
      await axios.post(`${API_URL}/api/assignments`, {
        courseId: courseId,
        title,
        description,
        dueDate: dueDate,
        maxMarks: parseInt(maxMarks)
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert('Assignment created successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to create assignment: ' + (error.response?.data?.error || error.message));
    }
  };



  const handleViewStudents = async (course) => {
    try {
      const res = await axios.get(`${API_URL}/api/enrollments/course/${course.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEnrolledStudents(res.data.enrollments || []);
      setSelectedCourse(course);
      setShowStudentModal(true);
    } catch (error) {
      alert('Failed to load students: ' + (error.response?.data?.error || error.message));
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
      alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
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
          <button className={`tab ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Assignments</button>

          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card card"><h3>{teacherCourses.length}</h3><p>My Courses</p></div>
                <div className="stat-card card"><h3>{teacherCourses.length}</h3><p>Available Courses</p></div>
                <div className="stat-card card"><h3>{totalStudents}</h3><p>Total Students</p></div>
                <div className="stat-card card department-card"><h3>{user.department ? user.department.replace(/ /g, '\n') : 'N/A'}</h3><p>Department</p></div>
              </div>
              <div className="section">
                <h2>Welcome, {user.name}!</h2>
                <p className="teacher-info">Teacher ID: {user.id} | Department: {user.department}</p>
                <div className="info-box card">
                  <h3>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button className="btn btn-primary" onClick={handleBrowseCourses} style={{ width: '100%' }}>Browse & Add Courses</button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('assignments')} style={{ width: '100%' }}>Add / Edit Assignments</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-courses' && (
            <div className="courses-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>My Courses</h2>
                <button className="btn btn-primary" onClick={handleBrowseCourses}>Browse & Add Courses</button>
              </div>
              {teacherCourses.length === 0 ? (
                <div className="empty-state card"><p>You haven't been assigned any courses yet.</p></div>
              ) : (
                <div className="courses-grid">
                  {teacherCourses.map(course => (
                    <div key={course.id} className="course-card card">
                      <div className="course-header"><h3>{course.code}</h3><span className="credits">{course.semester} {course.year}</span></div>
                      <h4>{course.name}</h4>
                      <p>{course.description}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '15px', flexWrap: 'wrap' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => handleViewStudents(course)} style={{ flex: '1 1 auto', minWidth: '100px' }}>View Students</button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="assignments-tab">
              <h2>My Courses - Assignments</h2>
              <p style={{ marginBottom: '20px', color: '#666' }}>Select a course to add or view assignments.</p>
              {teacherCourses.length === 0 ? (
                <div className="empty-state card"><p>No courses assigned to you.</p></div>
              ) : (
                <div className="courses-grid">
                  {teacherCourses.map(course => (
                    <div key={course.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div>
                        <h3>{course.code}</h3>
                        <h4 style={{ color: '#1a472a', margin: '5px 0' }}>{course.name}</h4>
                        <p style={{ fontSize: '14px', color: '#555' }}>{course.semester} {course.year}</p>
                      </div>
                      <div style={{ marginTop: 'auto' }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowAddAssignmentModal(true);
                          }}
                        >
                          + Add Assignment
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ width: '100%', marginTop: '10px' }}
                          onClick={() => handleViewAssignments(course)}
                        >
                          View Posted
                        </button>
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
                  <div className="info-row"><strong>Role:</strong><span>Teacher</span></div>
                  <div className="info-row"><strong>Department:</strong><span>{user.department}</span></div>
                  <div className="info-row"><strong>Teacher ID:</strong><span>{user.id}</span></div>
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

      {/* Student Modal */}
      {showStudentModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowStudentModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Students - {selectedCourse.name}</h3>
              <button onClick={() => setShowStudentModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            {enrolledStudents.length === 0 ? (
              <p>No students enrolled yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>

                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((enrollment, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{enrollment.name || 'Student'}</td>
                      <td style={{ padding: '12px' }}>{enrollment.email || 'N/A'}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Browse Courses Modal */}
      {showBrowseModal && (
        <div className="modal-overlay" onClick={() => setShowBrowseModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '900px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Browse Available Courses</h3>
              <button onClick={() => setShowBrowseModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            {allCourses.length === 0 ? (
              <p>No courses available</p>
            ) : (
              <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {allCourses.map(course => (
                  <div key={course.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4>{course.code}</h4>
                      <span style={{ fontSize: '12px', color: '#666' }}>{course.semester} {course.year}</span>
                    </div>
                    <h5>{course.name}</h5>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>{course.description}</p>
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
                      <div><strong>Department:</strong> {course.department}</div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '15px', width: '100%' }}
                      onClick={() => handleAddCourse(course.id)}
                      disabled={teacherCourses.some(c => c.id === course.id)}
                    >
                      {teacherCourses.some(c => c.id === course.id) ? 'Already Teaching' : 'Add to My Courses'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Add Assignment Modal */}
      {showAddAssignmentModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowAddAssignmentModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%' }}>
            <h3>Add Assignment - {selectedCourse.code}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post(`${API_URL}/api/assignments`, {
                  courseId: selectedCourse.id,
                  title: newAssignmentData.title,
                  description: newAssignmentData.description,
                  dueDate: newAssignmentData.dueDate,
                  maxMarks: parseInt(newAssignmentData.maxMarks)
                }, {
                  headers: { Authorization: `Bearer ${user.token}` }
                });
                alert('Assignment created successfully!');
                setShowAddAssignmentModal(false);
                setNewAssignmentData({ title: '', description: '', dueDate: '', maxMarks: '100' });
                // fetchDashboardData(); // No need to refetch everything if we aren't showing the list immediately
              } catch (error) {
                alert('Failed to create assignment: ' + (error.response?.data?.error || error.message));
              }
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={newAssignmentData.title}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, title: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
                  value={newAssignmentData.description}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, description: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Due Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={newAssignmentData.dueDate}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, dueDate: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Max Marks</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={newAssignmentData.maxMarks}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, maxMarks: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddAssignmentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Assignments Modal */}
      {showViewAssignmentsModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowViewAssignmentsModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Assignments - {selectedCourse.code}</h3>
              <button
                onClick={() => setShowViewAssignmentsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                &times;
              </button>
            </div>

            {viewAssignments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No assignments posted for this course.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {viewAssignments.map(assignment => (
                  <div key={assignment.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: '#2d3748' }}>{assignment.title}</h4>
                      <span style={{ fontSize: '12px', padding: '4px 8px', background: '#e2e8f0', borderRadius: '12px' }}>
                        Max Marks: {assignment.max_marks}
                      </span>
                    </div>
                    {assignment.description && <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4a5568' }}>{assignment.description}</p>}
                    <div style={{ fontSize: '12px', color: '#718096', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowViewAssignmentsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
