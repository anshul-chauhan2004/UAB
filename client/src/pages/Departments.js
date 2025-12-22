import React, { useState, useEffect } from 'react';
import './Departments.css';
import departmentsData from '../data/departments.json';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load static data
    setDepartments(departmentsData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="departments-page">
      <div className="departments-header">
        <div className="container">
          <h1>Our Departments</h1>
          <p>Explore the diverse academic departments at UAB</p>
        </div>
      </div>

      <div className="container">
        <div className="departments-grid">
          {departments.map(dept => (
            <div key={dept.id} className="department-card card">
              <img 
                src={dept.image || '/assets/images/image.png'} 
                alt={dept.name}
                className="dept-image"
                onError={(e) => {
                  e.target.src = '/assets/images/image.png';
                }}
              />
              <div className="dept-icon">{dept.code}</div>
              <h3>{dept.name}</h3>
              <p>{dept.description}</p>
              {dept.head && (
                <div className="dept-info">
                  <strong>Department Head:</strong> {dept.head}
                </div>
              )}
              {dept.building && (
                <div className="dept-info">
                  <strong>Building:</strong> {dept.building}
                </div>
              )}
              {dept.contactEmail && (
                <div className="dept-info">
                  <strong>Email:</strong> {dept.contactEmail}
                </div>
              )}
              {dept.programs && dept.programs.length > 0 && (
                <div className="programs">
                  <strong>Programs:</strong>
                  <ul>
                    {dept.programs.map((program, idx) => (
                      <li key={idx}>{program}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="no-departments">
            <p>No departments available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
