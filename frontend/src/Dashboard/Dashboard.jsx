// src/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import SideBar from './SideBar';
import SignalOverview from './Signal_overview';
import AccessControl from './Access_control';
import { Surveillance } from './Surveillance';

export default function Dashboard({handleAuthorizeCard , loggedUser}) {
  const [systemState, setSystemState] = useState({
    timestamp: "Connecting...",
    temp: "--°C",
    flame: "Safe",
    gas: 0,
    smoke: 0,
    lastCardId: "No Scan",
    unidentifiedCardId: null,
    hazardState: "None",
    confidence: 0
  });

  const [isOnline, setIsOnline] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const API_BASE_URL = 'https://hazard-aware.onrender.com';

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSystemState(data);
        setIsOnline(true);
      } catch (error) {
        console.error("Error parsing stream data:", error);
      }
    };

    eventSource.onerror = () => {
      setIsOnline(false);
      setSystemState((prev) => ({
        ...prev,
        timestamp: "Disconnected from API"
      }));
    };

    return () => {
      eventSource.close();
    };
  }, []);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <Header
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isNotificationOpen={isNotificationOpen}
        onToggleNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
        onCloseNotifications={() => setIsNotificationOpen(false)}
      />

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <SideBar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#080c14]">
          <Routes>
            {/* Render SignalOverview directly on /dashboard root */}
            <Route
              index
              element={
                <SignalOverview
                  systemState={systemState}
                  isOnline={isOnline}
                  handleAuthorizeCard={handleAuthorizeCard}
                  loggedUser = {loggedUser}
                />
              }
            />
            {/* Direct match for /dashboard/signals */}
            <Route
              path="signals"
              element={
                <SignalOverview
                  systemState={systemState}
                  isOnline={isOnline}
                  handleAuthorizeCard={handleAuthorizeCard}
                />
              }
            />
            {/* Direct match for /dashboard/access-control */}
            <Route path="access-control" element={<AccessControl />} />
            <Route path="surveillance" element={<Surveillance />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}