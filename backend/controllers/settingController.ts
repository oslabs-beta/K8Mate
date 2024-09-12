const fs = require('fs');
const path = require('path');

const db = require('../models/dbModel.ts')
import { Request, Response, NextFunction } from 'express';
import { settingcontroller } from '../../types.ts';

type EnvVariables = { [key: string]: string; };

// Helper functions
function updateEnvFile(key: string, value: string): void {
  const envFilePath = path.resolve(__dirname, '../../.env');
  let envContent = fs.readFileSync(envFilePath, 'utf8');

  // Update or add the key-value pair
  const regex = new RegExp(`^${key}=.*`, 'm');

  // Update existing key or add new key
  if (regex.test(envContent))
    envContent = envContent.replace(regex, `${key}=${value}`);
  else { envContent += `\n${key}=${value}`; }

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`Updated ${key} in .env file.`);
}


// Controllers

//change env files based on filled in settings components
const settingController: settingcontroller = { changeFile: ()=>{}, getEnv: ()=>{}, addTables: ()=>{} }

settingController.changeFile = (req: Request, res: Response, next: NextFunction) => {
  const { timezone, uri } = req.body;
  updateEnvFile('SUPABASE_URI', uri);
  updateEnvFile('timezone', timezone);
  db.updateConnectionString(uri);
  return next();
}

//get the env files variables
settingController.getEnv = (req: Request, res: Response, next: NextFunction) => {
  try {
    const envFilePath = path.resolve(__dirname, '../../.env');
    if (!fs.existsSync(envFilePath)) { throw new Error (`.env file not found at ${envFilePath}`); }

    const envContent = fs.readFileSync(envFilePath, 'utf8');
    const envVariables: EnvVariables = {};

    envContent.split('\n').forEach((line: string) => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        envVariables[key.trim()] = value ? value.trim() : '';
      }
    });
    
    res.locals.envcontent = envVariables;
    return next();
  } catch (err) { return next(err); }
}

//check if database has necessary tables => if not, create the tables
settingController.addTables = async (req: Request, res: Response, next: NextFunction) => { 
  console.log('inside add tables');
  try { await db.query('SELECT 1 FROM alerts LIMIT 1'); } 
  catch (err) {
    try {
      await db.query(`CREATE TABLE alerts (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category VARCHAR(255) NOT NULL, node_id VARCHAR(255), node_name VARCHAR(255), log TEXT UNIQUE, read VARCHAR(255) DEFAULT 'unread');`);
    } 
    catch(err) { return next(err); }

    console.log('created alerts table');
  }

  try { await db.query('SELECT 1 FROM cluster LIMIT 1'); } 
  catch (err) {
    try {
      await db.query(`CREATE TABLE cluster (id SERIAL PRIMARY KEY, category VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL,
      uid VARCHAR(255) NOT NULL UNIQUE, created_at VARCHAR(255) NOT NULL, data JSON NOT NULL);`);
    } 
    catch(err) { return next(err); }
    
    console.log('created cluster table');
  }

  try { await db.query('SELECT 1 FROM clusters LIMIT 1'); } 
  catch (err) {
    try {
      await db.query(`CREATE TABLE clusters (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, data JSON NOT NULL);`);
    } 
    catch(err) { return next(err); }

    console.log('created clusters table');
  }

  console.log('exiting');
  return next();
}

module.exports = settingController;