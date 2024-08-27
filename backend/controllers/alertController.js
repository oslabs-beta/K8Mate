const db = require("../models/alertModel");

const alertController = {};

alertController.createAlert = (req, res, next) => {
  const {id, name, log, category} = req.body;
  // const dates = Date().split(' ').slice(0,5);
  // const str = `${dates[0]} ${dates[1]} ${dates[2]} ${dates[3]} ${dates[4]}`;
  // console.log(str);
  const values = [category, id, name, log];
  const qstring = `INSERT INTO alerts (category, node_id, node_name, log)
                  VALUES ($1, $2, $3, $4)`;
  db.query(qstring, values)
    .then((data) => {
      console.log('went through');
      res.locals.alert = data;
      return next();
    })
    .catch((err) => {
      console.log('not working')
      return next(err);
    });
}

alertController.getAlert = (req, res, next) => {
  const qstring = `SELECT * FROM alerts`;

  db.query(qstring)
    .then((data) => {
      res.locals.alerts = data.rows;
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

alertController.updateAlert = (req, res, next) => {
  const {id, name, status, db_id} = req.body;
  const values = [id, name, status, db_id]
  const qstring = `UPDATE alerts SET read = $3 WHERE (node_id = $1 AND node_name = $2 AND id = $4)`;

  db.query(qstring, values)
    .then((data) => {
      res.locals.alert = data;
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

alertController.deleteAlert = (req, res, next) => {
  const {id, log} = req.body;
  const values = [id, log]
  const qstring = `DELETE FROM alerts WHERE (id = $1 AND log = $2)`;

  db.query(qstring, values)
    .then((data) => {
      res.locals.alert = data;
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}
module.exports = alertController;