import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import QuizPage from './pages/Quizpage';
import { ScrollToTop, NotFound } from './components/Elements';
import CareersPage from './pages/Career';
import Schedule from './pages/Schedule';
import ProtectedRoute from './protected/ProtectedROute'; 
import Trello from './pages/Trello';
import Account from './pages/Account';
import Roadmap from './pages/Roadmap';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppWrapper() {
  const location = useLocation();
  
  // Logic to hide Navbar/Footer on Auth pages
  const hideComponents = ['/register', '/forgot-password', '/login'].includes(location.pathname);

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      {!hideComponents && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/trello" element={<Trello />} />

        {/* Protected Routes */}
        <Route 
          path="/quiz" 
          element={<ProtectedRoute element={<QuizPage />} />} 
        />
        <Route 
          path="/schedule" 
          element={<ProtectedRoute element={<Schedule />} />} 
        />
        <Route 
          path="/account" 
          element={<ProtectedRoute element={<Account />} />} 
        />
        <Route 
          path="/board" 
          element={<ProtectedRoute element={<Trello />} />} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideComponents && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
}