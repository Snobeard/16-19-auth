'use strict';

const faker = require('faker');

const accountMock = require('./account-mock');
const Image = require('../../model/image');

const imageMock = module.exports = {};

imageMock.create = () => {
  let mockObject = {};

  return accountMock.create()
    .then(newAccount => {
      mockObject = newAccount;
      return new Image({
        account: newAccount.account._id,
        title: faker.lorem.words(8),
        url: faker.random.image(),
      }).save();
    })
    .then(savedImage => {
      mockObject.image = savedImage;
      return mockObject;
    });
};

imageMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Image.remove({}),
  ]);
};