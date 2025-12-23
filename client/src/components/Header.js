import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="green-bar">
        <div className="marquee">
          <span>Welcome to UAB - Empowering Minds, Shaping Futures</span>
        </div>
      </div>

      <header className="main-header">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/assets/images/logo.png" alt="UAB Logo" className="logo-img" />
            </Link>
          </div>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <ul>
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/courses" className="nav-link">Courses</Link>
              </li>
              <li className="nav-item">
                <Link to="/departments" className="nav-link">Departments</Link>
              </li>
              <li className="nav-item">
                <Link to="/gallery" className="nav-link">Gallery</Link>
              </li>
              <li className="nav-item">
                <Link to="/portfolio" className="nav-link">Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link user-name">Hi, {user?.fullName?.split(' ')[0]}</span>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link login-link">Sign In</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
