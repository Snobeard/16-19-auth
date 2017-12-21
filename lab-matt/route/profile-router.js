'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpError = require('http-errors');
const Profile = require('../model/profile');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new httpError(404, '__ERROR__ not found'));
  }

  return new Profile({
    ...request.body,
    account: request.account._id,
  }).save()
  .then(profile => response.json(profile))
  .catch(next);
});