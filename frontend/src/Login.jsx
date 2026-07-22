import React, { useState } from 'react';
import {useNavigate , Link} from 'react-router-dom'
import axios from 'axios';


export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {e.preventDefault();
    try {
      const response = await axios.post('https://hazard-aware.onrender.com/user/login', { email, password });
      
      // 1. Extract the token from the JSON response body
      const { token, user } = response.data;
      console.log(response)
      // 2. Save it to local storage so it stays logged in when they refresh
      localStorage.setItem('token', token);
      setIsAuthenticated(true)
      // 3. Successfully redirect home!
      navigate('/home' , { replace: true });
      
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Sign In</h2>
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit & Grant Access</button>
        <div className="text-xs flex justify-evenly"><p className="">Dont have an account?</p><Link to='/register' className='text-[#007bff]'>Register now</Link></div>
      </form>
    </div>
  );
}

// Simple Inline Styles for testing
const styles = {
  container: { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  card: { padding: '40px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', width: '300px' },
  input: { margin: '10px 0', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};