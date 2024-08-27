const db = require("../models/alertModel");

const clusterController = {};

clusterController.postPods = async (req, res, next) => {
  try {
    res.locals.pods.map((podObject) => {
      const { name, namespace, uid } = podObject.metadata;
      const { nodeName } = podObject.spec;
      const values = ['pod', name, namespace, uid, nodeName];

      const qstring = `INSERT INTO cluster (category, name, namespace, uid, nodename)
      VALUES ($1, $2, $3, $4, $5)`;

      // db.query(qstring, values)
      //   .catch((err) => { return next(err); })
    })
  }
  catch(err){
    return next(err);
  }
  // console.log('res locals pods data: ', res.locals.pods[0].metadata.name, ', ', res.locals.pods[0].metadata.generateName,
  //   ', ', res.locals.pods[0].metadata.namespace, ', ', res.locals.pods[0].metadata.uid
  // );
  // console.log('res locals pods data: ', res.locals.pods[0].spec.nodeName);
}


module.exports = clusterController;