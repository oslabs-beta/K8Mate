const express = require ('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const settingController = require('../controllers/settingController.ts');

import { Request, Response } from 'express';

// Route to get environment variables
router.get('/', 
  settingController.getEnv,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.envcontent)
  }
);

router.post('/save',
  settingController.changeFile,
  settingController.addTables,
  (req: Request, res: Response) => {
    return res.status(200);
  }
);

module.exports = router;