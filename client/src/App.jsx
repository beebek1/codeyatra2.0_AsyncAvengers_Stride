import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import './App.css'
import QuizPage from './pages/Quizpage';


function AppWrapper() {
  const role = "org"; 

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
           
           <Route path="/login" element={<Login/>} />   
           <Route path="/" element={<Register/>} />
           <Route path="/quiz" element={<QuizPage/>} />   
           <Route path="/" element={<Register/>} />   
           <Route path="/dashboard" element={<Dashboard/>} />
           <Route path="/forgot-password" element={<ForgotPassword/>} />

        {/* fallout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-[#080808] min-h-screen text-white">
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App