'use strict';

// User model goes here
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String
});

module.exports = mongoose.model('User', userSchema);
