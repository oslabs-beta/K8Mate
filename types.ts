import { RequestHandler } from 'express';

export type alert = {
  createAlert: RequestHandler,
  getAlert: RequestHandler, 
  updateAlert: RequestHandler,
  deleteAlert: RequestHandler
};
  
export type cluster = {
  postPods: RequestHandler, 
  postNodes: RequestHandler, 
  postServices: RequestHandler, 
  deleteRows: RequestHandler, 
  getAll: RequestHandler,
  postSnapshot: RequestHandler, 
  getHistory: RequestHandler
}; 

export type k8scontroller = {
  getPods: RequestHandler,
  getNodes: RequestHandler,
  getServices: RequestHandler
}

export type settingcontroller = {
  changeFile: RequestHandler,
  getEnv: RequestHandler,
  addTables: RequestHandler
}