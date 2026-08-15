// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  KeyRound, 
  Cctv, 
  Cpu, 
  Bell, 
  History, 
  FileText, 
  Settings, 
  LogOut, 
  Activity,
  X
} from 'lucide-react';

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

function getInitials(name) {
  if (!name) return 'US';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  // { id: 'hazards', label: 'Hazard Monitoring', icon: Flame },
  { id: 'access', label: 'Access Control', icon: KeyRound },
  { id: 'surveillance', label: 'Surveillance', icon: Cctv },
  // { id: 'devices', label: 'Devices & Sensors', icon: Cpu },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { id: 'history', label: 'Event History', icon: History },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose , onOpenNotifications}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    role: 'Operator',
    initials: 'US'
  });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:static top-16 bottom-0 left-0 z-50 w-64 bg-[#080c14] border-r border-[#1e293b] flex flex-col justify-between transform transition-transform duration-200 ease-in-out select-none h-[calc(100vh-4rem)] md:h-full flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Sub-header with Mobile Close Button */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#1e293b] bg-[#101726]/40">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold tracking-wider text-gray-300 uppercase font-mono">
                System Navigation
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-gray-100 md:hidden rounded hover:bg-[#101726]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
              if (onClose) onClose();
              
              // Trigger notification dropdown when Alerts is clicked
              if (item.id === 'alerts' && onOpenNotifications) {
                onOpenNotifications();
              }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm' 
                      : 'text-slate-400 hover:bg-[#101726] hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-red-950/80 text-red-400 border border-red-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#1e293b] space-y-3 bg-[#080c14]">
          <div className="p-2.5 rounded bg-[#101726] border border-[#1e293b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">SYSTEM ONLINE</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">24/26</span>
          </div>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase font-mono flex-shrink-0">
                {userProfile.initials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-gray-200 leading-none truncate">
                  {userProfile.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1 leading-none capitalize truncate">
                  {userProfile.role}
                </p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent hover:border-red-500/20 transition-colors flex-shrink-0"
              title="Logout System"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}