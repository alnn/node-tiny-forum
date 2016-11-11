'use strict';
const mongoose = require('../mongoose');

const MessageSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);
