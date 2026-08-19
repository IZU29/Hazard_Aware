const express =  require('express')
const {
  getAccessOverview,
  assignCard,
  revokeCard,
} = require('../controllers/access_controller')

const router = express.Router();

router.get('/overview', getAccessOverview);
router.post('/assign', assignCard);
router.delete('/revoke/:userId', revokeCard);

module.exports =  router;