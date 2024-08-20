const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const cors = require('cors');

const router = require('./router/router')

app.use(cors());
app.use(express.json());







app.use((req, res) =>
    res.status(404).send("This is not the page you are looking for...")
  );

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });