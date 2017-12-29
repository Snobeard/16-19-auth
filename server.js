'use strict';

const express = require('express');
const mongoose = require('mongoose');
const log = require('./logger');

// ================ MONGO DB SETUP ===================
mongoose.Promise = Promise;

// ================ SERVER SETUP ===================
const app = express();

// ================ ROUTE SETUP ===================
app.use(require('./logger-middleware'));

app.use(require('../route/account-router'));
app.use(require('../route/profile-router'));
app.use(require('../route/vehicle-router'));
app.use(require('../route/image-router'));

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.all('*', (request, response) => {
  log('info', '__404__ They don\'t think it be like it is, but it do.');
  return response.status(404).send('__404__ They Don\'t think it be like it is, but it do');
});

app.use(require('./error-middleware'));

// ================ SERVER USE ===================
app.listen(process.env.PORT, () => {
  log('verbose', `Server is listening on port: ${process.env.PORT}`);
});