const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('config');
const NotFoundError = require('./lib/errors/NotFoundError');
const app = express();

app.use(cors());

// Modes: combined, common, dev, short, tiny
// See https://www.npmjs.com/package/morgan#predefined-formats
app.use(morgan(config.get('log.mode')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

app.use('/v1/', require('./routes/v1'));

app.use((req, res, next) => {
  throw new NotFoundError();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.code || 500).send({
    error: err
  });
});

module.exports = app;
