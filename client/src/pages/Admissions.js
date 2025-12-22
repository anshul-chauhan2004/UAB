import React from 'react';
import { Link } from 'react-router-dom';
import './Admissions.css';

const Admissions = () => {
  return (
    <div className="admissions-page">
      <div className="admissions-header">
        <div className="container">
          <h1>Admissions</h1>
          <p>Start Your Journey at UAB</p>
        </div>
      </div>

      <div className="container">
        <section className="admissions-section">
          <h2>Application Process</h2>
          <p>
            We're excited that you're considering UAB for your education. Our admissions 
            process is designed to be straightforward and accessible. Follow these steps 
            to begin your journey with us.
          </p>
        </section>

        <section className="process-section">
          <h2>How to Apply</h2>
          <div className="process-steps">
            <div className="step-card card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Register for a student account and complete your profile with basic information.</p>
              <Link to="/register" className="btn btn-primary">Register Now</Link>
            </div>

            <div className="step-card card">
              <div className="step-number">2</div>
              <h3>Browse Programs</h3>
              <p>Explore our 140+ degree programs and find the one that matches your interests.</p>
              <Link to="/departments" className="btn btn-primary">View Programs</Link>
            </div>

            <div className="step-card card">
              <div className="step-number">3</div>
              <h3>Submit Application</h3>
              <p>Complete the online application form with your academic records and documents.</p>
              <button className="btn btn-primary">Start Application</button>
            </div>

            <div className="step-card card">
              <div className="step-number">4</div>
              <h3>Application Review</h3>
              <p>Our admissions team will review your application and contact you within 2-3 weeks.</p>
            </div>
          </div>
        </section>

        <section className="requirements-section">
          <h2>Admission Requirements</h2>
          <div className="requirements-grid">
            <div className="requirement-card card">
              <h3>Undergraduate</h3>
              <ul>
                <li>High school diploma or equivalent</li>
                <li>Minimum GPA of 3.0</li>
                <li>SAT/ACT scores (optional for 2025)</li>
                <li>Personal statement</li>
                <li>Letter of recommendation</li>
                <li>Transcripts from all schools attended</li>
              </ul>
            </div>

            <div className="requirement-card card">
              <h3>Graduate</h3>
              <ul>
                <li>Bachelor's degree from accredited institution</li>
                <li>Minimum GPA of 3.0 in undergraduate work</li>
                <li>GRE/GMAT scores (varies by program)</li>
                <li>Statement of purpose</li>
                <li>Three letters of recommendation</li>
                <li>Resume or CV</li>
              </ul>
            </div>

            <div className="requirement-card card">
              <h3>International Students</h3>
              <ul>
                <li>All standard requirements</li>
                <li>TOEFL/IELTS scores for English proficiency</li>
                <li>Credential evaluation of foreign transcripts</li>
                <li>Financial support documentation</li>
                <li>Valid passport</li>
                <li>Student visa (F-1 or J-1)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="deadlines-section">
          <h2>Important Dates</h2>
          <div className="deadlines-grid">
            <div className="deadline-card card">
              <h3>Fall 2025</h3>
              <div className="deadline-item">
                <span className="deadline-label">Early Decision:</span>
                <span className="deadline-date">November 1, 2024</span>
              </div>
              <div className="deadline-item">
                <span className="deadline-label">Regular Decision:</span>
                <span className="deadline-date">February 1, 2025</span>
              </div>
              <div className="deadline-item">
                <span className="deadline-label">Final Deadline:</span>
                <span className="deadline-date">May 1, 2025</span>
              </div>
            </div>

            <div className="deadline-card card">
              <h3>Spring 2026</h3>
              <div className="deadline-item">
                <span className="deadline-label">Early Decision:</span>
                <span className="deadline-date">September 1, 2025</span>
              </div>
              <div className="deadline-item">
                <span className="deadline-label">Regular Decision:</span>
                <span className="deadline-date">October 15, 2025</span>
              </div>
              <div className="deadline-item">
                <span className="deadline-label">Final Deadline:</span>
                <span className="deadline-date">November 30, 2025</span>
              </div>
            </div>
          </div>
        </section>

        <section className="financial-section">
          <h2>Tuition & Financial Aid</h2>
          <div className="financial-grid">
            <div className="financial-card card">
              <h3>Tuition Rates (2024-2025)</h3>
              <div className="tuition-item">
                <span>Undergraduate (In-State):</span>
                <strong>$11,660 / year</strong>
              </div>
              <div className="tuition-item">
                <span>Undergraduate (Out-of-State):</span>
                <strong>$29,230 / year</strong>
              </div>
              <div className="tuition-item">
                <span>Graduate (In-State):</span>
                <strong>$10,780 / year</strong>
              </div>
              <div className="tuition-item">
                <span>Graduate (Out-of-State):</span>
                <strong>$27,560 / year</strong>
              </div>
            </div>

            <div className="financial-card card">
              <h3>Financial Aid Options</h3>
              <ul>
                <li>Federal & State Grants</li>
                <li>Merit-based Scholarships</li>
                <li>Need-based Scholarships</li>
                <li>Work-Study Programs</li>
                <li>Student Loans</li>
                <li>Graduate Assistantships</li>
              </ul>
              <button className="btn btn-primary">Apply for Financial Aid</button>
            </div>
          </div>
        </section>

        <section className="contact-admissions">
          <h2>Questions About Admissions?</h2>
          <p>Our admissions team is here to help you every step of the way.</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> admissions@uab.edu
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> (205) 934-8221
            </div>
            <div className="contact-item">
              <strong>Office Hours:</strong> Monday-Friday, 8:00 AM - 5:00 PM CST
            </div>
          </div>
          <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
        </section>
      </div>
    </div>
  );
};

export default Admissions;
