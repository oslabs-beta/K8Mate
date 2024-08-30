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