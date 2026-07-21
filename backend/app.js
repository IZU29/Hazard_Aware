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


app.use(express.json())
app.use(cookieParser())
app.use(cors({
  // 1. Explicitly allow your frontend local port
  origin: '*', 
  
  // 2. Crucial for allowing cookies to be sent and received
  credentials: true, 
  
  // 3. Optional: Specify allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/user', UserRouter)
app.use('/api/auth', authRoutes);
app.use('/api/stream' , MqttRouter)

// setInterval(Component , 1000)
app.listen(5000 ,'0.0.0.0',() => {
    ConnectDB(process.env.MONGO_URI)
    console.log(`Server is listening on port ${5000}`)
})