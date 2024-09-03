const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

import { Request, Response, NextFunction } from 'express';
import { k8scontroller } from '../../types.ts';

const k8sController: k8scontroller = {getPods: ()=>{}, getNodes: ()=>{}, getServices: ()=>{}};

//gets all pod information from the cluster and passes it into the response locals object
k8sController.getPods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    res.locals.pods = response.response.body.items;
    return next();
  } catch (err) {
    return next(err);
  }
}

//gets all node information from the cluster and passes it into the response locals object
k8sController.getNodes = async (req: Request, res: Response, next: NextFunction) => {
  console.log('getting nodes');
  try {
    const response = await k8sApi.listNode();
    res.locals.nodes = response.response.body.items;
    console.log(res.locals.nodes);
    return next();
  } catch (err) {
    return next(err);
  }
}

//gets all service information from the cluster and passes it into the response locals object
k8sController.getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await k8sApi.listServiceForAllNamespaces();
    res.locals.services = response.response.body.items;
    console.log(res.locals.services);;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = k8sController;