import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login' 
import Dashboard from './pages/Dashboard'
import AuthProtector from './pages/AuthProtector'
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AuthProtector> <Dashboard /></AuthProtector>} />
      </Routes>
    </>
  )
}

export default App