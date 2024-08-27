const express = require ('express');

const router = express.Router();
const clusterController = require('../controllers/clusterController');
const k8sController = require('../controllers/k8sController');

router.get('/',
  (req, res) => {
    return res.status(200).json('hello there');
  }
)

router.post('/postPods',
  k8sController.getPods,
  //clusterController.postObject,
  (req, res) => {
    return res.status(200).json(res.locals.pods);
  }
)

router.post('/postNodes',
  k8sController.getNodes,
  //clusterController.postObject,
  (req, res) => {
    return res.status(200).json(res.locals.nodes);
  }
)

router.post('/postServices',
  k8sController.getServices,
  //clusterController.postObject,
  (req, res) => {
    return res.status(200).json(res.locals.services);
  }
)


module.exports = router;