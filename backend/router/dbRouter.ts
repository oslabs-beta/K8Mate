const express = require ('express');

const router = express.Router();
const dbController = require('../controllers/dbController.ts');

import { Request, Response } from 'express';

router.post('/input',
  dbController.changeFile,
  dbController.addTables,
  (req: Request, res: Response) => {
    return res.status(200).send('database successfully changed');
  }
)

module.exports = router;