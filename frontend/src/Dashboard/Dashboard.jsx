import React, { useState, useEffect } from 'react';

function Dashboard() {
  // State to hold our real-time hardware values
  const [systemState, setSystemState] = useState({
    timestamp: "Connecting...",
    temp: "--°C",
    flame: "Safe",
    gas: 0,
    lastCardId: "No Scan"
  });

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // 1. Establish connection to the Node.js SSE stream
    const eventSource = new EventSource('https://hazard-aware.onrender.com/api/stream' || 'https:localhost:5000/api/stream');

    // 2. Listen for incoming JSON packets
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSystemState(data);
        setIsOnline(true);
      } catch (error) {
        console.error("Error parsing stream data:", error);
      }
    };

    // 3. Handle connection errors (e.g., backend server goes down)
    eventSource.onerror = () => {
      setIsOnline(false);
      setSystemState((prev) => ({
        ...prev,
        timestamp: "Disconnected from API"
      }));
    };

    // 4. CLEANUP: If the user leaves this page, close the connection instantly
    return () => {
      eventSource.close();
    };
  }, []); // Empty dependency array means this runs exactly once on mount

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
            HARM-AWARE GATEWAY
          </h1>
          <p className="text-sm mt-1 text-slate-400">
            Pipeline Connection: {isOnline ? (
              <span className="text-emerald-400 font-mono">● LIVE</span>
            ) : (
              <span className="text-red-500 font-mono">○ OFFLINE</span>
            )}
            <span className="ml-4 text-xs text-slate-500">({systemState.timestamp})</span>
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Reader */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">RFID Access</h3>
            <p className="text-xl font-bold mt-2 text-slate-200">{systemState.lastCardId}</p>
          </div>

          {/* Temperature */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Temperature</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState.temp}</p>
          </div>

          {/* Gas Level */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Gas Level</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-blue-400">{systemState.gas}</p>
          </div>

        </div>

        {/* Reactive Flame Alert Banner */}
        <div className={`mt-6 p-6 rounded-xl border transition-all duration-300 ${
          systemState.flame === "ALARM" 
            ? "bg-red-950/40 border-red-500/50 text-red-200" 
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}>
          <h3 className="text-xs uppercase font-semibold tracking-wider">Flame Hazard Status</h3>
          <p className={`text-2xl font-black mt-2 ${
            systemState.flame === "ALARM" ? "text-red-500 animate-pulse" : "text-emerald-400"
          }`}>
            {systemState.flame}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;