import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StudentPortal.css';

const StudentPortal = () => {
  const { user } = useAuth();

  return (
    <div className="student-portal-page">
      <div className="portal-header">
        <div className="container">
          <h1>Student Portal</h1>
          <p>Your Gateway to Academic Resources</p>
        </div>
      </div>

      <div className="container">
        {user ? (
          <>
            <section className="welcome-section">
              <h2>Welcome back, {user.name}!</h2>
              <p>Access all your academic resources and tools in one place.</p>
            </section>

            <section className="portal-grid">
              <Link to="/dashboard" className="portal-card card">
                <div className="portal-icon">📊</div>
                <h3>My Dashboard</h3>
                <p>View your personalized dashboard with grades, schedule, and important updates.</p>
              </Link>

              <Link to="/courses" className="portal-card card">
                <div className="portal-icon">📚</div>
                <h3>My Courses</h3>
                <p>Access course materials, assignments, and learning resources.</p>
              </Link>

              <div className="portal-card card">
                <div className="portal-icon">📅</div>
                <h3>Class Schedule</h3>
                <p>View your class schedule, exam dates, and academic calendar.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">💰</div>
                <h3>Financial Services</h3>
                <p>Check tuition, pay bills, view financial aid, and manage payments.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">📝</div>
                <h3>Registration</h3>
                <p>Register for classes, drop/add courses, and view enrollment status.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">📄</div>
                <h3>Transcripts</h3>
                <p>Request official transcripts and view your academic records.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">✉️</div>
                <h3>UAB Email</h3>
                <p>Access your university email and stay connected with faculty and peers.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">🎓</div>
                <h3>Degree Progress</h3>
                <p>Track your degree requirements and plan your academic path.</p>
              </div>

              <div className="portal-card card">
                <div className="portal-icon">🏥</div>
                <h3>Health Services</h3>
                <p>Schedule appointments, access health records, and view wellness resources.</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="login-prompt">
              <h2>Access Your Student Portal</h2>
              <p>Please sign in to access your personalized student resources and tools.</p>
              <div className="prompt-buttons">
                <Link to="/login" className="btn btn-primary">Sign In</Link>
                <Link to="/register" className="btn btn-secondary">Create Account</Link>
              </div>
            </section>

            <section className="portal-features">
              <h2>What's in the Student Portal?</h2>
              <div className="features-grid">
                <div className="feature-card card">
                  <div className="feature-icon">🎯</div>
                  <h3>Academic Resources</h3>
                  <p>Access courses, grades, schedules, and registration tools all in one place.</p>
                </div>

                <div className="feature-card card">
                  <div className="feature-icon">💳</div>
                  <h3>Financial Management</h3>
                  <p>View tuition, make payments, and manage your financial aid easily.</p>
                </div>

                <div className="feature-card card">
                  <div className="feature-icon">📱</div>
                  <h3>24/7 Access</h3>
                  <p>Access your portal anytime, anywhere from any device with internet.</p>
                </div>

                <div className="feature-card card">
                  <div className="feature-icon">🔒</div>
                  <h3>Secure & Private</h3>
                  <p>Your information is protected with industry-standard security measures.</p>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="help-section">
          <h2>Need Help?</h2>
          <div className="help-grid">
            <div className="help-card card">
              <h3>Technical Support</h3>
              <p>Having trouble accessing the portal?</p>
              <div className="help-contact">
                <div>📧 itsupport@uab.edu</div>
                <div>📞 (205) 934-4357</div>
              </div>
            </div>

            <div className="help-card card">
              <h3>Student Services</h3>
              <p>Questions about registration or records?</p>
              <div className="help-contact">
                <div>📧 studentservices@uab.edu</div>
                <div>📞 (205) 934-8221</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentPortal;
