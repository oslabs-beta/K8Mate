const db = require("../models/dbModel.ts");

import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
import { cluster } from '../../types.ts';

const clusterController: cluster = {postPods: ()=>{}, postNodes: ()=>{}, postServices: ()=>{}, deleteRows: ()=>{}, getAll: ()=>{}, 
  postSnapshot: ()=>{}, getHistory: ()=> {}};


async function alertQuery(qstring: string, values?: any[]): Promise<QueryResult>{
  const result = await db.query(qstring, values);
  return result;
};

/* -------------------------------- CLUSTER HISTORY MIDDLEWARE -------------------------------- */

//posts a current "snapshot" of the cluster on to the database history table
clusterController.postSnapshot = (req: Request, res: Response, next: NextFunction) => {
  const info: {pods: any[], nodes: any[], services: any[]} = {pods: [], nodes: [], services: []};

  //put all current pods information from response object into info object
  res.locals.pods.map((podObject: any) => {
    const { name, namespace, uid, creationTimestamp, labels } = podObject.metadata;
    const { nodeName, containers } = podObject.spec;
    const containerArray: string[] = [];
    containers.forEach((ele: any) => { containerArray.push(ele.name); })
    info.pods.push({category: 'pods', name, uid, creationTimestamp, data: {namespace, nodeName, labels, containers: containerArray}})
  });

  //put all current nodes information from response object into info object
  res.locals.nodes.map((nodeObject: any) => {
    const { name, uid, creationTimestamp } = nodeObject.metadata;
    const clusterName = nodeObject.metadata.labels["alpha.eksctl.io/cluster-name"];
    const nodegroupName = nodeObject.metadata.labels["alpha.eksctl.io/nodegroup-name"];
    const instanceType = nodeObject.metadata.labels["node.kubernetes.io/instance-type"];
    const region = nodeObject.metadata.labels["topology.kubernetes.io/region"];

    info.nodes.push({category: 'node', name, uid, creationTimestamp, data: {clusterName, nodegroupName, instanceType, region}})
  });

  //put all current services information from response object into info object
  res.locals.services.map((serviceObject: any) => {
    const { name, namespace, uid, creationTimestamp } = serviceObject.metadata;
    const { selector } = serviceObject.spec;
    info.services.push({category: 'services', name, uid, creationTimestamp, data: {namespace, selector}});
  });

  //insert new "snapshot" of cluster into history table --> current timestamp will be auto generated
  alertQuery(`INSERT INTO clusters (data) VALUES ($1)`, [info])
    .then(() => {
      res.locals.cluster = info;
      return next();        
    })
    .catch((err: Error) => {
      return next(err);
    });
}

//gets all posted clusters from the history table
clusterController.getHistory = (req: Request, res: Response, next: NextFunction) => {
  alertQuery(`SELECT * FROM clusters ORDER BY id ASC`)
    .then((data) => {
      res.locals.history = data.rows;
      return next();
    })
    .catch ((err: Error) => {
    return next(err);
    });
}

/* ------------------------------ SINGLE TEST CLUSTER MIDDELWARE ------------------------------ */

//all rows in the single test cluster table have the same column labels
//data column contains the different information
const qstring = `INSERT INTO cluster (category, name, uid, created_at, data)
VALUES ($1, $2, $3, $4, $5)`;

//posts all current pod information into the single test cluster table
clusterController.postPods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cycles through the pods array, pulls necessary data, and posts each pod into the database
    res.locals.pods.map((podObject: any) => {
      const { name, namespace, uid, creationTimestamp, labels } = podObject.metadata;
      const { nodeName, containers } = podObject.spec;
      const containerArray: string[] = [];
      containers.forEach((ele: any) => { containerArray.push(ele.name); })
      const values = ['pod', name, uid, creationTimestamp, {namespace, nodeName, labels, containers: containerArray}];

      alertQuery(qstring, values)
    });

    return next();
  } catch (err){
    return next(err);
  };
}

//posts all current node information into the single test cluster table
clusterController.postNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cycles through the nodes array, pulls necessary data, and posts each pod into the database 
    res.locals.nodes.map((nodeObject: any) => {
      const { name, uid, creationTimestamp } = nodeObject.metadata;
      const clusterName = nodeObject.metadata.labels["alpha.eksctl.io/cluster-name"];
      const nodegroupName = nodeObject.metadata.labels["alpha.eksctl.io/nodegroup-name"];
      const instanceType = nodeObject.metadata.labels["node.kubernetes.io/instance-type"];
      const region = nodeObject.metadata.labels["topology.kubernetes.io/region"];

      const values = ['node', name, uid, creationTimestamp, {clusterName, nodegroupName, instanceType, region}];

      alertQuery(qstring, values)
    });

    return next();
  } catch (err){
    return next(err);
  };
}

//posts all current service information into the single test cluster table
clusterController.postServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cycles through the services array, pulls necessary data, and posts each pod into the database
    res.locals.services.map((serviceObject: any) => {
      const { name, namespace, uid, creationTimestamp } = serviceObject.metadata;
      const { selector } = serviceObject.spec;
      const values = ['service', name, uid, creationTimestamp, {namespace, selector}];

      alertQuery(qstring, values)
    });

    return next();
  } catch (err){
    return next(err);
  };
}

//gets all information from the single test cluster table
clusterController.getAll = (req: Request, res: Response, next: NextFunction) => {
  alertQuery(`SELECT * FROM cluster`)
    .then((data) => {
      res.locals.cluster = data.rows;
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    });
}

//delete all rows from single test cluster table
clusterController.deleteRows = (req: Request, res: Response, next: NextFunction) => {
  alertQuery(`DELETE FROM cluster`)
    .then(() => {
      return next();
    })
    .catch ((err: Error) => {
      return next(err);
    });
}

module.exports = clusterController;
