import React, { useState , useEffect } from 'react';
import { Camera, AlertTriangle, ShieldCheck, PlayCircle, Eye, RefreshCw } from 'lucide-react';
import {io} from 'socket.io-client';


const socket = io('https://hazard-aware.onrender.com', {
path: '/socket.io/',
withCredentials: true,
transports: ['polling', 'websocket'], // Let polling perform handshake first
reconnectionAttempts: 10,
reconnectionDelay: 2000
});

export const Surveillance = () => {
  // ESP32-CAM Video Endpoint URL


 const [imageSrc, setImageSrc] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [activeClip, setActiveClip] = useState(null);
  const [recordedEvents, setRecordedEvents] = useState([]);

  const fetchSurveillanceEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://hazard-aware.onrender.com/api/surveillance/events');
      const data = await res.json();
      if (data.success) {
        setRecordedEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching recorded events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  // 1. Fetch initial event history from database
  fetchSurveillanceEvents();

  // 2. Handle incoming binary video frame buffers
  socket.on('video-frame', (buffer) => {
    const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer || buffer;
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    setImageSrc((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl); // Revoke previous URL to avoid memory leaks
      return url;
    });
    setIsLive(true);
  });

  // 3. Handle live status on disconnect
  socket.on('disconnect', () => {
    setIsLive(false);
  });

  // 4. Listen for newly processed Cloudinary event recordings in real time
  socket.on('NEW_SURVEILLANCE_EVENT', (newEvent) => {
    setRecordedEvents((prev) => [newEvent, ...prev]);
  });

  // Cleanup all listeners on unmount
  return () => {
    socket.off('video-frame');
    socket.off('disconnect');
    socket.off('NEW_SURVEILLANCE_EVENT');
  };
}, []);

  // Mock list of recorded hazard event clips from backend storage
  const recordedevents = [
    {
      id: "evt_001",
      title: "Flame Detected - Zone A",
      timestamp: "10:42:15 AM",
      type: "ALARM",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "evt_002",
      title: "High Gas Spike Alert",
      timestamp: "08:15:30 AM",
      type: "WARNING",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ];

  const handleStreamError = () => {
    setStreamError(true);
  };

  const handleRetryStream = () => {
    setStreamError(false);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Camera className="w-6 h-6 text-cyan-400" />
            </div>
            Live Hardware Surveillance & Recording
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time optical monitoring powered by ESP32-CAM gateway feed.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300">STREAM ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Live Feed & Video Playback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Camera Stream Container */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2">
              <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              Primary Camera Stream (ESP32-CAM)
            </span>
            <button 
              onClick={handleRetryStream}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconnect
            </button>
          </div>

          {/* Stream Render Viewport */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="ESP32 Live Stream"
                onError={handleStreamError}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                <p className="text-sm font-semibold text-slate-300">Live Video Feed Offline</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Unable to connect to ESP32-CAM stream. Check gateway power and local IP network.
                </p>
                <button
                  onClick={handleRetryStream}
                  className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all border border-slate-700"
                >
                  Retry Connection
                </button>
              </div>
            )}
            
            {/* Live Feed Overlay Badge */}
            {!streamError && (
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                MJPEG // 30 FPS
              </div>
            )}
          </div>
        </div>

        {/* Hazard Event Playback & Recording History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3 px-2 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              Recorded Event Replays
            </h3>

            {/* Video Player Modal/Slot for Event Clips */}
            {activeClip ? (
              <div className="mb-4 bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-2">
                <video controls autoPlay className="w-full rounded-lg aspect-video bg-black">
                  <source src={activeClip.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-slate-200">{activeClip.title}</span>
                  <button 
                    onClick={() => setActiveClip(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                  >
                    Close Replay
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl mb-4 bg-slate-950/50">
                <PlayCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Select a flagged hazard event below to review video recording.</p>
              </div>
            )}

            {/* Event List */}
            <div className="space-y-2">
              {recordedEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setActiveClip(evt)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeClip?.id === evt.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200">{evt.title}</p>
                    <p className="text-[10px] font-mono text-slate-500">{evt.timestamp}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    evt.type === 'ALARM' 
                      ? 'bg-red-950/80 text-red-400 border-red-500/30' 
                      : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                  }`}>
                    {evt.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Automated Cloud Event Storage Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};