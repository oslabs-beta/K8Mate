const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const cors = require('cors');
const k8s = require('@kubernetes/client-node');
// const { Server } = require('http');
// const WebSocket = require('ws');
// const { WebSocketServer } = require('ws');
import { Request, Response, NextFunction } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { spawn } from 'node-pty';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
// const mysql = require('mysql');

const alertRouter = require('./router/alertRouter');
const clusterRouter = require('./router/clusterRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/alert', alertRouter);
app.use('/cluster', clusterRouter);

// app.get('/pods', async (req, res) => {
//   try {
//     const response = await k8sApi.listPodForAllNamespaces();
//     res.json(response.body);
//   } catch (err) {
//     res.status(500).send(err.message)
//   }
// })

//Terminal 
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  const shell = spawn('zsh', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env as NodeJS.ProcessEnv,
  });

  shell.onData((data: string) => {
    ws.send(data);
  });

  (ws as WebSocket).on('message', (msg: WebSocket) => {
    shell.write(msg.toString());
  });

  (ws as WebSocket).on('close', () => {
    shell.kill();
  });
});


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
  
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

server.on('upgrade', (request: any, socket: any, head: any) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});