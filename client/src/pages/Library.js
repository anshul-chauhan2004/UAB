import React from 'react';
import './Library.css';

const Library = () => {
  return (
    <div className="library-page">
      <div className="library-header">
        <div className="container">
          <h1>UAB Library</h1>
          <p>Your Gateway to Knowledge and Research</p>
        </div>
      </div>

      <div className="container">
        <section className="library-intro">
          <h2>Welcome to UAB Libraries</h2>
          <p>
            The UAB Libraries support the university's mission of teaching, research, patient care, 
            and community service by providing access to information resources and services that 
            foster intellectual discovery and lifelong learning.
          </p>
        </section>

        <section className="library-services">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card card">
              <div className="service-icon">📖</div>
              <h3>Research Resources</h3>
              <p>Access millions of books, journals, databases, and digital collections.</p>
              <button className="btn btn-primary">Search Catalog</button>
            </div>

            <div className="service-card card">
              <div className="service-icon">💻</div>
              <h3>Study Spaces</h3>
              <p>Individual study rooms, group collaboration areas, and quiet zones.</p>
              <button className="btn btn-primary">Reserve a Space</button>
            </div>

            <div className="service-card card">
              <div className="service-icon">🎓</div>
              <h3>Research Help</h3>
              <p>Get assistance from librarians for your research and assignments.</p>
              <button className="btn btn-primary">Ask a Librarian</button>
            </div>

            <div className="service-card card">
              <div className="service-icon">🖨️</div>
              <h3>Print & Copy</h3>
              <p>Printing, scanning, and copying services available throughout the library.</p>
              <button className="btn btn-primary">View Services</button>
            </div>

            <div className="service-card card">
              <div className="service-icon">📚</div>
              <h3>Interlibrary Loan</h3>
              <p>Request materials not available in our collection from other libraries.</p>
              <button className="btn btn-primary">Request Materials</button>
            </div>

            <div className="service-card card">
              <div className="service-icon">🎯</div>
              <h3>Workshops & Training</h3>
              <p>Learn research skills, citation management, and more through our workshops.</p>
              <button className="btn btn-primary">View Schedule</button>
            </div>
          </div>
        </section>

        <section className="library-locations">
          <h2>Library Locations</h2>
          <div className="locations-grid">
            <div className="location-card card">
              <h3>Lister Hill Library</h3>
              <div className="location-info">
                <p><strong>Focus:</strong> Health Sciences</p>
                <p><strong>Hours:</strong> Monday-Friday: 7:00 AM - 12:00 AM</p>
                <p><strong>Weekend:</strong> Saturday-Sunday: 10:00 AM - 10:00 PM</p>
                <p><strong>Location:</strong> 1700 University Blvd, Birmingham, AL 35233</p>
              </div>
              <button className="btn btn-secondary">Get Directions</button>
            </div>

            <div className="location-card card">
              <h3>Mervyn H. Sterne Library</h3>
              <div className="location-info">
                <p><strong>Focus:</strong> General Collection</p>
                <p><strong>Hours:</strong> Monday-Friday: 7:30 AM - 11:00 PM</p>
                <p><strong>Weekend:</strong> Saturday-Sunday: 10:00 AM - 8:00 PM</p>
                <p><strong>Location:</strong> 917 13th Street South, Birmingham, AL 35294</p>
              </div>
              <button className="btn btn-secondary">Get Directions</button>
            </div>

            <div className="location-card card">
              <h3>Reynolds-Finley Historical Library</h3>
              <div className="location-info">
                <p><strong>Focus:</strong> Historical Medical Collections</p>
                <p><strong>Hours:</strong> Monday-Friday: 9:00 AM - 5:00 PM</p>
                <p><strong>Weekend:</strong> Closed</p>
                <p><strong>Location:</strong> 1700 University Blvd, Birmingham, AL 35294</p>
              </div>
              <button className="btn btn-secondary">Get Directions</button>
            </div>
          </div>
        </section>

        <section className="digital-resources">
          <h2>Digital Resources</h2>
          <div className="resources-grid">
            <div className="resource-card card">
              <h3>Databases A-Z</h3>
              <p>Browse our comprehensive collection of academic databases by subject or title.</p>
              <ul>
                <li>PubMed</li>
                <li>JSTOR</li>
                <li>Web of Science</li>
                <li>IEEE Xplore</li>
                <li>ScienceDirect</li>
              </ul>
            </div>

            <div className="resource-card card">
              <h3>E-Books & E-Journals</h3>
              <p>Access thousands of electronic books and journals from anywhere.</p>
              <ul>
                <li>150,000+ E-Books</li>
                <li>50,000+ E-Journals</li>
                <li>24/7 Online Access</li>
                <li>Mobile-Friendly</li>
              </ul>
            </div>

            <div className="resource-card card">
              <h3>Special Collections</h3>
              <p>Explore rare books, manuscripts, and unique archival materials.</p>
              <ul>
                <li>Historical Medical Texts</li>
                <li>University Archives</li>
                <li>Alabama History</li>
                <li>Rare Book Collection</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="library-tools">
          <h2>Research Tools</h2>
          <div className="tools-grid">
            <div className="tool-card card">
              <div className="tool-icon">🔍</div>
              <h3>OneSearch</h3>
              <p>Search all library resources in one place - books, articles, and more.</p>
            </div>

            <div className="tool-card card">
              <div className="tool-icon">📝</div>
              <h3>Citation Manager</h3>
              <p>Organize references and create bibliographies with Zotero and RefWorks.</p>
            </div>

            <div className="tool-card card">
              <div className="tool-icon">🎓</div>
              <h3>Research Guides</h3>
              <p>Subject-specific guides created by librarians to help with your research.</p>
            </div>

            <div className="tool-card card">
              <div className="tool-icon">📊</div>
              <h3>Data Services</h3>
              <p>Find datasets, statistics, and tools for data analysis and visualization.</p>
            </div>
          </div>
        </section>

        <section className="library-contact">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-card card">
              <h3>General Inquiries</h3>
              <p>📧 library@uab.edu</p>
              <p>📞 (205) 934-6364</p>
            </div>

            <div className="contact-card card">
              <h3>Research Assistance</h3>
              <p>📧 askalibrarian@uab.edu</p>
              <p>💬 Live Chat: Available 24/7</p>
            </div>

            <div className="contact-card card">
              <h3>Technical Support</h3>
              <p>📧 libtech@uab.edu</p>
              <p>📞 (205) 934-2230</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
