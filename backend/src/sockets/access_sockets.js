const User = require('../models/User.js');

const setupAccessSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Device connected: ${socket.id}`);

    // Listener for RFID Scans sent from ESP32
    socket.on('rfid_scan_event', (data) => {
      console.log(`[RFID SCAN] UID: ${data.cardUID} | Status: ${data.status}`);

      // Broadcast scan event to all connected dashboard clients
      io.emit('rfid_scan_received', {
        cardUID: data.cardUID,
        status: data.status,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    });

    // ESP32 requests full NVS sync list on reboot
    socket.on('request_nvs_sync', async () => {
      try {
        const users = await User.find({ cardUID: { $ne: null } }).select('cardUID');
        const activeCards = users.map((u) => u.cardUID);

        socket.emit('nvs_sync_response', {
          authorizedCards: activeCards,
        });
      } catch (error) {
        console.error('[Socket Error] NVS Sync failed:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Device disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupAccessSockets };