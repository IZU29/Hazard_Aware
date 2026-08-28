const express = require('express');
const router = express.Router();
const {Surveillance} = require('../controllers/surveillance')

// Fetch all saved event clips
router.route('/events').get(Surveillance)

module.exports = router;