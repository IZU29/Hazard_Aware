const { WebSocketServer } = require('ws');

/**
 * Attaches the ESP32-CAM WebSocket handler to the HTTP server.
 * @param {import('http').Server} server - The HTTP server instance
 * @param {import('socket.io').Server} io - The Socket.io instance for frontend streaming
 */
const attachCameraWS = (server, io) => {
    const wss = new WebSocketServer({ noServer: true });

    // Handle WebSocket upgrade request specifically for camera feed
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    // Handle incoming video frames from ESP32-CAM
    wss.on('connection', (ws) => {
        console.log('📷 ESP32-CAM connected via WebSocket');

        ws.on('message', (data, isBinary) => {
            if (isBinary && io) {
                // Relay raw JPEG binary to React UI via Socket.io
                io.emit('video-frame', data);
            }
        });

        ws.on('close', () => console.log('📷 ESP32-CAM Video Stream Disconnected'));
        ws.on('error', (err) => console.error('📷 ESP32-CAM WS Error:', err.message));
    });
};

module.exports = {attachCameraWS};