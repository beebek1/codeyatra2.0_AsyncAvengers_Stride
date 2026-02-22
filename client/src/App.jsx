import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import QuizPage from './pages/Quizpage'; 
import Account from './pages/Account';
import Roadmap from './pages/Roadmap';

// Components
import { ScrollToTop, NotFound } from './components/Elements';
import Footer from './components/Footer';

function AppWrapper() {
  const role = "org"; 

  return (
    // Added flex flex-col and min-h-screen to push the footer to the bottom
    <div className="flex flex-col min-h-screen w-full">
      <Toaster position='top-right' />
      
      {/* flex-grow ensures the routing area takes up all available space, pushing the footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Register/>} />
          <Route path="/login" element={<Login/>} />   
          <Route path="/quiz" element={<QuizPage/>} />   
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/account" element={<Account/>} />
          {/* --- NEW ROADMAP ROUTES --- */}
          <Route path="/roadmap" element={<Roadmap/>} />
          {/* Placeholders for the individual level pages so your demo doesn't break */}
          <Route path="/roadmap/beginner" element={<div className="p-20 text-center text-3xl font-black uppercase">Beginner Content</div>} />
          <Route path="/roadmap/intermediate" element={<div className="p-20 text-center text-3xl font-black uppercase text-[#f5c842]">Intermediate Content</div>} />
          <Route path="/roadmap/advanced" element={<div className="p-20 text-center text-3xl font-black uppercase">Advanced Content</div>} />

          {/* fallout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer appears on every page */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen font-sans text-gray-900">
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App;