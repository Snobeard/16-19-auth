'use strict';

const express = require('express');
const mongoose = require('mongoose');
const log = require('./logger');

// ================ MONGO DB SETUP ===================
mongoose.Promise = Promise;

// ================ SERVER SETUP ===================
const server = module.exports = {};

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
let isServerOn = false;
let httpServer = null;

server.start = () => {
  return new Promise((resolve, reject) => {

    if (isServerOn) {
      log('error', '__SERVER_ERROR__ Server is already on');
      return reject(new Error('__SERVER_ERROR__ Server is already on'));
    }
    httpServer = app.listen(process.env.PORT, () => {
      isServerOn = true;
      log('verbose', `Server is listening on port: ${process.env.PORT}`);
      return resolve();
    });
  })
    .then(() => {
      mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
    });
};

server.stop = () => {
  return new Promise((resolve, reject) => {

    if (!isServerOn) {
      log('error', '__SERVER_ERROR__ Server is already off');
      return reject(new Error('__SERVER_ERROR__ Server is already off'));
    }
    if (!httpServer) {
      log('error', '__SERVER_ERROR__ There is no server to close');
      return reject(new Error('__SERVER_ERROR__ There is no server to close'));
    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      log('info', `Server is shutting down`);
      return resolve();
    });
  })
    .then(() => {
      mongoose.disconnect();
    });
};