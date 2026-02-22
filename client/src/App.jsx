import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import './App.css'

function App() {

  return (
   <Router>
      <Toaster/>

      <Routes>
           
           <Route path="/" element={<Register/>} />   

      </Routes>

    </Router>
  )
}

export default App
