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
import RoleDashboard from './components/RoleDashboard';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Admissions from './pages/Admissions';
import Portfolio from './pages/Portfolio';
import StudentPortal from './pages/StudentPortal';
import Library from './pages/Library';
import CareerServices from './pages/CareerServices';
import CampusMap from './pages/CampusMap';
import ProtectedRoute from './components/ProtectedRoute';
import LogoutRoute from './components/LogoutRoute';
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
              <Route path="/" element={<LogoutRoute><Home /></LogoutRoute>} />
              <Route path="/about" element={<LogoutRoute><About /></LogoutRoute>} />
              <Route path="/departments" element={<LogoutRoute><Departments /></LogoutRoute>} />
              <Route path="/courses" element={<LogoutRoute><Courses /></LogoutRoute>} />
              <Route path="/contact" element={<LogoutRoute><Contact /></LogoutRoute>} />
              <Route path="/gallery" element={<LogoutRoute><Gallery /></LogoutRoute>} />
              <Route path="/admissions" element={<LogoutRoute><Admissions /></LogoutRoute>} />
              <Route path="/portfolio" element={<LogoutRoute><Portfolio /></LogoutRoute>} />
              <Route path="/student-portal" element={<LogoutRoute><StudentPortal /></LogoutRoute>} />
              <Route path="/library" element={<LogoutRoute><Library /></LogoutRoute>} />
              <Route path="/career-services" element={<LogoutRoute><CareerServices /></LogoutRoute>} />
              <Route path="/campus-map" element={<LogoutRoute><CampusMap /></LogoutRoute>} />
              <Route path="/login" element={<LogoutRoute><Login /></LogoutRoute>} />
              <Route path="/register" element={<LogoutRoute><Register /></LogoutRoute>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleDashboard />
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
