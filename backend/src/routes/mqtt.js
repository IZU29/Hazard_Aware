const express =  require('express')
const router = express.Router()
const {connectBroker} = require('../controllers/mqtt')

router.route('/').get(connectBroker)


module.exports = router