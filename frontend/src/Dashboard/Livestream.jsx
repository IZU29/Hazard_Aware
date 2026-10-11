import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://hazard-aware.onrender.com' || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  path: '/socket.io/',
  withCredentials: true,
  transports: ['polling', 'websocket'],
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

const Livestream = ({ nodeId = 'NODE_01_GATEWAY', locationName = 'Gateway' }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsLive(true);
    });

    socket.on('video-frame', (data) => {
      const frameNodeId = data?.locationId || 'NODE_01_GATEWAY';

      // Filter frames to only render if the incoming stream matches this card's nodeId
      if (frameNodeId === nodeId) {
        const frameBuffer = data?.frame || data;
        const arrayBuffer = frameBuffer instanceof ArrayBuffer ? frameBuffer : frameBuffer.buffer || frameBuffer;
        
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);

        setImageSrc((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return url;
        });
        setIsLive(true);
      }
    });

    socket.on('disconnect', () => {
      setIsLive(false);
    });

    return () => {
      socket.off('video-frame');
      socket.off('disconnect');
    };
  }, [nodeId]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl shadow-xl w-full text-white">
      {/* Card Header */}
      <div className="flex items-center justify-between w-full mb-2 px-1">
        <h2 className="text-xs font-semibold font-mono tracking-wide text-slate-300">
          Camera Feed // {locationName}
        </h2>
        <div className="flex items-center space-x-1.5">
          <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-[10px] font-mono text-slate-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`ESP32 Live Stream ${nodeId}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-400 text-sm">Waiting for {nodeId} stream...</p>
            <p className="text-gray-600 text-[10px] mt-1">Ensure the camera module is powered on</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Livestream;