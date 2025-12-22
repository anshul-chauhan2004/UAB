import React from 'react';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with UAB</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Visit Us</h2>
            <div className="info-item">
              <h3>Address</h3>
              <p>1720 2nd Ave S<br />Birmingham, AL 35294</p>
            </div>
            <div className="info-item">
              <h3>Phone</h3>
              <p>(205) 934-4011</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>info@uab.edu</p>
            </div>
            <div className="info-item">
              <h3>Office Hours</h3>
              <p>Monday - Friday: 8:00 AM - 5:00 PM<br />
                 Saturday - Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="your.email@example.com" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" required placeholder="Subject" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" required placeholder="Your message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
