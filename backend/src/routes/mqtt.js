const express =  require('express')
const router = express.Router()
const {connectBroker , manageRfidCard} = require('../controllers/mqtt')

router.route('/').get(connectBroker)
router.route('/rfid').post(manageRfidCard);

module.exports = router