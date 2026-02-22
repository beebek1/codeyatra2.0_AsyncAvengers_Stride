import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
import QuizPage from './pages/Quizpage';

function App() {

  return (
   <Router>
      <Toaster/>

      <Routes>
           
           <Route path="/login" element={<Login/>} />   
           <Route path="/" element={<Register/>} />
           <Route path="/quiz" element={<QuizPage/>} />   

      </Routes>

    </Router>
  )
}

export default App