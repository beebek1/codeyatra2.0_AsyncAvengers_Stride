import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import QuizPage from './pages/Quizpage';
import { ScrollToTop , NotFound} from './components/Elements';
import CareersPage from './pages/Career';


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
           <Route path="/career" element={<CareersPage/>} />

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