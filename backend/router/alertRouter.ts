const express = require ('express');
const router = express.Router();

const alertController = require('../controllers/alertController.ts')

import { Request, Response } from 'express';

//insert a new alert into database
router.post('/create',
  alertController.createAlert,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

//get an object of all alerts from database
router.get('/all',
  alertController.getAlert,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.alerts);
  }
);

//update an existing alerts status
router.put('/update',
  alertController.updateAlert,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

//delete an existing alert
router.delete('/delete',
  alertController.deleteAlert,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

module.exports = router;