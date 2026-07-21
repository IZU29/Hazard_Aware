import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// CRITICAL: Tells Axios to send and receive cookies automatically
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = 'http://localhost:5000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
