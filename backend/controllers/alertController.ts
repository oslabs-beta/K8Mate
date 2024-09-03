const db = require("../models/dbModel");
import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
import { alert } from '../../types.ts';

const alertController: alert = {createAlert: ()=>{}, getAlert: ()=>{}, updateAlert: ()=>{}, deleteAlert: ()=>{}};

//global async query function that takes in the query string and corresponding values
async function alertQuery(qstring: string, values?: (string | number)[]): Promise<QueryResult>{
  const result = await db.query(qstring, values);
  return result;
}

//create alert
alertController.createAlert = (req: Request, res: Response, next: NextFunction) => {
  //necessary components to be inserted into new alert row
  const {id, name, log, category} = req.body;

  const qstring = `INSERT INTO alerts (category, node_id, node_name, log)
                  VALUES ($1, $2, $3, $4)`;
  const values: string[] = [category, id, name, log];
  
  alertQuery(qstring, values)
    .then((data) => {
      console.log('went through');
      res.locals.alert = data;
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    });
}

//get all existing alerts
alertController.getAlert = (req: Request, res: Response, next: NextFunction) => {
  const qstring = `SELECT * FROM alerts`;

  alertQuery(qstring)
    .then((data) => {
      res.locals.alerts = data.rows; //all data is stored in the 'row' key
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    })
}

//update a single alert
alertController.updateAlert = (req: Request, res: Response, next: NextFunction) => {
  //components to find specific alert
  const {name, status, db_id} = req.body;

  const qstring = `UPDATE alerts SET read = $2 WHERE (node_name = $1 AND id = $3)`;
  const values: string[] = [name, status, db_id]

  alertQuery(qstring, values)
    .then((data) => {
      res.locals.alert = data;
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    })
}

alertController.deleteAlert = (req: Request, res: Response, next: NextFunction) => {
  //components to find specific alert
  const {id, log} = req.body;
  
  const qstring = `DELETE FROM alerts WHERE (id = $1 AND log = $2)`;
  const values: string[] = [id, log]

  alertQuery(qstring, values)
    .then((data) => {
      res.locals.alert = data;
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    })
}
module.exports = alertController;