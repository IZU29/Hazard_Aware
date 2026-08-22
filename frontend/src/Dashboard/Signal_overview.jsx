import React from 'react';
import Livestream from './Livestream';

export default function SignalOverview({ systemState, isOnline, handleAuthorizeCard, loggedUser}) {
  return (
    <div className="w-full p-6 overflow-y-auto">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
          HARM-AWARE GATEWAY
        </h1>
        <p className="text-sm mt-1 text-slate-400">
          Pipeline Connection: {isOnline ? (
            <span className="text-emerald-400 font-mono">LIVE</span>
          ) : (
            <span className="text-red-500 font-mono">OFFLINE</span>
          )}
          <span className="ml-2 text-xs text-slate-500">({systemState?.timestamp})</span>
        </p>
      </header>

      {/* Unidentified Card Prompt Banner */}
      {systemState?.unidentifiedCardId && (
        <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-lg flex items-center justify-between">
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
          <p className="text-4xl font-mono font-extrabold mt-2 text-cyan-400">{loggedUser.cardUID}</p>
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
        <div className="md:col-span-3">
          <Livestream />
        </div>
      </div>
    </div>
  );
}