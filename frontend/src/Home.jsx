import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = 'https://api.yourdomain.com';

export default function Home({ setIsAuthenticated }) {
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [checkingAuth , setCheckingAuth] = useState('false')
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        // Token found, send them to the IoT landing home dashboard
        if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
        navigate('/home');
      }
      } else {
        // No token, redirect to login
        if (currentPath === '/home' || currentPath === '/') {
        navigate('/login');
      }
      }
      setCheckingAuth(false);
    }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Destroy session
    setIsAuthenticated(false); // Triggers React Router to kick them back to /login
  };

  return (
    <div style={{ padding: '40px', textAlignment: 'center' }}>
      <Dashboard />
    </div>
  );
}