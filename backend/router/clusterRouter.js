const express = require ('express');

const router = express.Router();
const clusterController = require('../controllers/clusterController');
const k8sController = require('../controllers/k8sController');

router.get('/all',
  clusterController.getAll,
  (req, res) => {
    return res.status(200).json(res.locals.cluster);
  }
)

router.get('/refresh',
  clusterController.deleteRows,
  k8sController.getPods,
  k8sController.getNodes,
  k8sController.getServices,
  clusterController.postPods,
  clusterController.postNodes,
  clusterController.postServices,
  clusterController.getAll,
  (req, res) => {
    return res.status(200).json(res.locals.cluster);
  }
)

router.get('/history',
  clusterController.getHistory,
  (req, res) => {
    return res.status(200).json(res.locals.history);
  }
)

router.post('/postAll',
  k8sController.getPods,
  k8sController.getNodes,
  k8sController.getServices,
  clusterController.postSnapshot,
  (req, res) => {
    return res.status(200).json(res.locals.cluster);
  }
)

router.post('/postPods',
  k8sController.getPods,
  clusterController.postPods,
  (req, res) => {
    return res.status(200).json(res.locals.pods);
  }
)

router.post('/postNodes',
  k8sController.getNodes,
  clusterController.postNodes,
  (req, res) => {
    return res.status(200).json(res.locals.nodes);
  }
)

router.post('/postServices',
  k8sController.getServices,
  clusterController.postServices,
  (req, res) => {
    return res.status(200).json(res.locals.services);
  }
)


module.exports = router;