const db = require("../models/alertModel");
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const k8sController = {};

k8sController.getPods = async (req, res, next) => {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    res.locals.pods = response.response.body.items;
    // console.log(Object.keys(res.locals.pods[0].metadata));
    // console.log(Object.keys(res.locals.pods[0].spec));    
    // console.log('res locals pods data: ', res.locals.pods[0].metadata.name, ', ', res.locals.pods[0].metadata.generateName,
    //   ', ', res.locals.pods[0].metadata.namespace, ', ', res.locals.pods[0].metadata.uid
    // );
    // console.log('res locals pods data: ', res.locals.pods[0].spec.nodeName);
    // console.log(res.locals.pods[0].spec.containers)
    return next();
  } catch (err) {
    return next(err);
  }
}

k8sController.getNodes = async (req, res, next) => {
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

k8sController.getServices = async (req, res, next) => {
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