import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import QuizPage from './pages/Quizpage';
import { ScrollToTop , NotFound} from './components/Elements';
import CareersPage from './pages/Career';
import Schedule from './pages/Schedule';
import Account from './pages/Account';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppWrapper() {

  const location = useLocation();
  const hideComponents = location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/login'

  return (
    // Added flex flex-col and min-h-screen to push the footer to the bottom
    <div className="flex flex-col min-h-screen w-full">
      <Toaster position='top-right' />
      { !hideComponents && <Navbar/> }
      <Routes>
           
           <Route path="/login" element={<Login/>} />   
           <Route path="/register" element={<Register/>} />
           <Route path="/quiz" element={<QuizPage/>} />   
           <Route path="/" element={<Dashboard/>} />
           <Route path="/forgot-password" element={<ForgotPassword/>} />
           <Route path="/careers" element={<CareersPage/>} />
           <Route path="/schedule" element={<Schedule/>} />
           <Route path="/account" element={<Account />} />

          {/* fallout */}
          <Route path="*" element={<NotFound />} />
      </Routes>

      { !hideComponents && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App;