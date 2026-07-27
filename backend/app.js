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

// 1. Socket.io setup for Frontend Dashboard
const io = new Server(server, {
  cors: {
    origin: [
      'https://hazard-aware.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true
  }
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy check failed'));
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