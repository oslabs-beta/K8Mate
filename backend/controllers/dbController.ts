const fs = require('fs');
const path = require('path');

const db = require('../models/dbModel.ts')
import { Request, Response, NextFunction } from 'express';
import { dbcontroller } from '../../types.ts';

function updateEnvFile(key: string, value: string): void {
  const envFilePath = path.resolve(__dirname, '../../.env');
  let envContent = fs.readFileSync(envFilePath, 'utf8');

  // Update or add the key-value pair
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    // Update existing key
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    // Add new key
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`Updated ${key} in .env file.`);
}

const dbController: dbcontroller = { changeFile: ()=>{}, addTables: ()=>{} }

dbController.changeFile = (req: Request, res: Response, next: NextFunction) => {
  const { uri } = req.body;
  updateEnvFile('SUPABASE_URI', uri);
  db.updateConnectionString(uri);
  return next();
}

dbController.addTables = async (req: Request, res: Response, next: NextFunction) => { 
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

module.exports = dbController;