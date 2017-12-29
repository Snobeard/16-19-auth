'use strict';

// require('./lib/setup');
require('dotenv').config();

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('../__test__/lib/account-mock');
const vehicleMock = require('../__test__/lib/vehicle-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('VEHICLES', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(vehicleMock.remove);

  describe('POST /vehicles', () => {
    test(': returns a 200 and vehicle data if no errors', () => {
      let mockAccount = null;

      return accountMock.create()
        .then(mock => {
          mockAccount = mock;
          return superagent.post(`${__API_URL__}/vehicles`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .send({
              vehicleType: 'motorcycle',
              capacity: 2,
              wheels: 2,
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(mockAccount.account._id.toString());
          expect(response.body.vehicleType).toEqual('motorcycle');
          expect(response.body.capacity).toEqual(2);
          expect(response.body.wheels).toEqual(2);
          expect(response.body._id).not.toEqual(response.body.account);
        });
    });

    test(': returns a 400 due to an incomplete request', () => {
      let mockAccount = null;

      return accountMock.create()
        .then(mock => {
          mockAccount = mock;
          return superagent.post(`${__API_URL__}/vehicles`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .send({
              capacity: 2,
              wheels: 2,
            });
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
    
    test(': returns a 401 due to a bad token', () => {
      return superagent.post(`${__API_URL__}/vehicles`)
        .set('Authorization', `Bearer unAuthorizedToken`)
        .send({
          vehicleType: 'motorcycle',
          capacity: 2,
          wheels: 2,
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });
    });

    test(': returns a 404 due to a bad request url', () => {
      return superagent.post(`${__API_URL__}/vehicle`)
        .set('Authorization', `Bearer unAuthorizedToken`)
        .send({
          vehicleType: 'motorcycle',
          capacity: 2,
          wheels: 2,
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  describe('GET /vehicles/:id', () => {
    test(': returns a 200 and vehicle data based on id if no errors', () => {
      let vehicleAndAccount = null;

      return vehicleMock.create()
        .then(mockObject => {
          vehicleAndAccount = mockObject;

          return superagent.get(`${__API_URL__}/vehicles/${vehicleAndAccount.vehicle._id}`)
            .set('Authorization', `Bearer ${vehicleAndAccount.account.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(vehicleAndAccount.account.account._id.toString());
          expect(response.body.vehicleType).toEqual(vehicleAndAccount.vehicle.vehicleType);
          expect(response.body.capacity).toEqual(vehicleAndAccount.vehicle.capacity);
          expect(response.body.wheels).toEqual(vehicleAndAccount.vehicle.wheels);
          expect(response.body._id).not.toEqual(vehicleAndAccount.vehicle._id);
        });
    });

    test(': returns a 401 if using a bad token', () => {
      let vehicleAndAccount = null;

      return vehicleMock.create()
        .then(mockObject => {
          vehicleAndAccount = mockObject;

          return superagent.get(`${__API_URL__}/vehicles/${vehicleAndAccount.vehicle._id}`)
            .set('Authorization', `Bearer insertBadTokenHere`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });
    });

    test(': returns a 404 if there is a bad vehicle id', () => {
      let vehicleAndAccount = null;

      return vehicleMock.create()
        .then(mockObject => {
          vehicleAndAccount = mockObject;

          return superagent.get(`${__API_URL__}/vehicles/1234`)
            .set('Authorization', `Bearer ${vehicleAndAccount.account.token}`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });
});