import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, announcementsRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/announcements')
      ]);
      
      setCourses(coursesRes.data);
      setAnnouncements(announcementsRes.data);
      
      // Filter enrolled courses (mock - in real app, this would come from user data)
      setEnrolledCourses(coursesRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/enroll`);
      alert('Successfully enrolled in the course!');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
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
                  <h3>{courses.length}</h3>
                  <p>Available Courses</p>
                </div>
                <div className="stat-card card">
                  <h3>3.8</h3>
                  <p>GPA</p>
                </div>
                <div className="stat-card card">
                  <h3>32</h3>
                  <p>Credits Earned</p>
                </div>
              </div>

              <div className="section">
                <h2>Recent Announcements</h2>
                <div className="announcements-list">
                  {announcements.slice(0, 5).map(announcement => (
                    <div key={announcement._id} className="announcement-item card">
                      <div className={`badge ${announcement.type}`}>{announcement.type}</div>
                      <h4>{announcement.title}</h4>
                      <p>{announcement.content}</p>
                      <small>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-tab">
              <h2>My Enrolled Courses</h2>
              <div className="courses-grid">
                {enrolledCourses.map(course => (
                  <div key={course._id} className="course-card card">
                    <div className="course-header">
                      <h3>{course.courseCode}</h3>
                      <span className="credits">{course.credits} Credits</span>
                    </div>
                    <h4>{course.courseName}</h4>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span>📚 {course.department}</span>
                      <span>👨‍🏫 {course.instructor}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '65%' }}></div>
                    </div>
                    <small>65% Complete</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="browse-tab">
              <h2>Available Courses</h2>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course._id} className="course-card card">
                    <div className="course-header">
                      <h3>{course.courseCode}</h3>
                      <span className="credits">{course.credits} Credits</span>
                    </div>
                    <h4>{course.courseName}</h4>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span>📚 {course.department}</span>
                      <span>👨‍🏫 {course.instructor}</span>
                      <span>📅 {course.semester}</span>
                    </div>
                    <div className="enrollment-info">
                      <span>{course.enrolled}/{course.capacity} enrolled</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEnrollCourse(course._id)}
                      disabled={course.enrolled >= course.capacity}
                    >
                      {course.enrolled >= course.capacity ? 'Full' : 'Enroll Now'}
                    </button>
                  </div>
                ))}
              </div>
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
                    <label>Role:</label>
                    <span className="role-badge">{user?.role}</span>
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

export default Dashboard;
