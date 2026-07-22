import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = 'https://api.yourdomain.com';

export default function Home({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  }, [navigate, setIsAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Dashboard />
    </div>
  );
}
