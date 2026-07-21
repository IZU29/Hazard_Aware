require('dotenv').config()
const cors = require('cors')
const express = require("express")
const app = express()
const UserRouter = require('./src/routes/user')
const MqttRouter = require('./src/routes/mqtt')
const ConnectDB =  require('./src/db/connect')
const { Component } = require('./src/sim/components')
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/auth')





const allowedOrigins = [
  'https://hazard-aware.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy check failed'));
    }
  },
  credentials: true, // Required for cookies / withCredentials requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser())

app.use('/user', UserRouter)
app.use('/api/auth', authRoutes);
app.use('/api/stream' , MqttRouter)

// setInterval(Component , 1000)
app.listen(5000 ,'0.0.0.0',() => {
    ConnectDB(process.env.MONGO_URI)
    console.log(`Server is listening on port ${5000}`)
})