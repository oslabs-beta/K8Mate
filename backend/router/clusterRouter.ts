const express = require ('express');

const router = express.Router();
const clusterController = require('../controllers/clusterController.ts');
const k8sController = require('../controllers/k8sController.ts');

import { Request, Response } from 'express';

/* ------------ CLUSTER HISTORY ROUTES ------------ */
//get all existing CLUSTER HISTORY objects
router.get('/history',
  clusterController.getHistory,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.history);
  }
)

//post new recent cluster into CLUSTER HISTORY
router.post('/postAll',
  k8sController.getPods,
  k8sController.getNodes,
  k8sController.getServices,
  clusterController.postSnapshot,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.cluster);
  }
)


/* ---------- SINGLE TEST CLUSTER ROUTES ---------- */
//get all information on SINGLE test cluster
router.get('/all',
  clusterController.getAll,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.cluster);
  }
)

//refresh SINGLE test cluster page: delete rows, repost data, get all
router.get('/refresh',
  clusterController.deleteRows,
  k8sController.getPods,
  k8sController.getNodes,
  k8sController.getServices,
  clusterController.postPods,
  clusterController.postNodes,
  clusterController.postServices,
  clusterController.getAll,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.cluster);
  }
)

//post all recent pods into SINGLE cluster table
router.post('/postPods',
  k8sController.getPods,
  clusterController.postPods,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.pods);
  }
)

//post all recent nodes into SINGLE cluster table
router.post('/postNodes',
  k8sController.getNodes,
  clusterController.postNodes,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.nodes);
  }
)

//post all recent services into SINGLE cluster table
router.post('/postServices',
  k8sController.getServices,
  clusterController.postServices,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.services);
  }
)


module.exports = router;