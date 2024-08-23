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

  console.log(values);
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

}

module.exports = alertController;