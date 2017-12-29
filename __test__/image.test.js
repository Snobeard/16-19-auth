'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const imageMock = require('./lib/image-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('IMAGES', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);

  describe('POST /images', () => {
    test(': should respond with a 200 status code and a json representation of the resource if no errors', () => {
      let mockAccount = null;
      return accountMock.create()
        .then(newAccount => {
          mockAccount = newAccount;

          return superagent.post(`${__API_URL__}/images`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .field('title', 'Demi')
            .attach('image', `${__dirname}/assets/demi.jpg`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Demi');
          expect(response.body.url).toBeTruthy();
          expect(response.body._id).toBeTruthy();
        });
    });
    
    test(': should respond with a 400 status due to a bad request - (changing fieldName)', () => {
      let mockAccount = null;
      return accountMock.create()
        .then(newAccount => {
          mockAccount = newAccount;

          return superagent.post(`${__API_URL__}/images`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .field('source', 'Demi')
            .attach('image', `${__dirname}/assets/demi.jpg`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(400);
        });  
    });

    test(': should respond with a 401 status due a bad token', () => {
      return superagent.post(`${__API_URL__}/images`)
        .set('Authorization', `Bearer insertRandomTokenHere`)
        .field('image', 'Demi')
        .attach('image', `${__dirname}/assets/demi.jpg`)
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });  
    });
  });

  describe('GET /images/:id', () => {
    test(': should respond with a 200 status code and a json representation of the resource if no errors', () => {
      let mock = null;
      return imageMock.create()
        .then(mockObject => {
          mock = mockObject;

          return superagent.get(`${__API_URL__}/images/${mockObject.image._id}`)
            .set('Authorization', `Bearer ${mockObject.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(mock.image.title);
          expect(response.body.url).toEqual(mock.image.url);
          expect(response.body.account).toEqual(mock.account._id.toString());
          expect(response.body._id).toEqual(mock.image._id.toString());
        });
    });
    
    test(': should respond with a 404 status code if there is a bad id', () => {
      return imageMock.create()
        .then(mockObject => {
          return superagent.get(`${__API_URL__}/images/aBadID`)
            .set('Authorization', `Bearer ${mockObject.token}`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });

    test(': should respond with a 401 status code if there is a bad token', () => {
      return imageMock.create()
        .then(mockObject => {
          return superagent.get(`${__API_URL__}/images/${mockObject.image._id}`)
            .set('Authorization', `Bearer insertBadTokenHere`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });
    });
  });

  describe('DELETE /images/:id', () => {
    test(': should respond with a 204 status code if image found and removed', () => {
      return imageMock.create()
        .then(mockObject => {

          return superagent.delete(`${__API_URL__}/images/${mockObject.image._id}`)
            .set('Authorization', `Bearer ${mockObject.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    
    test(': should respond with a 404 status code if no image is found', () => {
      return imageMock.create()
        .then(mockObject => {
          return superagent.delete(`${__API_URL__}/images/aBadID`)
            .set('Authorization', `Bearer ${mockObject.token}`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
    
    test(': should respond with a 401 status code if there is a bad token', () => {
      return imageMock.create()
        .then(mockObject => {
          return superagent.delete(`${__API_URL__}/images/${mockObject.image._id}`)
            .set('Authorization', `Bearer insertBadTokenHere`);
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });
    });
  });
});