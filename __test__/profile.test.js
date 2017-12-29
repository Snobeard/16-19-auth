'use strict';

// require('./lib/setup');
require('dotenv').config();

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('../__test__/lib/account-mock');
const profileMock = require('../__test__/lib/profile-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('PROFILES', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('returns a 200 and profile data if no errors', () => {
      let mockAccount = null;

      return accountMock.create()
        .then(mock => {
          mockAccount = mock;
          return superagent.post(`${__API_URL__}/profiles`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .send({
              bio: 'I is cat',
              firstName: 'Leonard',
              lastName: 'Maximus',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(mockAccount.account._id.toString());
          expect(response.body.firstName).toEqual('Leonard');
          expect(response.body.lastName).toEqual('Maximus');
          expect(response.body.bio).toEqual('I is cat');
          expect(response.body._id).not.toEqual(response.body.account);
        });
    });
  });
});