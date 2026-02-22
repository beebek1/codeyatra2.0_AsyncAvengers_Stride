import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import './App.css'

function App() {

  return (
   <Router>
      <Toaster/>

      <Routes>
           
           <Route path="/login" element={<Login/>} />   

      </Routes>

    </Router>
  )
}

export default App