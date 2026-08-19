require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');

// Route Imports
const UserRouter = require('./src/routes/user');
const MqttRouter = require('./src/routes/mqtt');
const authRoutes = require('./src/routes/auth');
const accessRouter = require('./src/routes/access_controller'); // 1. Access Route Import

// Database & Utilities
const ConnectDB = require('./src/db/connect');
const { Component } = require('./src/sim/components');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { attachCameraWS } = require('./src/utils/cam');
const { setupAccessSockets } = require('./src/sockets/accessSocket'); // 2. Socket Handler Import

// Create HTTP Server
const server = http.createServer(app);

// Allowed Origins Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hazard-aware.vercel.app'
];

// Shared CORS Origin Check Function
const checkOrigin = (origin, callback) => {
  if (!origin || origin === 'file://' || origin === 'null') {
    return callback(null, true);
  }

  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(origin) || allowedOrigins.includes(cleanOrigin)) {
    return callback(null, true);
  }

  console.warn(`Blocked by CORS: ${origin}`);
  return callback(null, false);
};

// 3. Socket.io Setup
const io = new Server(server, {
  path: '/socket.io/',
  cors: {
    origin: checkOrigin,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

// 4. Attach io to Express instance for controllers
app.set('io', io);

// 5. Initialize Access Socket Event Listeners
setupAccessSockets(io);

// Express Middleware
app.use(cors({
  origin: checkOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Express API Routes
app.use('/user', UserRouter);
app.use('/api/auth', authRoutes);
app.use('/api/stream', MqttRouter);
app.use('/api/access', accessRouter); // 6. Mounted Access API Route

// Camera WebSocket Attach
attachCameraWS(server, io);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  ConnectDB(process.env.MONGO_URI);
  console.log(`Server is listening on port ${PORT}`);
});