const express = require ('express');
const router = express.Router();

const alertController = require('../controllers/alertController')

router.post('/create',
  alertController.createAlert,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
)

router.get('/all',
  alertController.getAlert,
  (req, res) => {
    return res.status(200).json(res.locals.alerts);
  }
)

module.exports = router;