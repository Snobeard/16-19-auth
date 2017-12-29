'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpError = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const Vehicle = require('../model/vehicle');

const vehicleRouter = module.exports = new Router();

vehicleRouter.post('/vehicles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new httpError(404, '__ERROR__ account not found'));
  }

  return new Vehicle({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(savedVehicle => response.json(savedVehicle))
    .catch(next);
});

vehicleRouter.get('/vehicles/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new httpError(404, '__ERROR__ account not found'));
  }

  return Vehicle.findById(request.params.id)
    .then(foundVehicle => {
      if (!foundVehicle) {
        return next(new httpError(404, '__ERROR__ vehicle not found'));
      }

      return response.json(foundVehicle);
    })
    .catch(next);
});