const express = require ('express');
const router = express.Router();

const alertController = require('../controllers/alertController')

router.post('/all',
  alertController.createAlert,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
)

module.exports = router;