'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Profile = require('../../model/profile');

const profileMock = module.exports = {};

profileMock.create = () => {
  let mockObject = {};

  return accountMock.create()
    .then(newAccount => {
      mockObject.account = newAccount;
      return new Profile({
        bio: faker.lorem.words(100),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: mockObject.account._id,
      }).save();
    })
    .then(newProfile => {
      mockObject.profile = newProfile;
      return mockObject;
    });
};

profileMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Profile.remove({}),
  ]);
};