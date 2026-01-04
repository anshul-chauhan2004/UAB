import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import announcementsData from '../data/announcements.json';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load announcements from static JSON
    setAnnouncements(announcementsData.slice(0, 3));
  }, []);

  return (
    <div className="home-page">
      <section className="hero fade-in">
        <div className="hero-image">
          <img src="/assets/images/image.png" alt="UAB Campus" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to UAB</h1>
          <p className="hero-text">
            We're committed to supporting people across our community, city,
            state and world in education, research and patient care. Our world-class
            university and academic health system are dedicated to improving the human experience.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
            <Link to="/gallery" className="btn btn-secondary">Visit Campus</Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="info-header">
            <h2>Our Key Focus Areas</h2>
            <p>Explore how we are making a difference every day.</p>
          </div>

          <div className="info-container">
            <div className="info-box card">
              <img src="/assets/images/box1.png" alt="Research" />
              <h3>Research Excellence</h3>
              <p>Leading innovative research to solve tomorrow's challenges today.</p>
            </div>

            <div className="info-box card">
              <img src="/assets/images/box2.png" alt="Education" />
              <h3>Quality Education</h3>
              <p>Providing world-class education across diverse disciplines.</p>
            </div>

            <div className="info-box card">
              <img src="/assets/images/box3.png" alt="Community" />
              <h3>Community Impact</h3>
              <p>Making a positive difference in our community and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="announcements-section">
          <div className="container">
            <h2>Latest Announcements</h2>
            <div className="announcements-grid">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card card">
                  <div className={`announcement-badge ${announcement.type}`}>
                    {announcement.type}
                  </div>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <small>
                    {new Date(announcement.date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join UAB and become part of our vibrant community</p>
          <Link to="/admissions" className="btn btn-primary">Apply Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
