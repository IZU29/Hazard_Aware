import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client';

// Points to your Express/Socket.io server
const BACKEND_URL = 'https://hazard-aware.onrender.com' || 'https:localhost:5000';

const socket = io('https://hazard-aware.onrender.com', {
  path: '/socket.io/',
  withCredentials: true,
  transports: ['polling', 'websocket'], // Let polling perform handshake first
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
});

const LiveStream = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Listen for binary video frames sent from backend via Socket.io
    
    socket.on('video-frame', (buffer) => {
      const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer || buffer;
      // Convert raw binary ArrayBuffer to a browser image Blob
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      setImageSrc((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl); // Revoke previous URL to prevent memory leaks
        return url;
      });
      setIsLive(true);
    });

    socket.on('disconnect', () => {
      setIsLive(false);
    });

    return () => {
      socket.off('video-frame');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-2xl shadow-xl max-w-lg mx-auto text-white">
      {/* Card Header */}
      <div className="flex items-center justify-between w-full mb-3 px-2">
        <h2 className="text-lg font-semibold tracking-wide">Live Camera Feed</h2>
        
        <div className="flex items-center space-x-2">
          <span className={`h-3 w-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="ESP32 Live Stream"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-400 text-sm">Waiting for ESP32 stream...</p>
            <p className="text-xs text-gray-600 mt-1">Ensure the camera module is powered on</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStream;