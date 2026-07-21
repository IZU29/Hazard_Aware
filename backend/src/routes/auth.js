const express = require('express');
const router = express.Router();
const {refresh} = require('../controllers/verify_cookie')

router.post('/refresh', refresh)

module.exports = router