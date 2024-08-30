const db = require("../models/alertModel");

const clusterController = {};

const qstring = `INSERT INTO cluster (category, name, uid, created_at, data)
VALUES ($1, $2, $3, $4, $5)`;

clusterController.postPods = async (req, res, next) => {
  try {
    res.locals.pods.map((podObject) => {
      const { name, namespace, uid, creationTimestamp, labels } = podObject.metadata;
      const { nodeName, containers } = podObject.spec;
      const values = ['pod', name, uid, creationTimestamp, {namespace, nodeName, labels, containers}];

      db.query(qstring, values)
        .catch((err) => { return next(err); })
    });

    return next();
  }
  catch (err){
    return next(err);
  }
  // console.log('res locals pods data: ', res.locals.pods[0].metadata.name, ', ', res.locals.pods[0].metadata.generateName,
  //   ', ', res.locals.pods[0].metadata.namespace, ', ', res.locals.pods[0].metadata.uid
  // );
  // console.log('res locals pods data: ', res.locals.pods[0].spec.nodeName);
}

clusterController.postNodes = async (req, res, next) => {
  try {
    res.locals.nodes.map((nodeObject) => {
      const { name, uid, creationTimestamp } = nodeObject.metadata;
      const clusterName = nodeObject.metadata.labels["alpha.eksctl.io/cluster-name"];
      const nodegroupName = nodeObject.metadata.labels["alpha.eksctl.io/nodegroup-name"];
      const instanceType = nodeObject.metadata.labels["node.kubernetes.io/instance-type"];
      const region = nodeObject.metadata.labels["topology.kubernetes.io/region"];

      const values = ['node', name, uid, creationTimestamp, {clusterName, nodegroupName, instanceType, region}];

      db.query(qstring, values)
        .catch((err) => { return next(err); })

    });

    return next();
  }
  catch (err){
    return next(err);
  }
}

clusterController.postServices = async (req, res, next) => {
  try {
    res.locals.services.map((serviceObject) => {
      const { name, namespace, uid, creationTimestamp } = serviceObject.metadata;
      const { selector } = serviceObject.spec;
      const values = ['service', name, uid, creationTimestamp, {namespace, selector}];

      db.query(qstring, values)
        .catch((err) => { return next(err); })
    });

    return next();
  }
  catch (err){
    return next(err);
  }
}

clusterController.postSnapshot = async (req, res, next) => {
  try {
    const info = {pods: [], nodes: [], services: []};

    res.locals.pods.map((podObject) => {
      const { name, namespace, uid, creationTimestamp, labels } = podObject.metadata;
      const { nodeName, containers } = podObject.spec;
      info.pods.push({category: 'pods', name, uid, creationTimestamp, data: {namespace, nodeName, labels, containers}})
    });

    res.locals.nodes.map((nodeObject) => {
      const { name, uid, creationTimestamp } = nodeObject.metadata;
      const clusterName = nodeObject.metadata.labels["alpha.eksctl.io/cluster-name"];
      const nodegroupName = nodeObject.metadata.labels["alpha.eksctl.io/nodegroup-name"];
      const instanceType = nodeObject.metadata.labels["node.kubernetes.io/instance-type"];
      const region = nodeObject.metadata.labels["topology.kubernetes.io/region"];

      info.nodes.push({category: 'node', name, uid, creationTimestamp, data: {clusterName, nodegroupName, instanceType, region}})
    });

    res.locals.services.map((serviceObject) => {
      const { name, namespace, uid, creationTimestamp } = serviceObject.metadata;
      const { selector } = serviceObject.spec;
      info.services.push({category: 'services', name, uid, creationTimestamp, data: {namespace, selector}});
    });

    db.query(`INSERT INTO clusters (data) VALUES ($1)`, [info])
      .then(() => {
        res.locals.cluster = info;
        return next();        
      })
  } catch (err) {
    return next(err);
  };
}

clusterController.deleteRows = async (req, res, next) => {
  try {
    db.query(`DELETE FROM cluster`)
    .then(() => {
      return next();
    })
  } catch (err) {
    return next(err);
  }
}


clusterController.getAll = (req, res, next) => {
  try {
    db.query(`SELECT * FROM cluster`)
    .then((data) => {
      res.locals.cluster = data.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    })
  }
  catch (err){
    return next(err);
  }
}

clusterController.getHistory = (req, res, next) => {
  try {
    db.query(`SELECT * FROM clusters`)
    .then((data) => {
      res.locals.history = data.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    })
  }
  catch (err){
    return next(err);
  }
}


module.exports = clusterController;