import React , {useState} from 'react'
import axios from 'axios';


const Register = ({ setIsAuthenticated }) => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

const handleRegister = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send credentials to backend
      const response = await axios.post('/user/register', {
        name: name,
        email: email,
        password: password,
        role: 'user',
        isVerified: false
      });
      console.log("👉 FRONTEND BUTTON WAS SUCCESSFULLY CLICKED!");
      // 2. If backend validates successfully, it will have sent a 'Set-Cookie' header.
      // Your browser automatically saves it. We just update the frontend state.
      if (response.status === 200) {
        setIsAuthenticated(true); 
      }

    } catch (err) {
      // 3. Handle errors gracefully
      const serverMessage = err.response?.data?.message || 'Invalid email or password';
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Sign Up</h2>
        <input 
          type="text" 
          placeholder="username" 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          style={styles.input}
        />
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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          required 
          value={confirm} 
          onChange={e => setConfirm(e.target.value)} 
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit & Grant Access</button>
      </form>
    </div>
  
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  card: { padding: '40px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', width: '300px' },
  input: { margin: '10px 0', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default Register
