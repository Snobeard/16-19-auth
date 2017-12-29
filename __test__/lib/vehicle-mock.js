'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Vehicle = require('../../model/vehicle');

const vehicleMock = module.exports = {};

vehicleMock.create = () => {
  let mockObject = {};

  return accountMock.create()
    .then(newAccount => {
      mockObject.account = newAccount;

      return new Vehicle({
        vehicleType: faker.random.arrayElement(['mini-van', 'motorcycle', 'truck', 'mini cooper', 'sedan', 'coupe']),
        capacity: faker.random.number({max: 18}),
        wheels: faker.random.number({max: 4}),
        account: newAccount.account._id,
      }).save();
    })
    .then(newVehicle => {
      mockObject.vehicle = newVehicle;
      return mockObject;
    });
};

vehicleMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Vehicle.remove({}),
  ]);
};