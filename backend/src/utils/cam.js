const { WebSocketServer } = require('ws');

/**
 * Attaches the ESP32-CAM WebSocket handler to the HTTP server.
 * @param {import('http').Server} server 
 * @param {import('socket.io').Server} io 
 */
const attachCameraWS = (server, io) => {
  const wss = new WebSocketServer({ noServer: true });

  // Intercept raw HTTP upgrade requests safely
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    // Let Socket.io handle its own handshake paths!
    if (url.pathname.startsWith('/socket.io/')) {
      return; 
    }

    // Handle ESP32 camera websocket upgrades on root / or /camera
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log('📷 ESP32-CAM connected to WebSocket');

    ws.on('message', (data, isBinary) => {
      if (isBinary && io) {
        io.emit('video-frame', data);
      }
    });

    ws.on('close', () => console.log('📷 ESP32-CAM Disconnected'));
    ws.on('error', (err) => console.error('📷 ESP32-CAM WS Error:', err.message));
  });
};

module.exports = { attachCameraWS }