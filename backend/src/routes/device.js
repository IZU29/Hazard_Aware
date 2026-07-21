const express = require('express')
const Router = express.Router()
const {Device} = require('../controllers/device')


Router.route('/device').post(Device)

module.exports = Router