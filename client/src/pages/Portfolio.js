import React, { useState } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'Breakthrough in Cancer Research',
      description: 'UAB researchers discover a new approach to targeting cancer cells, potentially revolutionizing treatment methods.',
      category: 'Research',
      image: '/assets/images/box1.png'
    },
    {
      id: 2,
      title: 'AI-Powered Healthcare Assistant',
      description: 'Students develop an AI system to assist healthcare professionals in diagnosing complex medical conditions.',
      category: 'Innovation',
      image: '/assets/images/box2.png'
    },
    {
      id: 3,
      title: 'Urban Garden Initiative',
      description: 'UAB partners with local communities to create sustainable urban gardens, promoting food security and education.',
      category: 'Community',
      image: '/assets/images/box3.png'
    },
    {
      id: 4,
      title: 'Digital Art Exhibition',
      description: 'Students showcase their digital art creations, exploring the intersection of technology and creativity.',
      category: 'Arts',
      image: '/assets/images/news1.png'
    },
    {
      id: 5,
      title: 'Renewable Energy Breakthrough',
      description: 'UAB engineers develop a more efficient solar panel technology, paving the way for sustainable energy solutions.',
      category: 'Research',
      image: '/assets/images/news2.png'
    },
    {
      id: 6,
      title: 'Smart City Infrastructure',
      description: 'A collaborative project to design and implement smart city solutions for improved urban living.',
      category: 'Innovation',
      image: '/assets/images/news3.png'
    },
    {
      id: 7,
      title: 'Neuroscience Brain Mapping',
      description: 'Advanced brain mapping research reveals new insights into neurological disorders and treatments.',
      category: 'Research',
      image: '/assets/images/news4.png'
    },
    {
      id: 8,
      title: 'Student Wellness Program',
      description: 'Comprehensive wellness initiative supporting mental and physical health of UAB community members.',
      category: 'Community',
      image: '/assets/images/Front_Look.png'
    },
    {
      id: 9,
      title: 'Robotics Competition Winner',
      description: 'UAB robotics team wins national competition with innovative autonomous navigation system.',
      category: 'Innovation',
      image: '/assets/images/campus_image.png'
    }
  ];

  const categories = ['All', 'Research', 'Innovation', 'Community', 'Arts'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div className="container">
          <h1>Portfolio</h1>
          <p>Explore Our Innovative Projects and Groundbreaking Research</p>
        </div>
      </div>

      <div className="container">
        <section className="portfolio-intro">
          <h2>Our Work</h2>
          <p>
            Discover the innovative projects and groundbreaking research conducted by UAB students, 
            faculty, and researchers. From medical breakthroughs to community initiatives, our work 
            makes a real difference in the world.
          </p>
        </section>

        <section className="portfolio-filters-section">
          <div className="portfolio-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="results-count">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </section>

        <section className="portfolio-grid-section">
          <div className="portfolio-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="portfolio-card card">
                <div className="portfolio-image">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.src = '/assets/images/image.png';
                    }}
                  />
                  <div className="portfolio-category-badge">{project.category}</div>
                </div>
                <div className="portfolio-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-research">
          <h2>Featured Research Areas</h2>
          <div className="research-areas-grid">
            <div className="research-area-card card">
              <div className="research-icon">🔬</div>
              <h3>Medical Sciences</h3>
              <p>Leading research in cancer treatment, immunology, and regenerative medicine.</p>
            </div>
            <div className="research-area-card card">
              <div className="research-icon">💻</div>
              <h3>Technology & Engineering</h3>
              <p>Innovation in AI, robotics, sustainable energy, and smart systems.</p>
            </div>
            <div className="research-area-card card">
              <div className="research-icon">🌍</div>
              <h3>Environmental Studies</h3>
              <p>Research on climate change, sustainability, and ecosystem preservation.</p>
            </div>
            <div className="research-area-card card">
              <div className="research-icon">🧠</div>
              <h3>Neuroscience</h3>
              <p>Advancing understanding of brain function and neurological disorders.</p>
            </div>
          </div>
        </section>

        <section className="portfolio-cta">
          <h2>Want to Collaborate on Research?</h2>
          <p>Join our research community and contribute to groundbreaking discoveries.</p>
          <button className="btn btn-primary">Contact Research Office</button>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
