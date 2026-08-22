import React, { useState , useEffect} from 'react';
import { BrowserRouter, Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import axios from 'axios';
import Dashboard from './Dashboard/Dashboard';

export default function App() {
  // const navigate = useNavigate();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true);
 const [loggedUser, setLoggedUser] = useState('');

 const handleAuthorizeCard = async (cardId) => {
    try {
      const response = await fetch(`https://hazard-aware.onrender.com/api/stream/rfid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "ADD_CARD", cardId })
      });
      const resData = await response.json();
      if (resData.success) {
        alert(`Card ${cardId} authorized successfully!`);
        setSystemState(prev => ({ ...prev, unidentifiedCardId: null }));
      }
    } catch (err) {
      console.error("Failed to authorize card:", err);
    }
  };

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
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> :<Register setIsAuthenticated={setIsAuthenticated} handleAuthorizeCard={handleAuthorizeCard} setloggedUser = {setLoggedUser}/>} 
        />
        {/* 2. Protected Home Route: If NOT logged in, redirect straight to Login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} 
        />
      <Route path="/dashboard/*" element={<Dashboard handleAuthorizeCard={handleAuthorizeCard} loggedUser = {loggedUser}/>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}