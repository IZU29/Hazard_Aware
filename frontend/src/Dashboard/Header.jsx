// src/components/TopHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  Wifi, 
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Menu
} from 'lucide-react';

// Utility: Decodes base64 JWT payload natively without external dependencies
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

// Utility: Generates first two initials from the user name
function getInitials(name) {
  if (!name) return 'US';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function TopHeader({ onSearch, onMobileMenuToggle }) {
  const [site, setSite] = useState('North Campus - Zone A');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);

  // Synchronous User Profile State extracted directly from JWT payload
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    role: 'Operator',
    initials: 'US'
  });

  // Extract user claims immediately from localStorage JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        const name = payload.name || payload.username || 'User';
        const role = payload.role || 'Operator';
        setUserProfile({
          name,
          role,
          initials: getInitials(name)
        });
      }
    }
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulated live telemetry sync updating notification state
  useEffect(() => {
    const syncTimer = setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'warning',
          title: 'Temperature Threshold High',
          zone: 'Production Area',
          time: 'Just now'
        }
      ]);
      setHasUnread(true);
    }, 4000);

    return () => clearTimeout(syncTimer);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setHasUnread(false);
  };

  return (
    <header className="h-16 border-b border-[#1e293b] bg-[#080c14] px-4 md:px-6 flex items-center justify-between flex-shrink-0 w-full select-none z-30">
      
      {/* 1. LEFT: Mobile Toggle, Title & Site Selector */}
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={onMobileMenuToggle}
          className="p-1.5 text-slate-400 hover:text-gray-100 md:hidden rounded border border-[#1e293b] bg-[#101726]"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-xs md:text-sm font-bold tracking-wider text-gray-200 uppercase whitespace-nowrap">
          Overview
        </h2>

        <div className="hidden sm:block h-4 w-[1px] bg-[#1e293b]" />

        <div className="hidden sm:block relative">
          <button className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 bg-[#101726] border border-[#1e293b] rounded hover:border-slate-600 transition-colors text-xs text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline font-mono text-gray-400 text-[11px]">SITE:</span>
            <span className="font-medium text-gray-200 truncate max-w-[100px] md:max-w-[160px]">{site}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 2. CENTER: Global Search Bar */}
      <div className="flex-1 max-w-xs md:max-w-md mx-3 md:mx-6">
        <div className="relative">
          <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search alerts, devices..."
            className="w-full bg-[#101726] border border-[#1e293b] rounded pl-8 md:pl-9 pr-7 md:pr-8 py-1.5 text-xs text-gray-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
          />
          <button className="hidden md:block absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. RIGHT: Telemetry, Notifications & Instant JWT User Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Connection Status Telemetry Badge */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-[#101726] border border-[#1e293b] rounded text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold tracking-wider">SYSTEM ONLINE</span>
          </div>

          <span className="text-[#1e293b]">|</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-gray-100">24</strong>/26 CONNECTED</span>
          </div>

          <span className="text-[#1e293b]">|</span>

          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>SYNC: <strong className="text-gray-200">2s AGO</strong></span>
          </div>
        </div>

        {/* Notifications Icon Button */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setHasUnread(false);
            }}
            className="relative p-2 text-slate-400 hover:text-gray-100 hover:bg-[#101726] rounded border border-[#1e293b] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#101726] border border-[#1e293b] rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between bg-[#080c14]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">System Alerts</span>
                  {notifications.length > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 rounded border border-cyan-500/30">
                      {notifications.length}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                    <p className="text-xs font-medium text-gray-300">No new notifications</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">All monitoring zones functioning normally</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 mb-1 rounded bg-[#080c14] border border-[#1e293b] flex items-start gap-3 hover:border-slate-600 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-200 leading-none truncate">{item.title}</p>
                          <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">{item.zone}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-[#1e293b] bg-[#080c14] text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Live Pipeline Sync Active</span>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-[#1e293b]" />

        {/* INSTANT JWT USER PROFILE DISPLAY */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Dynamic Avatar with Initials */}
          <div className="relative">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase font-mono">
              {userProfile.initials}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 border-2 border-[#080c14] rounded-full"></span>
          </div>
          
          {/* Dynamic Name & Role */}
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-100 leading-none truncate max-w-[120px]">
                {userProfile.name}
              </span>
              <span className="text-[9px] font-mono uppercase bg-cyan-950/80 text-cyan-400 px-1 py-0.5 rounded border border-cyan-500/30">
                {userProfile.role}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none capitalize">
              {userProfile.role} Mode
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}