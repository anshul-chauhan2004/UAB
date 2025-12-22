import React, { useState, useEffect } from 'react';
import './Courses.css';
import coursesData from '../data/courses.json';
import departmentsData from '../data/departments.json';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load static data
    setCourses(coursesData);
    setFilteredCourses(coursesData);
    setDepartments(departmentsData);
    setLoading(false);
  }, []);

  const filterCourses = () => {
    let filtered = courses;

    if (selectedDept !== 'all') {
      filtered = filtered.filter(course => course.department === selectedDept);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDept, searchTerm, courses]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div className="container">
          <h1>Course Catalog</h1>
          <p>Explore our comprehensive range of courses</p>
        </div>
      </div>

      <div className="container">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-dropdown">
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="courses-count">
          <p>Showing {filteredCourses.length} course(s)</p>
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course._id} className="course-card card">
              <div className="course-header">
                <h3>{course.courseCode}</h3>
                <span className="credits">{course.credits} Credits</span>
              </div>
              <h4>{course.courseName}</h4>
              <p>{course.description || 'No description available'}</p>
              <div className="course-details">
                <div className="detail-item">
                  <strong>Department:</strong> {course.department}
                </div>
                <div className="detail-item">
                  <strong>Instructor:</strong> {course.instructor || 'TBA'}
                </div>
                {course.schedule && (
                  <div className="detail-item">
                    <strong>Schedule:</strong> {course.schedule.days?.join(', ')} - {course.schedule.time}
                  </div>
                )}
                <div className="detail-item">
                  <strong>Capacity:</strong> {course.enrolled}/{course.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="no-results">
            <p>No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
