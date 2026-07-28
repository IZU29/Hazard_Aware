require('dotenv').config()
const cors = require('cors')
const express = require("express")
const app = express()
const http = require('http');
const UserRouter = require('./src/routes/user')
const MqttRouter = require('./src/routes/mqtt')
const ConnectDB =  require('./src/db/connect')
const { Component } = require('./src/sim/components')
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/auth')
const { WebSocketServer } = require('ws');
const { Server } = require('socket.io');
const {attachCameraWS} = require('./src/utils/cam')

// Create HTTP server instance wrapped around Express
const server = http.createServer(app);

// app.js
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hazard-aware.vercel.app' // Live Vercel Frontend
];

// 2. Shared Origin Check Function
const checkOrigin = (origin, callback) => {
  // Allow non-browser agents (ESP32), disk files (file://), or null origins
  if (!origin || origin === 'file://' || origin === 'null') {
    return callback(null, true);
  }

  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(origin) || allowedOrigins.includes(cleanOrigin)) {
    return callback(null, true);
  }

  console.warn(`Blocked by CORS: ${origin}`);
  // Pass 'false' instead of throwing an Error to avoid unhandled express crashes
  return callback(null, false);
};

// 3. Socket.io Setup for Frontend Dashboard & ESP32 WebSockets
const io = new Server(server, {
  path: '/socket.io/',
  cors: {
    origin: checkOrigin,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

// 4. Express HTTP CORS Middleware
app.use(cors({
  origin: checkOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())
app.use(cookieParser())

app.use('/user', UserRouter)
app.use('/api/auth', authRoutes);
app.use('/api/stream' , MqttRouter)

// Attach WebSocket module
attachCameraWS(server, io);


// setInterval(Component , 1000)
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  ConnectDB(process.env.MONGO_URI);
  console.log(`Server is listening on port ${PORT}`);
});