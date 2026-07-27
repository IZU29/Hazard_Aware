const { WebSocketServer } = require('ws');

/**
 * Attaches the ESP32-CAM WebSocket handler to the HTTP server.
 * @param {import('http').Server} server 
 * @param {import('socket.io').Server} io 
 */
const attachCameraWS = (server, io) => {
    // Create WebSocket server without attaching directly to HTTP port yet
    const wss = new WebSocketServer({ noServer: true });

    // Strictly filter upgrade events so Socket.io routes can pass through!
    server.on('upgrade', (request, socket, head) => {
        const { pathname } = new URL(request.url, `http://${request.headers.host}`);

        // Do NOT intercept Socket.io requests (they start with /socket.io/)
        if (pathname.startsWith('/socket.io/')) {
            return; // Allow Socket.io's built-in upgrade handler to handle this
        }

        // Handle raw WebSocket requests (ESP32-CAM connects to / or /camera)
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws) => {
        console.log('📷 ESP32-CAM connected via WebSocket');

        ws.on('message', (data, isBinary) => {
            if (isBinary && io) {
                // Relays binary frame to React UI
                io.emit('video-frame', data);
            }
        });

        ws.on('close', () => console.log('📷 ESP32-CAM Disconnected'));
        ws.on('error', (err) => console.error('📷 ESP32-CAM WS Error:', err.message));
    });
};

module.exports = { attachCameraWS };