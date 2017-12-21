'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const Account = require('../model/account');
const log = require('../lib/logger');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('ACCOUNT - Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('POST /signup', () => {
    test(': creating account responds with a 200 and a token if no errors', () => {
      return superagent.post(`${__API_URL__}/signup`)
        .send({
          username: 'sno',
          password: 'beard',
          email: 'sno@balz.com',
        })
        .then(response => {
          log('verbose', response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test(': sending an incomplete account results in a 400 status', () => {
      return superagent.post(`${__API_URL__}/signup`)
        .send({
          username: 'sno',
          email: 'sno@balz.com',
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });

    test(': sending a duplicate key results in a 409 status', () => {
      return Account.create('sno', 'beard', 'sno@beer.com')
        .then(() => {
          return superagent.post(`${__API_URL__}/signup`)
            .send({
              username: 'sno',
              password: 'beard',
              email: 'sno@beer.com',
            })
            .then(Promise.reject)
            .catch(error => {
              // console.log('TEST ERROR: ', error);
              expect(error.status).toEqual(409);
            });
        });
    });

    describe('GET /login', () => {
      test('should respond with a 200 status code and  a token if no errors', () => {
        return accountMock.create()
          .then(mock => {
            return superagent.get(`${__API_URL__}/login`)
              .auth(mock.request.username, mock.request.password);
          })
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.token).toBeTruthy();
          });
      });
    });
  });
});