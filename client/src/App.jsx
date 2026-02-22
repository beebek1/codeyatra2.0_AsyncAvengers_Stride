import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
<<<<<<< bisesh
import QuizPage from './pages/Quizpage';
import { ScrollToTop , NotFound} from './components/Elements';
import Schedule from './pages/Schedule';
import Kanban from './components/Kanban';

=======
import QuizPage from './pages/Quizpage'; 
import Account from './pages/Account';
>>>>>>> main

// Components
import { ScrollToTop, NotFound } from './components/Elements';
import Footer from './components/Footer';

function AppWrapper() {
  const role = "org"; 

  return (
    // Added flex flex-col and min-h-screen to push the footer to the bottom
    <div className="flex flex-col min-h-screen w-full">
      <Toaster position='top-right' />
<<<<<<< bisesh
      <Routes>
           
           <Route path="/login" element={<Login/>} />   
           <Route path="/" element={<Register/>} />
           <Route path="/quiz" element={<QuizPage/>} />   
           <Route path="/" element={<Register/>} />   
           <Route path="/dashboard" element={<Dashboard/>} />
           <Route path="/forgot-password" element={<ForgotPassword/>} />
           <Route path="/schedule" element={<Schedule/>} />
           <Route path="/kanban" element={<Kanban/>} />

        {/* fallout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
=======
      
      {/* flex-grow ensures the routing area takes up all available space, pushing the footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Register/>} />
          <Route path="/login" element={<Login/>} />   
          <Route path="/quiz" element={<QuizPage/>} />   
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/account" element={<Account />} />

          {/* fallout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer appears on every page */}
      <Footer />
    </div>
>>>>>>> main
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Removed bg-[#080808] from here so your individual pages (like the white Quiz page) can dictate their own background colors without conflict */}
      <div className="min-h-screen font-sans text-gray-900">
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App;