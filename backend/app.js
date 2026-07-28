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
  'https://your-harm-aware-dashboard.vercel.app' // Add your deployed frontend URL here
];

const checkOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // Allow non-browser requests (ESP32)
  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(origin) || allowedOrigins.includes(cleanOrigin)) {
    return callback(null, origin);
  }
  return callback(new Error('CORS policy check failed'));
};

const io = new Server(server, {
  path: '/socket.io/',
  cors: {
    origin: checkOrigin,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});
// 1. Socket.io setup for Frontend Dashboard
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or ESP32)
    if (!origin) return callback(null, true);
    
    // Normalize trailing slashes just in case
    const cleanOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      // Return false instead of throwing a hard Error to prevent unhandled express crashes
      return callback(null, false); 
    }
  },
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

app.listen(PORT ,'0.0.0.0',() => {
    ConnectDB(process.env.MONGO_URI)
    console.log(`Server is listening on port ${5000}`)
})