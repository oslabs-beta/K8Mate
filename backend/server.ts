const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const cors = require('cors');
const k8s = require('@kubernetes/client-node');
import { Request, Response, NextFunction } from 'express';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
// const mysql = require('mysql');

const alertRouter = require('./router/alertRouter.ts');
const clusterRouter = require('./router/clusterRouter.ts');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/alert', alertRouter);
app.use('/cluster', clusterRouter);

app.use((req: Request, res: Response) =>
    res.status(404).send("This is not the page you are looking for...")
  );

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
  
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});