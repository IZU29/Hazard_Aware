import React, { useState, useEffect } from 'react';
import LiveStream from './Livestream';
import Header from './Header';
import Sidebar from './SideBar';
function Dashboard() {
  // State to hold our real-time hardware values
  const [systemState, setSystemState] = useState({
    timestamp: "Connecting...",
    temp: "--°C",
    flame: "Safe",
    gas: 0,
    lastCardId: "No Scan",
    hazardState: "None",
    confidence : 0
  });

  const [isOnline, setIsOnline] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
  const handleCloseNotifications = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <Header 
      onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      isNotificationOpen={isNotificationOpen}
      onToggleNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
      onCloseNotifications={handleCloseNotifications}
      />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        />
        {/* Header */}
        <div className=" w-full p-4">
        {/* <header className="mb-8 border-b border-slate-800 pb-4">
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
        </header> */}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Reader */}
          <div className="bg-[#101726] border border-[#1e293b] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">RFID Access</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState.lastCardId}</p>
          </div>

          {/* Temperature */}
          <div className="bg-[#101726] border border-[#1e293b] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Temperature</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState.temp}</p>
          </div>

          {/* Gas Level */}
          <div className="bg-[#101726] border border-[#1e293b] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Gas Level</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState.gas}</p>
          </div>
            {/*AI confidence*/}
          <div className="bg-[#101726] border border-[#1e293b] p-5 rounded-lg shadow-sm">
            <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Hazard Confidence</h3>
            <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState.hazardState} : {systemState.confidence}</p>
          </div>
          
          <div className={`p-6 rounded-xl border transition-all duration-300 ${
          systemState.flame === "ALARM" 
            ? "bg-red-950/40 border-red-500/50 text-red-200" 
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}>
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Flame Hazard Status</h3>
          <p className={`text-2xl font-black mt-2 ${
            systemState.flame === "ALARM" ? "text-red-500 animate-pulse" : "text-emerald-400"
          }`}>
            {systemState.flame}
          </p>
        </div>
        <div className="">
             <LiveStream />
          </div>
        </div>

        {/* Reactive Flame Alert Banner */}
        
          
      </div>
      </div>
    </div>
  );
}

export default Dashboard;