import React from 'react';
import './CampusMap.css';

const CampusMap = () => {
  return (
    <div className="campus-map-page">
      <div className="map-header">
        <div className="container">
          <h1>Campus Map</h1>
          <p>Navigate the UAB Campus with Ease</p>
        </div>
      </div>

      <div className="container">
        <section className="map-intro">
          <h2>Explore Our Campus</h2>
          <p>
            UAB's campus spans over 100 city blocks in the heart of Birmingham. Use this guide 
            to find your way around our vibrant campus, from academic buildings to student services 
            and recreational facilities.
          </p>
        </section>

        <section className="interactive-map">
          <h2>Interactive Campus Map</h2>
          <div className="map-container card">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>Use the buttons below to explore different campus areas</p>
            </div>
            <div className="map-controls">
              <button className="btn btn-primary">View Full Map</button>
              <button className="btn btn-secondary">Get Directions</button>
              <button className="btn btn-secondary">Download PDF</button>
            </div>
          </div>
        </section>

        <section className="campus-buildings">
          <h2>Key Campus Locations</h2>
          <div className="buildings-grid">
            <div className="building-card card">
              <div className="building-icon">🏛️</div>
              <h3>Academic Buildings</h3>
              <ul>
                <li>Heritage Hall - Main Administration</li>
                <li>Hill University Center - Student Union</li>
                <li>Mervyn H. Sterne Library</li>
                <li>Campbell Hall - Engineering</li>
                <li>Volker Hall - Sciences</li>
                <li>School of Business</li>
                <li>School of Education</li>
              </ul>
              <button className="btn btn-primary">View All Buildings</button>
            </div>

            <div className="building-card card">
              <div className="building-icon">🏥</div>
              <h3>Medical Campus</h3>
              <ul>
                <li>UAB Hospital</li>
                <li>Spain Rehabilitation Center</li>
                <li>The Kirklin Clinic</li>
                <li>School of Medicine</li>
                <li>School of Nursing</li>
                <li>School of Dentistry</li>
                <li>Lister Hill Library</li>
              </ul>
              <button className="btn btn-primary">Medical Campus Map</button>
            </div>

            <div className="building-card card">
              <div className="building-icon">🏢</div>
              <h3>Student Services</h3>
              <ul>
                <li>Hill University Center</li>
                <li>Campus Recreation Center</li>
                <li>Student Health Services</li>
                <li>Career Services Center</li>
                <li>Financial Aid Office</li>
                <li>Registrar's Office</li>
                <li>International Student Services</li>
              </ul>
              <button className="btn btn-primary">Find Services</button>
            </div>

            <div className="building-card card">
              <div className="building-icon">🏠</div>
              <h3>Housing & Dining</h3>
              <ul>
                <li>Blazer Hall</li>
                <li>Rast Hall</li>
                <li>Camp Hall</li>
                <li>The Commons on the Hill</li>
                <li>Blaze Grill</li>
                <li>Einstein Bros Bagels</li>
                <li>Chick-fil-A</li>
              </ul>
              <button className="btn btn-primary">Housing Guide</button>
            </div>

            <div className="building-card card">
              <div className="building-icon">⚽</div>
              <h3>Recreation & Athletics</h3>
              <ul>
                <li>Campus Recreation Center</li>
                <li>Protective Stadium</li>
                <li>Bartow Arena</li>
                <li>UAB Soccer Complex</li>
                <li>Tennis Complex</li>
                <li>Track & Field Complex</li>
                <li>Intramural Fields</li>
              </ul>
              <button className="btn btn-primary">Athletics Map</button>
            </div>

            <div className="building-card card">
              <div className="building-icon">🅿️</div>
              <h3>Parking & Transportation</h3>
              <ul>
                <li>Parking Decks (10+)</li>
                <li>Surface Lots</li>
                <li>Visitor Parking</li>
                <li>Electric Vehicle Charging</li>
                <li>Blazer Express Shuttle</li>
                <li>Bike Share Stations</li>
                <li>BJCTA Bus Stops</li>
              </ul>
              <button className="btn btn-primary">Parking Info</button>
            </div>
          </div>
        </section>

        <section className="campus-zones">
          <h2>Campus Zones</h2>
          <div className="zones-grid">
            <div className="zone-card card">
              <h3>🟢 Central Campus</h3>
              <p><strong>Main Hub:</strong> Academic buildings, libraries, student center</p>
              <p><strong>Landmarks:</strong> Heritage Hall, Hill Center, Sterne Library</p>
            </div>

            <div className="zone-card card">
              <h3>🔴 Medical Campus</h3>
              <p><strong>Main Hub:</strong> Hospital, medical schools, research facilities</p>
              <p><strong>Landmarks:</strong> UAB Hospital, Spain Center, Lister Hill Library</p>
            </div>

            <div className="zone-card card">
              <h3>🔵 South Campus</h3>
              <p><strong>Main Hub:</strong> Athletic facilities, recreation, housing</p>
              <p><strong>Landmarks:</strong> Protective Stadium, Rec Center, Blazer Hall</p>
            </div>

            <div className="zone-card card">
              <h3>🟡 West Campus</h3>
              <p><strong>Main Hub:</strong> Research buildings, technology centers</p>
              <p><strong>Landmarks:</strong> Innovation Depot, Research Park</p>
            </div>
          </div>
        </section>

        <section className="getting-around">
          <h2>Getting Around Campus</h2>
          <div className="transport-grid">
            <div className="transport-card card">
              <div className="transport-icon">🚌</div>
              <h3>Blazer Express</h3>
              <p>Free shuttle service connecting all parts of campus</p>
              <p><strong>Hours:</strong> 7:00 AM - 10:00 PM (Weekdays)</p>
              <p><strong>Frequency:</strong> Every 15-20 minutes</p>
              <button className="btn btn-primary">View Routes</button>
            </div>

            <div className="transport-card card">
              <div className="transport-icon">🚲</div>
              <h3>Bike Share</h3>
              <p>Convenient bike rental at multiple campus locations</p>
              <p><strong>Stations:</strong> 15+ locations</p>
              <p><strong>Cost:</strong> $5 per day or $20 per semester</p>
              <button className="btn btn-primary">Find Stations</button>
            </div>

            <div className="transport-card card">
              <div className="transport-icon">🚶</div>
              <h3>Walking Paths</h3>
              <p>Safe, well-lit pedestrian pathways throughout campus</p>
              <p><strong>Features:</strong> Crosswalks, bridges, tunnels</p>
              <p><strong>Safety:</strong> Emergency call boxes every block</p>
              <button className="btn btn-primary">Safety Map</button>
            </div>
          </div>
        </section>

        <section className="visitor-info">
          <h2>Visitor Information</h2>
          <div className="visitor-grid">
            <div className="visitor-card card">
              <h3>Campus Tours</h3>
              <p>Join us for a guided tour of the UAB campus</p>
              <div className="visitor-details">
                <p>📅 Monday - Friday: 10:00 AM & 2:00 PM</p>
                <p>📅 Saturday: 11:00 AM</p>
                <p>⏱️ Duration: 90 minutes</p>
                <p>📍 Meet at: Heritage Hall</p>
              </div>
              <button className="btn btn-primary">Register for Tour</button>
            </div>

            <div className="visitor-card card">
              <h3>Visitor Parking</h3>
              <p>Convenient parking options for campus visitors</p>
              <div className="visitor-details">
                <p>🅿️ Visitor Deck: 10th Avenue South</p>
                <p>💰 Rate: $2 per hour, $10 daily max</p>
                <p>⏰ 24/7 Access</p>
                <p>💳 Credit cards accepted</p>
              </div>
              <button className="btn btn-primary">Parking Details</button>
            </div>
          </div>
        </section>

        <section className="contact-map">
          <h2>Need Help Finding Your Way?</h2>
          <div className="map-contact card">
            <p>Our campus information desk is here to help you navigate UAB</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>📍 Information Desk:</strong> Hill University Center, 1st Floor
              </div>
              <div className="contact-item">
                <strong>⏰ Hours:</strong> Monday-Friday, 8:00 AM - 5:00 PM
              </div>
              <div className="contact-item">
                <strong>📞 Phone:</strong> (205) 934-3420
              </div>
              <div className="contact-item">
                <strong>📧 Email:</strong> campusinfo@uab.edu
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CampusMap;
