// src/Dashboard/Systems.jsx
import React, { useState } from 'react';
import { Server, Activity, CheckCircle2, XCircle, RefreshCw, Cpu, Shield, Signal } from 'lucide-react';

// Hardcoded node list configured for active hardware deployment
const ACTIVE_HARDWARE_NODES = [
  {
    nodeId: 'NODE_02_ANNEX',
    name: 'Warehouse Section B',
    location: 'Warehouse // Section B',
    status: 'ONLINE',
    ipAddress: '10.10.10.212',
    lastHeartbeat: new Date().toISOString(),
    isPrimary: true,
  },
  {
    nodeId: 'NODE_ESP32_GATEWAY_01',
    name: 'Main Facility Entrance',
    location: 'Primary Gatehouse // Sector A',
    status: 'OFFLINE',
    ipAddress: '192.168.1.105',
    lastHeartbeat: new Date(Date.now() - 3600000).toISOString(),
    isPrimary: false,
  }
];

export const Systems = ({ activeNode, setActiveNode }) => {
  const [nodes] = useState(ACTIVE_HARDWARE_NODES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSimulatedRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            Active Systems & Hardware Nodes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor deployed ESP32 gateways and switch camera & alert focus across active system nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>ACTIVE: <strong className="text-cyan-400">{activeNode ? activeNode.nodeId : 'NONE'}</strong></span>
          </div>

          <button
            onClick={handleSimulatedRefresh}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {nodes.map((node) => {
          const isActive = activeNode?.nodeId === node.nodeId;
          const isOnline = node.status === 'ONLINE';

          return (
            <div
              key={node.nodeId}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/20 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    {node.nodeId}
                  </span>

                  <div className="flex items-center gap-2">
                    {node.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                        PRIMARY
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isOnline
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-950/80 text-red-400 border-red-500/30'
                      }`}
                    >
                      {isOnline ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {node.status}
                    </span>
                  </div>
                </div>

                {/* Node Identity */}
                <h3 className="text-lg font-bold text-slate-100">{node.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  {node.location}
                </p>

                {/* Hardware Spec Parameters */}
                <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>IP ADDRESS:</span>
                    <span className="text-slate-200 font-bold">{node.ipAddress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>LAST HEARTBEAT:</span>
                    <span className="text-slate-200">
                      {new Date(node.lastHeartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>STREAM PROTOCOL:</span>
                    <span className="text-emerald-400 font-semibold">WebSocket / MJPEG</span>
                  </div>
                </div>
              </div>

              {/* Action Switch Button */}
              <button
                disabled={!isOnline || isActive}
                onClick={() => setActiveNode && setActiveNode(node)}
                className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-default'
                    : isOnline
                    ? 'bg-slate-800 hover:bg-slate-950 hover:text-cyan-300 text-slate-200 border border-slate-700 active:scale-98'
                    : 'bg-slate-950 text-slate-600 border border-slate-800/50 cursor-not-allowed'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                {isActive ? 'ACTIVE FOCUS NODE' : isOnline ? 'SWITCH ACTIVE FOCUS' : 'NODE OFFLINE'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Systems;