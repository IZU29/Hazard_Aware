import React , {useState , useEffect} from 'react'
import axios from 'axios';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

const Register = ({ setIsAuthenticated }) => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [rfidCard , setRfidCard] = useState('')
 
useEffect(() => {
    const eventSource = new EventSource('https://hazard-aware.onrender.com/api/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Capture live unassigned card scan from ESP32 MQTT stream
        if (data.type === 'UNIDENTIFIED_RFID' || data.unidentifiedCardId) {
          const scannedUid = (data.cardId || data.unidentifiedCardId).trim().toUpperCase();
          setRfidCard(scannedUid);
          setError('');
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

const isCardPresent = Boolean(rfidCard && rfidCard.trim().length > 0);
const handleClearCard = () => {
    setRfidCard('');
  };
const handleRegister = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send credentials to backend
      console.log(rfidCard)
      const response = await axios.post('https://hazard-aware.onrender.com/user/register', {
        name: name,
        email: email,
        password: password,
        role: 'user',
        isVerified: false,
        accountStatus: 'active',
        cardUID: rfidCard
      });
      const { token, user } = response.data;
      console.log(response);
      // 2. If backend validates successfully, it will have sent a 'Set-Cookie' header.
      // Your browser automatically saves it. We just update the frontend state.
        localStorage.setItem('token', token);
        setIsAuthenticated(true); 
        navigate('/home' , { replace: true });

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
        <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-semibold uppercase text-slate-400">Assigned RFID Card UID</label>
          {isCardPresent && (
            <button
              type="button"
              onClick={handleClearCard}
              className="text-[10px] text-slate-500 hover:text-slate-300 underline"
            >
              Clear & Reswipe
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            name="rfidCard"
            value={rfidCard}
            readOnly
            placeholder="Swipe physical card on RFID reader..."
            className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 font-mono text-sm uppercase transition-all ${
              isCardPresent
                ? 'border-emerald-500/80 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'border-slate-700 text-slate-500'
            }`}
          />

          <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
            {isCardPresent ? (
              <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-400 text-xs px-2 py-0.5 rounded-md border border-emerald-500/30 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Card Captured
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-slate-800/80 text-slate-400 text-xs px-2 py-0.5 rounded-md border border-slate-700">
                <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                Waiting for Swipe...
              </span>
            )}
          </div>
        </div>
      </div>
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
