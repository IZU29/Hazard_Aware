import React, { useState , useEffect} from 'react';
import { BrowserRouter, Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import axios from 'axios';

export default function App() {
  // const navigate = useNavigate();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
    
  //   if (token) {
  //     // Token found, send them to the IoT landing home dashboard
  //     navigate('/home');
  //   } else {
  //     // No token, redirect to login
  //     navigate('/login');
  //   }
  //   setCheckingAuth(false);
  // }, [navigate]);


  // if (loading) {
  //   return <div>Loading secure session...</div>; // Prevent flash of login screen
  // }
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Login Route: If already logged in, redirect straight to Home */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> :<Register setIsAuthenticated={setIsAuthenticated}/>} 
        />
        {/* 2. Protected Home Route: If NOT logged in, redirect straight to Login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} 
        />

        {/* 3. Catch-all: Redirect any random URL back to home/login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}