import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import QuizPage from './pages/Quizpage';
import { ScrollToTop , NotFound} from './components/Elements';
import Navbar from './components/Navbar';


function AppWrapper() {
  const role = "org"; 

  return (
    <>
      <Toaster position='top-right' />
      <Navbar/>
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
      <div>
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App