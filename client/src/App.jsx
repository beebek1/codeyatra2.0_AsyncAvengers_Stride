import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { ScrollToTop, NotFound } from './components/Elements';


function AppWrapper() {
  const role = "org"; 

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        
        {/* --- AUTH ROUTES (No Navbar/Footer) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

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