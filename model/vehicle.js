'use strict';

const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    unique: true,
  },
  wheels: {
    type: Number,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('vehicle', vehicleSchema);
