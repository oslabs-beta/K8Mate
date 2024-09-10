const express = require ('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const settingController = require('../controllers/settingController.ts');

import { Request, Response } from 'express';


type EnvVariables = {
  [key: string]: string;
};

// Helper function to get environment variables
function getEnvVariables(): EnvVariables {
  const envFilePath = path.resolve(__dirname, '../../.env');
  
  if (!fs.existsSync(envFilePath)) {
    console.log(`.env file not found at ${envFilePath}`);
    return {};
  }

  const envContent = fs.readFileSync(envFilePath, 'utf8');
  const envVariables: EnvVariables = {};

  envContent.split('\n').forEach((line: string) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      envVariables[key.trim()] = value ? value.trim() : '';
    }
  });

  return envVariables;
}

// Route to get environment variables
router.get('/', (req: Request, res: Response) => {
  try {
    const envVariables = getEnvVariables();
    res.status(200).json(envVariables);
  } catch (error) {
    console.error('Error reading .env file:', error);
    res.status(500).json({ error: 'Failed to read environment variables' });
  }
});

router.post('/save',
  settingController.changeFile,
  settingController.addTables,
  (req: Request, res: Response) => {
    return res.status(200).send('database successfully changed');
  }
)

module.exports = router;