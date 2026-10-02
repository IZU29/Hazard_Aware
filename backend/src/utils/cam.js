// cam.js
const { handleIncomingFrame, saveHazardClip } = require('../services/surveillance');

const attachCameraWS = (server, io) => {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    // Ignore Socket.io engine requests
    if (url.pathname.startsWith('/socket.io/')) {
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws, request) => {
    // Extract location metadata from the ESP32-CAM request URL query params
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const locationId = urlParams.get('locationId') || 'default_location';
    const locationName = urlParams.get('locationName') || 'Main Surveillance';

    console.log(`📷 ESP32-CAM connected via WebSocket [${locationName} (${locationId})]`);

    ws.on('message', (data, isBinary) => {
      if (isBinary && io) {
        // Emit location-tagged video stream payload to Socket.io clients
        // 'volatile' prevents server memory overhead if a client network drops frames
        io.volatile.emit('video-frame', {
          locationId,
          locationName,
          frame: data
        });
      }
      
      handleIncomingFrame(data, { locationId, locationName });
    });

    ws.on('close', () => console.log(`📷 ESP32-CAM Disconnected [${locationId}]`));
    ws.on('error', (err) => console.error(`📷 ESP32-CAM WS Error [${locationId}]:`, err.message));
  });
};

module.exports = { attachCameraWS };