import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Key, UserCheck, Trash2, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://hazard-aware.onrender.com';

export default function AccessControl() {
  const [users, setUsers] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCardUID, setSelectedCardUID] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchAccessOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/access/overview`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching access overview:', err);
    }
  };

  useEffect(() => {
    fetchAccessOverview();

    // Connect socket for real-time card scans
    const socket = io(API_BASE_URL, { path: '/socket.io/' });

    socket.on('rfid_scan_received', (data) => {
      if (data.status === 'DENIED') {
        setPendingCards((prev) => {
          if (!prev.includes(data.cardUID)) {
            return [data.cardUID, ...prev];
          }
          return prev;
        });
      }
    });

    socket.on('access_updated', () => {
      fetchAccessOverview();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAssignCard = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedCardUID) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/access/assign`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          cardUID: selectedCardUID,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'Card linked successfully!' });
        setPendingCards((prev) => prev.filter((uid) => uid !== selectedCardUID));
        setSelectedCardUID('');
        setSelectedUser('');
        fetchAccessOverview();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.message || 'Failed to assign card.',
        });
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: 'Network error while assigning card.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeCard = async (userId) => {
    if (!window.confirm('Revoke access and clear card from NVS storage?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/access/revoke/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'Card revoked successfully!' });
        fetchAccessOverview();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.message || 'Failed to revoke card.',
        });
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: 'Network error while revoking card.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-[#101726] p-4 rounded-xl border border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-mono font-bold text-gray-100 uppercase tracking-wider">
              Access Control & NVS Sync
            </h1>
            <p className="text-xs text-slate-400">
              Manage RFID authorization cards and sync user credentials with ESP32 NVS flash storage.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAccessOverview}
          className="p-2 bg-[#080c14] hover:bg-[#1e293b] text-slate-400 hover:text-cyan-400 border border-[#1e293b] rounded-lg transition-colors flex items-center gap-2 text-xs font-mono"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-lg text-xs font-mono border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
              : 'bg-red-950/40 border-red-500/50 text-red-400'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Pending Queue + Assignment Form */}
        <div className="space-y-6 lg:col-span-1">
          {/* Unrecognized Cards Queue */}
          <div className="bg-[#101726] p-4 rounded-xl border border-[#1e293b] space-y-3">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Scanned Card Queue ({pendingCards.length})
            </h2>

            {pendingCards.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-[#080c14] p-3 rounded border border-[#1e293b]">
                No pending unrecognized cards. Swipe a card on the RFID hardware reader to populate.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 bg-[#080c14] p-3 rounded border border-[#1e293b]">
                {pendingCards.map((uid) => (
                  <button
                    key={uid}
                    type="button"
                    onClick={() => setSelectedCardUID(uid)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all flex items-center gap-2 ${
                      selectedCardUID === uid
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-400 shadow'
                        : 'bg-[#101726] border-[#1e293b] text-slate-300 hover:border-cyan-500/50'
                    }`}
                  >
                    <Key className="w-3 h-3 text-cyan-400" />
                    {uid}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Link Form */}
          <form
            onSubmit={handleAssignCard}
            className="bg-[#101726] p-4 rounded-xl border border-[#1e293b] space-y-4"
          >
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Link Card UID to Operator
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full bg-[#080c14] border border-[#1e293b] text-gray-200 text-xs rounded p-2.5 focus:border-cyan-500 outline-none"
                  required
                >
                  <option value="">-- Choose Operator --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role}) {u.cardUID ? `[Current: ${u.cardUID}]` : '[No Card]'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Card UID</label>
                <input
                  type="text"
                  placeholder="e.g. A1B2C3D4"
                  value={selectedCardUID}
                  onChange={(e) => setSelectedCardUID(e.target.value.toUpperCase())}
                  className="w-full bg-[#080c14] border border-[#1e293b] text-gray-200 text-xs font-mono rounded p-2.5 focus:border-cyan-500 outline-none uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedUser || !selectedCardUID}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono text-xs font-bold rounded transition-colors shadow"
            >
              {loading ? 'WRITING TO NVS...' : 'WRITE CARD TO NVS & DB'}
            </button>
          </form>
        </div>

        {/* Column 2: System Operators Table */}
        <div className="bg-[#101726] p-4 rounded-xl border border-[#1e293b] space-y-4 lg:col-span-2">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Registered System Users & Authorized Cards
          </h2>

          <div className="divide-y divide-[#1e293b] border border-[#1e293b] rounded-lg overflow-hidden bg-[#080c14]">
            {users.map((u) => (
              <div
                key={u._id}
                className="p-3.5 flex items-center justify-between hover:bg-[#101726]/50 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-gray-200 block">{u.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{u.role}</span>
                </div>

                <div className="flex items-center gap-3">
                  {u.cardUID ? (
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded">
                      {u.cardUID}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                      NO CARD ASSIGNED
                    </span>
                  )}

                  {u.cardUID && (
                    <button
                      type="button"
                      onClick={() => handleRevokeCard(u._id)}
                      disabled={loading}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-red-950/30"
                      title="Revoke Card & Clear from NVS"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}