import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Admissions from './pages/Admissions';
import Portfolio from './pages/Portfolio';
import StudentPortal from './pages/StudentPortal';
import Library from './pages/Library';
import CareerServices from './pages/CareerServices';
import CampusMap from './pages/CampusMap';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/student-portal" element={<StudentPortal />} />
              <Route path="/library" element={<Library />} />
              <Route path="/career-services" element={<CareerServices />} />
              <Route path="/campus-map" element={<CampusMap />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
