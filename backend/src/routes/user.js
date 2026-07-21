const express =  require('express')
const Router = express.Router()
const {login , Register} = require('../controllers/user')


Router.route('/login').post(login)
Router.route('/register').post(Register)


module.exports = Router