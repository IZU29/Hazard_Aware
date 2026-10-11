import React from 'react';
import Livestream from './Livestream';
import { useAuth } from '../AuthContext';

function SystemInitialize({ systemState, isOnline, handleAuthorizeCard, loggedUser, nodeId }) {
  const { user } = useAuth();

  return (
    <div className="w-full mb-8 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-sm font-mono font-bold text-cyan-400 tracking-wider">
          SYSTEM NODE // {nodeId}
        </h2>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
          {isOnline ? 'ONLINE' : 'DISCONNECTED'}
        </span>
      </div>

      {/* Unidentified Card Prompt Banner */}
      {systemState?.unidentifiedCardId && (
        <div className="mb-4 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-300">Unidentified RFID Card Detected</p>
            <p className="text-sm text-slate-300">
              Card ID: <code className="font-mono bg-slate-800 px-2 py-0.5 rounded">{systemState.unidentifiedCardId}</code>
            </p>
          </div>
          <button
            onClick={() => handleAuthorizeCard(systemState.unidentifiedCardId)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md transition-colors"
          >
            Authorize Card
          </button>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Reader */}
        <div className="bg-[#010726] border border-[#01e293] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">RFID Access</h3>
          <p className="text-4xl font-mono font-extrabold mt-2 text-cyan-400">{user?.cardDetails || systemState?.lastCardId}</p>
        </div>

        {/* Temperature */}
        <div className="bg-[#010726] border border-[#01e293] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Temperature</h3>
          <p className="text-3xl font-mono font-extrabold mt-2 text-cyan-400">{systemState?.temp}</p>
        </div>

        {/* Gas Level */}
        <div className="bg-[#010726] border border-[#01e293] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Gas Level</h3>
          <p className="text-4xl font-mono font-extrabold mt-2 text-cyan-400">{systemState?.gas}</p>
        </div>

        {/* Smoke Level */}
        <div className="bg-[#010726] border border-[#01e293] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Smoke Level</h3>
          <p className="text-4xl font-mono font-extrabold mt-2 text-cyan-400">{systemState?.smoke}</p>
        </div>

        {/* AI Confidence */}
        <div className="bg-[#010726] border border-[#01e293] p-5 rounded-lg shadow-sm">
          <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider font-mono">Hazard Confidence</h3>
          <p className="text-2xl font-mono font-extrabold mt-2 text-cyan-400">
            {systemState?.hazardState}: {systemState?.confidence}%
          </p>
        </div>

        {/* Flame Hazard Status */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${
          systemState?.flame === "ALARM"
            ? "bg-red-950/40 border-red-500/50 text-red-200"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}>
          <h3 className="text-xs uppercase font-semibold tracking-wider font-mono">Flame Hazard Status</h3>
          <p className={`text-2xl font-black mt-2 ${
            systemState?.flame === "ALARM" ? "text-red-500 animate-pulse" : "text-emerald-400"
          }`}>
            {systemState?.flame}
          </p>
        </div>

        {/* Camera Stream Component */}
        <div className="col-span-1 md:col-span-3">
          <Livestream 
            nodeId={nodeId} 
            locationName={nodeId === 'NODE_01_GATEWAY' ? 'Main Facility Entrance' : 'Warehouse Section B'} 
          />
        </div>
      </div>
    </div>
  );
}

export default function SignalOverview({ systemState, newSystem, isOnline, handleAuthorizeCard, loggedUser }) {
  return (
    <div className="w-full p-6 overflow-y-auto">
      <h1 className="text-xl font-bold font-mono text-white mb-6">Multi-Node Telemetry & Surveillance</h1>
      
      {/* System 1: Gateway */}
      <SystemInitialize
        systemState={systemState}
        isOnline={isOnline}
        handleAuthorizeCard={handleAuthorizeCard}
        loggedUser={loggedUser}
        nodeId="NODE_01_GATEWAY"
      />

      {/* System 2: Annex */}
      <SystemInitialize
        systemState={newSystem}
        isOnline={isOnline}
        handleAuthorizeCard={handleAuthorizeCard}
        loggedUser={loggedUser}
        nodeId="NODE_02_ANNEX"
      />
    </div>
  );
}