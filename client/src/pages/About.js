import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1>About UAB</h1>
          <p>The University of Alabama at Birmingham</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            The University of Alabama at Birmingham is a public research university dedicated 
            to interdisciplinary education, research, and community service. We strive to be 
            an internationally renowned research university and academic health center known 
            as a first choice for education and development of world-class professionals.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            To be recognized as a model 21st-century public research university, known for 
            excellence in education, research, scholarship, and patient care with a deep 
            commitment to community engagement.
          </p>
        </section>

        <section className="stats-section">
          <div className="stat-box card">
            <h3>25,000+</h3>
            <p>Students</p>
          </div>
          <div className="stat-box card">
            <h3>140+</h3>
            <p>Degree Programs</p>
          </div>
          <div className="stat-box card">
            <h3>12:1</h3>
            <p>Student-Faculty Ratio</p>
          </div>
          <div className="stat-box card">
            <h3>50+</h3>
            <p>Research Centers</p>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card card">
              <h3>Excellence</h3>
              <p>Commitment to the highest standards in all endeavors</p>
            </div>
            <div className="value-card card">
              <h3>Integrity</h3>
              <p>Ethical conduct and responsible stewardship</p>
            </div>
            <div className="value-card card">
              <h3>Innovation</h3>
              <p>Fostering creativity and entrepreneurial spirit</p>
            </div>
            <div className="value-card card">
              <h3>Diversity</h3>
              <p>Embracing and celebrating our differences</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
