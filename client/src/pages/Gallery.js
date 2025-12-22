import React from 'react';
import './Gallery.css';

const Gallery = () => {
  const images = [
    { src: '/assets/images/Front_Look.png', caption: 'Main Academic Building' },
    { src: '/assets/images/campus_image.png', caption: 'Campus View' },
    { src: '/assets/images/UAB_vision.png', caption: 'UAB Vision Center' },
    { src: '/assets/images/box1.png', caption: 'Engineering Complex' },
    { src: '/assets/images/box2.png', caption: 'Medical Research Center' },
    { src: '/assets/images/box3.png', caption: 'Arts and Sciences Building' },
    { src: '/assets/images/news1.png', caption: 'Business School' },
    { src: '/assets/images/news2.png', caption: 'Nursing Building' },
    { src: '/assets/images/news3.png', caption: 'Public Health Institute' },
    { src: '/assets/images/news4.png', caption: 'Student Activities Center' },
    { src: '/assets/images/image.png', caption: 'Campus Facilities' }
  ];

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="container">
          <h1>UAB Campus Gallery</h1>
          <p>Explore our beautiful campus and state-of-the-art facilities</p>
        </div>
      </div>

      <div className="container">
        <div className="gallery-grid">
          {images.map((item, idx) => (
            <div key={idx} className="gallery-item card">
              <img 
                src={item.src} 
                alt={item.caption}
                onError={(e) => {
                  e.target.src = '/assets/images/image.png';
                }}
              />
              <div className="gallery-caption">{item.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
