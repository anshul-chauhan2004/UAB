import React from 'react';
import './CareerServices.css';

const CareerServices = () => {
  return (
    <div className="career-services-page">
      <div className="career-header">
        <div className="container">
          <h1>Career Services</h1>
          <p>Launch Your Career with UAB</p>
        </div>
      </div>

      <div className="container">
        <section className="career-intro">
          <h2>Your Career Success is Our Mission</h2>
          <p>
            UAB Career Services helps students and alumni explore career options, develop 
            professional skills, connect with employers, and achieve their career goals. 
            We provide personalized guidance and resources to help you succeed in your career journey.
          </p>
        </section>

        <section className="career-services-section">
          <h2>Our Services</h2>
          <div className="career-services-grid">
            <div className="career-service-card card">
              <div className="career-icon">💼</div>
              <h3>Career Counseling</h3>
              <p>One-on-one sessions to explore career paths, set goals, and develop strategies.</p>
              <button className="btn btn-primary">Schedule Appointment</button>
            </div>

            <div className="career-service-card card">
              <div className="career-icon">📝</div>
              <h3>Resume & Cover Letter</h3>
              <p>Get expert feedback on your resume and learn to write compelling cover letters.</p>
              <button className="btn btn-primary">Upload Resume</button>
            </div>

            <div className="career-service-card card">
              <div className="career-icon">🎤</div>
              <h3>Interview Preparation</h3>
              <p>Practice interviews, receive feedback, and build confidence for success.</p>
              <button className="btn btn-primary">Practice Now</button>
            </div>

            <div className="career-service-card card">
              <div className="career-icon">🔍</div>
              <h3>Job Search Assistance</h3>
              <p>Access job boards, learn search strategies, and find opportunities.</p>
              <button className="btn btn-primary">Search Jobs</button>
            </div>

            <div className="career-service-card card">
              <div className="career-icon">🤝</div>
              <h3>Networking Events</h3>
              <p>Connect with employers, alumni, and professionals at career fairs and events.</p>
              <button className="btn btn-primary">View Events</button>
            </div>

            <div className="career-service-card card">
              <div className="career-icon">🎓</div>
              <h3>Internship Programs</h3>
              <p>Find internships to gain valuable experience in your field of study.</p>
              <button className="btn btn-primary">Find Internships</button>
            </div>
          </div>
        </section>

        <section className="upcoming-events">
          <h2>Upcoming Career Events</h2>
          <div className="events-grid">
            <div className="event-card card">
              <div className="event-badge">Upcoming</div>
              <h3>Spring Career Fair 2025</h3>
              <p className="event-date">📅 February 15, 2025</p>
              <p className="event-location">📍 Student Center Ballroom</p>
              <p className="event-description">
                Meet with 100+ employers from various industries. Bring your resume and dress professionally.
              </p>
              <button className="btn btn-primary">Register Now</button>
            </div>

            <div className="event-card card">
              <div className="event-badge">Workshop</div>
              <h3>Resume Writing Workshop</h3>
              <p className="event-date">📅 January 20, 2025</p>
              <p className="event-location">📍 Career Services Center</p>
              <p className="event-description">
                Learn how to create a standout resume that gets noticed by employers.
              </p>
              <button className="btn btn-primary">Sign Up</button>
            </div>

            <div className="event-card card">
              <div className="event-badge">Networking</div>
              <h3>Alumni Networking Night</h3>
              <p className="event-date">📅 February 5, 2025</p>
              <p className="event-location">📍 UAB Alumni House</p>
              <p className="event-description">
                Network with successful UAB alumni and learn about career opportunities.
              </p>
              <button className="btn btn-primary">RSVP</button>
            </div>
          </div>
        </section>

        <section className="resources-section">
          <h2>Career Resources</h2>
          <div className="resources-cards">
            <div className="resource-item card">
              <h3>📊 Career Assessment Tools</h3>
              <p>Discover your strengths, interests, and career matches with online assessments.</p>
              <ul>
                <li>Myers-Briggs Type Indicator</li>
                <li>Strong Interest Inventory</li>
                <li>StrengthsFinder</li>
                <li>Career Values Assessment</li>
              </ul>
            </div>

            <div className="resource-item card">
              <h3>📚 Professional Development</h3>
              <p>Build skills that employers value through workshops and online courses.</p>
              <ul>
                <li>LinkedIn Learning Access</li>
                <li>Professional Communication</li>
                <li>Leadership Development</li>
                <li>Industry Certifications</li>
              </ul>
            </div>

            <div className="resource-item card">
              <h3>🌐 Online Job Portals</h3>
              <p>Access exclusive job postings and connect with employers hiring UAB students.</p>
              <ul>
                <li>Handshake (UAB)</li>
                <li>LinkedIn Jobs</li>
                <li>Indeed Campus</li>
                <li>Glassdoor</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="employer-section">
          <h2>For Employers</h2>
          <div className="employer-grid">
            <div className="employer-card card">
              <h3>Post Jobs & Internships</h3>
              <p>Connect with talented UAB students and alumni through our job board.</p>
              <button className="btn btn-secondary">Post a Job</button>
            </div>

            <div className="employer-card card">
              <h3>Attend Career Fairs</h3>
              <p>Participate in our career fairs and networking events to meet candidates.</p>
              <button className="btn btn-secondary">Register as Employer</button>
            </div>

            <div className="employer-card card">
              <h3>Campus Recruiting</h3>
              <p>Schedule on-campus interviews and information sessions with students.</p>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </section>

        <section className="success-stories">
          <h2>Student Success Stories</h2>
          <div className="stories-grid">
            <div className="story-card card">
              <div className="quote-icon">"</div>
              <p className="story-text">
                "Career Services helped me land my dream job at a Fortune 500 company. The 
                resume review and mock interviews were invaluable!"
              </p>
              <p className="story-author">- Sarah Johnson, Class of 2024</p>
              <p className="story-role">Software Engineer at Microsoft</p>
            </div>

            <div className="story-card card">
              <div className="quote-icon">"</div>
              <p className="story-text">
                "The career fair introduced me to my current employer. I'm so grateful for 
                the networking opportunities UAB provided."
              </p>
              <p className="story-author">- Michael Chen, Class of 2023</p>
              <p className="story-role">Financial Analyst at JPMorgan Chase</p>
            </div>

            <div className="story-card card">
              <div className="quote-icon">"</div>
              <p className="story-text">
                "The internship I found through Career Services turned into a full-time 
                offer. The support I received was outstanding!"
              </p>
              <p className="story-author">- Emily Rodriguez, Class of 2024</p>
              <p className="story-role">Marketing Manager at Coca-Cola</p>
            </div>
          </div>
        </section>

        <section className="career-contact">
          <h2>Visit Us or Get in Touch</h2>
          <div className="career-contact-info">
            <div className="contact-details card">
              <h3>Career Services Center</h3>
              <p><strong>Location:</strong> Hill University Center, Suite 340</p>
              <p><strong>Hours:</strong> Monday-Friday, 8:00 AM - 5:00 PM</p>
              <p><strong>Email:</strong> careerservices@uab.edu</p>
              <p><strong>Phone:</strong> (205) 934-4324</p>
              <button className="btn btn-primary">Schedule Appointment</button>
            </div>

            <div className="quick-links card">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Student Login</a></li>
                <li><a href="#">Employer Portal</a></li>
                <li><a href="#">Career Fair Registration</a></li>
                <li><a href="#">Workshop Calendar</a></li>
                <li><a href="#">Alumni Services</a></li>
                <li><a href="#">Career Blog</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareerServices;
